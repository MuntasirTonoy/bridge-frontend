'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import axios from '@/lib/axios';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar/Sidebar';
import ChatArea from '@/components/ChatArea/ChatArea';
import Avatar from '@/components/Avatar/Avatar';
import ProfilePanel from '@/components/ProfilePanel/ProfilePanel';
import UserProfileModal from '@/components/UserProfileModal/UserProfileModal';
import { useSocket } from '@/components/SocketProvider';

export default function ChatPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { socket, onlineUsers } = useSocket() || {};
  
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [activeMessages, setActiveMessages] = useState([]);
  
  const [isDark, setIsDark] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const isInitialMount = useRef(true);

  const [archivedChatsIds, setArchivedChatsIds] = useState([]);
  const [blockedUsersIds, setBlockedUsersIds] = useState([]);
  const [forwardingMsg, setForwardingMsg] = useState(null);

  // Mobile navigation: 'sidebar' | 'chat'
  const [activeMobileView, setActiveMobileView] = useState('sidebar');

  // Helper to format date
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    return d.toLocaleDateString();
  };

  // Helper to format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Apply theme
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('bridge-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const saved = localStorage.getItem('bridge-theme');
    if (saved === 'dark') setIsDark(true);
  }, []);

  // Fetch users and conversations on load
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        try {
          const [usersRes, convsRes, profileRes] = await Promise.all([
            axios.get('/auth/users'),
            axios.get('/chats/conversations'),
            axios.get('/auth/profile')
          ]);
          setContacts(usersRes.data);
          setConversations(convsRes.data);
          const archived = profileRes.data.archivedChats || [];
          const blocked = profileRes.data.blockedUsers || [];
          setArchivedChatsIds(archived);
          setBlockedUsersIds(blocked);
          
          const hasConv = (userId) => convsRes.data.some(cv => cv.participants.some(p => p._id === userId));
          const firstWithConv = usersRes.data.find(u => hasConv(u._id) && !archived.includes(u._id) && !blocked.includes(u._id));
          if (firstWithConv && !activeContactId) {
            setActiveContactId(firstWithConv._id);
          }
        } catch (error) {
          console.error('Failed to fetch data:', error);
          toast.error('Failed to load chat data');
        }
      };
      fetchData();
    }
  }, [status]);

  // Fetch messages when active contact changes
  useEffect(() => {
    if (activeContactId && status === 'authenticated') {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`/chats/messages/${activeContactId}`);
          
          // Format messages for ChatArea
          const formatted = res.data.map(m => ({
            id: m._id,
            senderId: m.senderId === session.user.id ? 'me' : m.senderId,
            text: m.text,
            fileUrl: m.fileUrl,
            fileType: m.fileType,
            filePublicId: m.filePublicId,
            isRead: m.isRead,
            time: formatTime(m.createdAt),
            date: formatDate(m.createdAt),
            rawDate: new Date(m.createdAt)
          }));
          setActiveMessages(formatted);

          if (socket) {
            socket.emit('markMessagesRead', { senderId: activeContactId, receiverId: session.user.id });
          }
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };
      fetchMessages();
    }
  }, [activeContactId, status]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      // Update active messages if the message is for the current active chat
      if (
        (message.senderId === activeContactId && message.receiverId === session?.user?.id) ||
        (message.senderId === session?.user?.id && message.receiverId === activeContactId)
      ) {
        if (message.senderId === activeContactId) {
          socket.emit('markMessagesRead', { senderId: activeContactId, receiverId: session?.user?.id });
        }

        // Check if message already exists (to avoid duplicates from optimistic UI)
        setActiveMessages(prev => {
          if (prev.some(m => m.id === message._id || (m.isOptimistic && m.text === message.text))) {
            return prev.map(m => m.isOptimistic && m.text === message.text ? {
              ...m,
              id: message._id,
              isOptimistic: false,
              isRead: message.isRead,
              time: formatTime(message.createdAt)
            } : m);
          }
          return [...prev, {
            id: message._id,
            senderId: message.senderId === session?.user?.id ? 'me' : message.senderId,
            text: message.text,
            fileUrl: message.fileUrl,
            fileType: message.fileType,
            filePublicId: message.filePublicId,
            isRead: message.senderId === session?.user?.id ? message.isRead : true,
            time: formatTime(message.createdAt || new Date()),
            date: formatDate(message.createdAt || new Date()),
          }];
        });
      }

      // Update conversations list and contacts (to capture new users)
      axios.get('/chats/conversations').then(res => setConversations(res.data)).catch(console.error);
      axios.get('/auth/users').then(res => setContacts(res.data)).catch(console.error);
    };

    const handleUpdateMessage = (updatedMsg) => {
      setActiveMessages(prev => prev.map(m => m.id === updatedMsg._id ? {
        ...m,
        text: updatedMsg.text,
        isEdited: true
      } : m));
      // Refresh sidebar to update last message preview if it was edited
      axios.get('/chats/conversations').then(res => setConversations(res.data)).catch(console.error);
    };

    const handleRemoveMessage = ({ messageId }) => {
      setActiveMessages(prev => prev.filter(m => m.id !== messageId));
      // Refresh sidebar to update last message preview if it was deleted
      axios.get('/chats/conversations').then(res => setConversations(res.data)).catch(console.error);
    };

    const handleUserTyping = ({ senderId }) => {
      if (senderId === activeContactId) setIsTyping(true);
    };

    const handleUserStopTyping = ({ senderId }) => {
      if (senderId === activeContactId) setIsTyping(false);
    };

    const handleMessagesRead = ({ receiverId }) => {
      if (receiverId === activeContactId) {
        setActiveMessages(prev => prev.map(m => m.senderId === 'me' ? { ...m, isRead: true } : m));
        // Refresh conversations to potentially clear unread badges (if implemented)
        axios.get('/chats/conversations').then(res => setConversations(res.data)).catch(console.error);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('messageUpdated', handleUpdateMessage);
    socket.on('messageDeleted', handleRemoveMessage);
    socket.on('userTyping', handleUserTyping);
    socket.on('userStopTyping', handleUserStopTyping);
    socket.on('messagesRead', handleMessagesRead);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('messageUpdated', handleUpdateMessage);
      socket.off('messageDeleted', handleRemoveMessage);
      socket.off('userTyping', handleUserTyping);
      socket.off('userStopTyping', handleUserStopTyping);
      socket.off('messagesRead', handleMessagesRead);
    };
  }, [socket, activeContactId, session?.user?.id]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen bg-bg-primary text-white">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const currentUser = {
    id: session.user.id,
    name: session.user.name || session.user.username,
    username: session.user.username,
    email: session.user.email,
    avatar: session.user.profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${session.user.username}`,
    initials: (session.user.name || session.user.username).substring(0, 2).toUpperCase(),
    location: session.user.location || "",
    bio: session.user.bio || "",
    joinedDate: "Recently",
    isOnline: true,
  };

  // Map contacts to match frontend structure
  const formattedContacts = contacts.map(c => {
    const isOnline = onlineUsers?.includes(c._id);
    
    // Find conversation for this contact to get last message
    const conv = conversations.find(cv => cv.participants.some(p => p._id === c._id));
    
    return {
      id: c._id,
      name: c.name,
      username: `@${c.username}`,
      email: c.email,
      location: c.location || "",
      avatar: c.profilePic || `https://api.dicebear.com/7.x/adventurer/svg?seed=${c.username}`,
      isOnline,
      about: c.bio || "",
      sharedMedia: [],
      extraMedia: 0,
      _lastMessageText: conv?.lastMessage?.text || (conv?.lastMessage?.fileType === 'image' ? "📷 Image" : conv?.lastMessage?.fileType === 'pdf' ? "📄 PDF" : conv?.lastMessage?.fileType === 'voice' ? "🎤 Voice" : "No messages yet"),
      _lastMessageTime: conv?.lastMessage ? formatTime(conv.lastMessage.createdAt) : "",
      _lastUpdated: conv?.lastUpdated || 0,
      _hasConversation: !!conv,
      unreadCount: conv?.unreadCount || 0,
      _isArchived: archivedChatsIds.includes(c._id),
      _isBlocked: blockedUsersIds.includes(c._id),
      hasBlockedMe: c.hasBlockedMe
    };
  }).sort((a, b) => new Date(b._lastUpdated) - new Date(a._lastUpdated));

  const activeContact = formattedContacts.find(c => c.id === activeContactId);
  const activeConversationData = {
    contactId: activeContactId,
    messages: activeMessages,
    isTyping
  };

  const handleSendMessage = async (text, fileData = {}, targetId = null) => {
    const recipientId = targetId || activeContactId;
    const tempId = fileData.tempId || `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      senderId: 'me',
      text,
      fileUrl: fileData.fileUrl,
      fileType: fileData.fileType || 'text',
      filePublicId: fileData.filePublicId,
      isUploading: fileData.isUploading || false,
      isRead: false,
      time: formatTime(new Date()),
      date: formatDate(new Date()),
      isOptimistic: true
    };

    // Only update UI if we're in the current chat
    if (recipientId === activeContactId) {
      setActiveMessages(prev => [...prev, optimisticMsg]);
    }

    // If it's a file upload starting, we don't send to backend yet
    if (fileData.isUploading) return tempId;

    try {
      const res = await axios.post('/chats/messages', {
        receiverId: recipientId,
        text,
        fileUrl: fileData.fileUrl,
        fileType: fileData.fileType,
        filePublicId: fileData.filePublicId
      });
      
      const newMsg = res.data;
      
      if (recipientId === activeContactId) {
        setActiveMessages(prev => prev.map(m => m.id === tempId ? {
          ...m,
          id: newMsg._id,
          isOptimistic: false,
          time: formatTime(newMsg.createdAt)
        } : m));
      }
      
      if (socket) {
        socket.emit('sendMessage', newMsg);
      }

      // Update conversations list
      const convsRes = await axios.get('/chats/conversations');
      setConversations(convsRes.data);
    } catch (error) {
      console.error('Failed to send message:', error);
      if (recipientId === activeContactId) {
        toast.error(error.response?.data?.message || 'Failed to send message');
        setActiveMessages(prev => prev.filter(m => m.id !== tempId));
      }
    }
  };

  const handleFinalizeFileMessage = async (tempId, finalData) => {
    try {
      const res = await axios.post('/chats/messages', {
        receiverId: activeContactId,
        text: null,
        fileUrl: finalData.fileUrl,
        fileType: finalData.fileType,
        filePublicId: finalData.filePublicId
      });
      
      const newMsg = res.data;
      
      setActiveMessages(prev => prev.map(m => m.id === tempId ? {
        ...m,
        id: newMsg._id,
        fileUrl: newMsg.fileUrl,
        filePublicId: newMsg.filePublicId,
        isUploading: false,
        isOptimistic: false,
        time: formatTime(newMsg.createdAt)
      } : m));
      
      if (socket) {
        socket.emit('sendMessage', newMsg);
      }
      
      const convsRes = await axios.get('/chats/conversations');
      setConversations(convsRes.data);
    } catch (error) {
      console.error('Finalize upload failed:', error);
      toast.error('Failed to complete upload');
      setActiveMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  const handleRemoveOptimisticMessage = (tempId) => {
    setActiveMessages(prev => prev.filter(m => m.id !== tempId));
  };

  const handleEditMessage = async (messageId, newText) => {
    try {
      const res = await axios.put(`/chats/messages/${messageId}`, { text: newText });
      setActiveMessages(prev => prev.map(m => m.id === messageId ? {
        ...m,
        text: res.data.text,
        isEdited: true
      } : m));
      
      if (socket) {
        socket.emit('editMessage', {
          _id: messageId,
          text: newText,
          receiverId: activeContactId
        });
      }
      
      const convsRes = await axios.get('/chats/conversations');
      setConversations(convsRes.data);
    } catch (error) {
      toast.error('Failed to edit message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`/chats/messages/${messageId}`);
      setActiveMessages(prev => prev.filter(m => m.id !== messageId));
      
      if (socket) {
        socket.emit('deleteMessage', {
          messageId,
          receiverId: activeContactId
        });
      }

      const convsRes = await axios.get('/chats/conversations');
      setConversations(convsRes.data);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleChatAction = (action, contactId, updatedList) => {
    if (action === 'archive') {
      setArchivedChatsIds(updatedList);
      if (updatedList.includes(contactId) && activeContactId === contactId) {
        setActiveContactId(null);
      }
    } else if (action === 'block') {
      setBlockedUsersIds(updatedList);
      if (updatedList.includes(contactId) && activeContactId === contactId) {
        setActiveContactId(null);
      }
    } else if (action === 'delete') {
      axios.get('/chats/conversations').then(res => {
        setConversations(res.data);
        if (activeContactId === contactId) setActiveContactId(null);
      }).catch(console.error);
    }
  };
  
  const handleForwardMessage = async (recipientId) => {
    if (!forwardingMsg) return;
    
    try {
      await handleSendMessage(forwardingMsg.text, {
        fileUrl: forwardingMsg.fileUrl,
        fileType: forwardingMsg.fileType,
        filePublicId: forwardingMsg.filePublicId
      }, recipientId); // Update handleSendMessage to accept targetId
      
      toast.success('Message forwarded');
      setForwardingMsg(null);
    } catch (error) {
      toast.error('Failed to forward message');
    }
  };

  const handleSignOut = async () => {
    document.documentElement.classList.remove('dark');
    if (socket) socket.disconnect();
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const res = await axios.put('/users/profile', updatedData);
      await update({
        ...session,
        user: {
          ...session.user,
          name: res.data.name,
          username: res.data.username,
          bio: res.data.bio,
          location: res.data.location,
          profilePic: res.data.profilePic
        }
      });
      toast.success('Profile updated successfully');
      setShowProfileModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleSelectContact = (id) => {
    setActiveContactId(id);
    setActiveMobileView('chat');
  };

  const handleMobileBack = () => {
    setActiveMobileView('sidebar');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-primary">
      {/* Sidebar: full-screen on mobile when activeMobileView==='sidebar', always visible on md+ */}
      <div className={`
        ${
          activeMobileView === 'sidebar'
            ? 'flex'
            : 'hidden'
        }
        md:flex
        h-full w-full md:w-auto flex-shrink-0
      `}>
        <Sidebar
          contacts={formattedContacts}
          activeId={activeContactId}
          onSelect={handleSelectContact}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
          onAvatarClick={() => setShowProfileModal(true)}
        />
      </div>

      {/* ChatArea: full-screen on mobile when activeMobileView==='chat', flex-1 on md+ */}
      <div className={`
        ${
          activeMobileView === 'chat'
            ? 'flex'
            : 'hidden'
        }
        md:flex
        flex-1 h-full min-w-0
      `}>
        <ChatArea
          contact={activeContact}
          currentUser={currentUser}
          conversation={activeConversationData}
          onSendMessage={handleSendMessage}
          onFinalizeFileMessage={handleFinalizeFileMessage}
          onRemoveOptimisticMessage={handleRemoveOptimisticMessage}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onForward={(msg) => setForwardingMsg(msg)}
          socket={socket}
          onChatAction={handleChatAction}
          onMobileBack={handleMobileBack}
        />
      </div>

      {/* ProfilePanel: hidden on mobile & tablet, visible on lg+ */}
      <div className="hidden lg:flex h-full flex-shrink-0">
        <ProfilePanel contact={activeContact} />
      </div>

      {forwardingMsg && (() => {
        const forwardableContacts = formattedContacts.filter(c =>
          c._hasConversation &&
          !c._isBlocked &&
          !c.hasBlockedMe &&
          c.id !== activeContactId
        );
        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
            <div className="bg-bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-pop-in flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-border-light flex items-center justify-between">
                <div>
                  <h3 className="text-[1.2rem] font-bold text-text-primary">Forward to...</h3>
                  <p className="text-[0.75rem] text-text-muted mt-0.5">From your chat list</p>
                </div>
                <button className="p-2 rounded-full hover:bg-bg-primary text-text-muted" onClick={() => setForwardingMsg(null)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {forwardableContacts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-text-muted gap-3">
                    <div className="w-14 h-14 rounded-full bg-bg-primary flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <p className="text-[0.9rem] font-medium">No other chats available</p>
                    <p className="text-[0.78rem] text-center px-6">Start a conversation with someone else first to forward messages.</p>
                  </div>
                ) : (
                  forwardableContacts.map(c => (
                    <button
                      key={c.id}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-accent-primary/10 transition-all text-left"
                      onClick={() => handleForwardMessage(c.id)}
                    >
                      <Avatar contact={c} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.95rem] font-semibold text-text-primary truncate">{c.name}</p>
                        <p className="text-[0.75rem] text-text-muted truncate">{c.username}</p>
                        {c._lastMessageText && c._lastMessageText !== 'No messages yet' && (
                          <p className="text-[0.72rem] text-text-muted truncate mt-0.5 opacity-70">{c._lastMessageText}</p>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {showProfileModal && (
        <UserProfileModal
          user={currentUser}
          onClose={() => setShowProfileModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
}
