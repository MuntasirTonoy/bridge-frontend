"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "@/lib/axios";
import Lottie from "lottie-react";
import chatAnimation from "../../../public/Chat.json";
import Avatar from "../Avatar/Avatar";

export default function ChatArea({
  contact,
  currentUser,
  conversation,
  onSendMessage,
  onFinalizeFileMessage,
  onRemoveOptimisticMessage,
  onEditMessage,
  onDeleteMessage,
  onForward,
  socket,
  onChatAction,
}) {
  const [inputVal, setInputVal] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState("");
  const [msgMenuId, setMsgMenuId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  // New states for multi-format support
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const getOptimizedUrl = (url) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/q_auto,f_auto,w_600/");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages?.length, conversation?.isTyping]);

  useEffect(() => {
    const handleClose = () => {
      setShowMenu(false);
      setMsgMenuId(null);
    };
    if (showMenu || msgMenuId) {
      window.addEventListener("click", handleClose);
    }
    return () => window.removeEventListener("click", handleClose);
  }, [showMenu, msgMenuId]);

  const handleArchive = async () => {
    try {
      const res = await axios.post("/users/archive", { userId: contact.id });
      toast.success(
        res.data.message || "Chat archived/unarchived successfully",
      );
      setShowMenu(false);
      if (onChatAction)
        onChatAction("archive", contact.id, res.data.archivedChats);
    } catch (error) {
      toast.error("Failed to archive chat. Check auth.");
    }
  };

  const handleBlock = async () => {
    try {
      const res = await axios.post("/users/block", { userId: contact.id });
      toast.success(res.data.message || "User blocked/unblocked successfully");
      setShowMenu(false);
      if (onChatAction)
        onChatAction("block", contact.id, res.data.blockedUsers);
    } catch (error) {
      toast.error("Failed to block user. Check auth.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/chats/${contact.id}`);
      toast.success("Chat deleted successfully");
      setShowMenu(false);
      if (onChatAction) onChatAction("delete", contact.id);
    } catch (error) {
      toast.error("Failed to delete chat. Check auth.");
    }
  };

  const handleSend = () => {
    const text = inputVal.trim();
    if (!text) return;
    onSendMessage(text);
    setInputVal("");
    if (socket && contact && currentUser) {
      socket.emit("stopTyping", {
        senderId: currentUser.id,
        receiverId: contact.id,
      });
    }
    inputRef.current?.focus();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    setPendingFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // For PDF/other, we'll show icon
    }
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;

    const fileType = pendingFile.type.startsWith("image/")
      ? "image"
      : pendingFile.type === "application/pdf"
        ? "pdf"
        : pendingFile.type.startsWith("audio/")
          ? "voice"
          : "text";

    const localUrl =
      previewUrl || (fileType === "pdf" ? "/pdf-placeholder.png" : "");

    // 1. Send optimistic message immediately
    const tempId = `temp-${Date.now()}`;
    onSendMessage(null, {
      fileUrl: localUrl,
      fileType,
      isUploading: true,
      tempId,
    });

    cancelUpload(); // Close modal immediately

    const formData = new FormData();
    formData.append("file", pendingFile);

    try {
      const res = await axios.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2. Finalize with real URL
      onFinalizeFileMessage(tempId, {
        fileUrl: res.data.url,
        fileType,
        filePublicId: res.data.public_id,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      onRemoveOptimisticMessage(tempId);
    }
  };

  const cancelUpload = () => {
    setPendingFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Voice recording logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([audioBlob], "voice_message.webm", {
          type: "audio/webm",
        });
        setPendingFile(file);
        setPreviewUrl("voice");
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTyping = (e) => {
    setInputVal(e.target.value);
    if (socket && contact && currentUser) {
      socket.emit("typing", {
        senderId: currentUser.id,
        receiverId: contact.id,
      });
      if (inputRef.current.typingTimeout)
        clearTimeout(inputRef.current.typingTimeout);
      inputRef.current.typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", {
          senderId: currentUser.id,
          receiverId: contact.id,
        });
      }, 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startEditing = (msg) => {
    setEditingMessageId(msg.id);
    setEditText(msg.text);
    setMsgMenuId(null);
  };

  const handleEditSubmit = () => {
    if (
      editText.trim() &&
      editText !==
        conversation.messages.find((m) => m.id === editingMessageId)?.text
    ) {
      onEditMessage(editingMessageId, editText.trim());
    }
    setEditingMessageId(null);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") handleEditSubmit();
    else if (e.key === "Escape") setEditingMessageId(null);
  };

  if (!contact || !conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-chat">
        <div className="text-center text-text-muted">
          <div className="text-[3rem] mb-4">
            <Lottie
              animationData={chatAnimation}
              loop={true}
              style={{ width: 120, height: 120, margin: "0 auto" }}
            />
          </div>
          <h2 className="text-[1.1rem] font-semibold text-text-secondary mb-1.5">
            Select a conversation
          </h2>
          <p className="text-[0.85rem]">
            Choose a contact by search to start chatting.
          </p>
        </div>
      </div>
    );
  }

  const grouped = [];
  let lastDate = null;
  conversation.messages.forEach((msg) => {
    if (msg.date !== lastDate) {
      grouped.push({ type: "date", label: msg.date, key: `date-${msg.date}` });
      lastDate = msg.date;
    }
    grouped.push({ type: "message", msg });
  });

  const isBlocked = contact._isBlocked || contact.hasBlockedMe;

  return (
    <div className="flex-1 flex flex-col h-full bg-bg-chat overflow-hidden relative">
      {/* Pending File Preview Overlay */}
      {pendingFile && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-pop-in">
            <h3 className="text-[1.1rem] font-bold text-text-primary mb-4">
              Confirm Send
            </h3>
            <div className="bg-bg-primary rounded-2xl overflow-hidden mb-6 flex items-center justify-center min-h-[200px] border border-border-light">
              {previewUrl === "voice" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  </div>
                  <span className="text-[0.9rem] font-semibold text-text-primary">
                    Voice Message
                  </span>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[300px] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <span className="text-[0.9rem] font-semibold text-text-primary truncate px-4 w-full text-center">
                    {pendingFile.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl bg-bg-primary text-text-secondary font-bold text-[0.9rem] hover:bg-bg-white border border-border-light transition-all"
                onClick={cancelUpload}
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-xl bg-accent-primary text-white font-bold text-[0.9rem] hover:bg-accent-dark transition-all shadow-lg"
                onClick={confirmUpload}
                disabled={isUploading}
              >
                {isUploading ? "Sending..." : "Send Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="flex items-center justify-between py-3 px-5 bg-bg-white border-b border-border-light shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Avatar contact={contact} size="md" />
          <div className="flex flex-col">
            <span className="text-[0.95rem] font-semibold text-text-primary">
              {isBlocked ? "User" : contact.name}
            </span>
            {!isBlocked && (
              <span
                className={`text-[0.72rem] font-medium ${contact.isOnline ? "text-online-dot" : "text-text-muted"}`}
              >
                {contact.isOnline ? (
                  "● Online"
                ) : (
                  <>
                    <span className="text-slate-500 mr-0.5">●</span> Offline
                  </>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-primary"
            title="Search"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <div className="relative">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-primary"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute top-full right-0 mt-2 bg-bg-white border border-border-light rounded-xl shadow-lg w-40 p-1.5 z-[100] animate-slide-down">
                <button
                  className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary hover:bg-accent-primary/10 hover:text-text-primary"
                  onClick={handleArchive}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {contact._isArchived ? (
                      <path d="M3 8V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M21 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8zM10 12l2 2 2-2" />
                    ) : (
                      <>
                        <polyline points="21 8 21 21 3 21 3 8" />
                        <rect x="1" y="3" width="22" height="5" />
                        <line x1="10" y1="12" x2="14" y2="12" />
                      </>
                    )}
                  </svg>
                  {contact._isArchived ? "Unarchive Chat" : "Archive Chat"}
                </button>
                <button
                  className={`w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary ${contact._isBlocked ? "hover:bg-accent-primary/10" : "text-[#e05757] hover:bg-[#e05757]/10"}`}
                  onClick={handleBlock}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {contact._isBlocked ? (
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                      </>
                    )}
                  </svg>
                  {contact._isBlocked ? "Unblock Contact" : "Block Contact"}
                </button>
                <button
                  className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-[#e05757] hover:bg-[#e05757]/10"
                  onClick={handleDelete}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                  Delete Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-1">
        {grouped.map((item, idx) => {
          if (item.type === "date")
            return (
              <div
                key={item.key}
                className="flex items-center justify-center my-4 mb-3"
              >
                <span className="bg-bg-date-divider text-text-secondary text-[0.72rem] font-medium py-1 px-3.5 rounded-[20px] backdrop-blur-[4px] shadow-sm">
                  {item.label === "Today"
                    ? `Today, ${conversation.messages.find((m) => m.date === item.label)?.time || ""}`
                    : item.label}
                </span>
              </div>
            );
          const { msg } = item;
          const isMine = msg.senderId === "me";
          const isEditing = editingMessageId === msg.id;
          const isMenuOpen = msgMenuId === msg.id;
          const isFile = msg.fileType && msg.fileType !== "text";

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 mb-1.5 ${isMine ? "flex-row-reverse" : ""}`}
            >
              {!isMine && <Avatar contact={contact} size="sm" />}
              <div
                className={`max-w-[65%] py-[11px] px-[15px] rounded-[18px] leading-[1.55] text-[0.875rem] relative group ${isMine ? "bg-bubble-sent text-white rounded-br-[4px] cursor-pointer" : "bg-bubble-received text-text-primary rounded-bl-[4px] shadow-sm"} ${msg.isOptimistic ? "opacity-60" : ""} ${!isMine && idx % 2 === 0 ? "bg-bubble-received-alt" : ""}`}
                onClick={(e) => {
                  if (isMine && !isEditing) {
                    e.stopPropagation();
                    setMsgMenuId(msgMenuId === msg.id ? null : msg.id);
                  }
                }}
              >
                {isMine && !isEditing && (
                  <button
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-black/40"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMsgMenuId(msgMenuId === msg.id ? null : msg.id);
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </button>
                )}
                {isEditing ? (
                  <div className="w-full">
                    <input
                      autoFocus
                      className="w-full bg-transparent border-none text-inherit font-inherit border-b border-white/40 py-0.5 outline-none"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      onBlur={handleEditSubmit}
                    />
                  </div>
                ) : (
                  <>
                    {msg.fileType === "image" && (
                      <div className="mb-2 overflow-hidden rounded-xl shadow-sm border border-white/10 max-w-[260px] relative">
                        <img
                          src={getOptimizedUrl(msg.fileUrl)}
                          alt="Msg"
                          className={`w-full h-auto max-h-[300px] object-cover transition-all duration-500 ${msg.isUploading ? "blur-sm brightness-75" : "hover:scale-[1.03] cursor-zoom-in"}`}
                          loading="lazy"
                        />
                        {msg.isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.fileType === "pdf" && (
                      <div className="relative">
                        <a
                          href={msg.isUploading ? "#" : msg.fileUrl}
                          target={msg.isUploading ? "_self" : "_blank"}
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 p-3 bg-bg-primary/20 rounded-xl border border-white/10 mb-2 transition-all ${msg.isUploading ? "opacity-60 grayscale" : "hover:bg-bg-primary/30"}`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[0.8rem] font-bold truncate">
                              PDF Document
                            </span>
                            <span className="text-[0.65rem] opacity-60">
                              {msg.isUploading
                                ? "Uploading..."
                                : "Click to view"}
                            </span>
                          </div>
                        </a>
                        {msg.isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.fileType === "voice" && (
                      <div
                        className={`mb-2 w-full min-w-[200px] relative ${msg.isUploading ? "opacity-60" : ""}`}
                      >
                        <audio
                          controls
                          className="w-full h-8 scale-90 origin-left"
                        >
                          <source src={msg.fileUrl} type="audio/webm" />
                        </audio>
                        {msg.isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                            <div className="w-5 h-5 border-2 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.text && <p>{msg.text}</p>}
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      {msg.isEdited && (
                        <span className="text-[0.62rem] italic opacity-70">
                          edited
                        </span>
                      )}
                      <span
                        className={`text-[0.65rem] ${isMine ? "text-white/60" : "text-text-muted"}`}
                      >
                        {msg.time}
                      </span>
                    </div>
                  </>
                )}

                {isMine && isMenuOpen && !isEditing && (
                  <div
                    className="absolute top-2 right-2 flex flex-col gap-0.5 bg-bg-white p-1.5 rounded-xl shadow-lg opacity-100 z-50 min-w-[110px] border border-border-light animate-pop-in text-text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {!isFile && (
                      <button
                        className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] font-medium text-text-secondary hover:bg-bg-primary hover:text-accent-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(msg);
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                    )}
                    <button
                      className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] font-medium text-text-secondary hover:bg-bg-primary hover:text-accent-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onForward(msg);
                        setMsgMenuId(null);
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <polyline points="15 10 20 15 15 20" />
                        <path d="M4 4v7a4 4 0 0 0 4 4h12" />
                      </svg>
                      <span>Forward</span>
                    </button>
                    <button
                      className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] font-medium text-[#e05757] hover:bg-[#e05757]/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMessage(msg.id);
                        setMsgMenuId(null);
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isRecording && (
          <div className="flex items-center gap-4 bg-bg-white border-t border-border-light px-8 py-4 animate-slide-up">
            <div className="flex items-center gap-2 text-accent-primary animate-pulse">
              <span className="w-3 h-3 bg-accent-primary rounded-full" />
              <span className="text-[0.9rem] font-bold">
                Recording... {formatRecordingTime(recordingTime)}
              </span>
            </div>
            <button
              className="ml-auto p-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
              onClick={stopRecording}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {!isBlocked && !isRecording && (
        <div className="flex items-center gap-3 pt-3 pb-3.5 px-5 bg-bg-white border-t border-border-light">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          <button
            className={`text-text-muted p-1.5 rounded-full flex items-center transition-all hover:text-accent-primary hover:bg-accent-primary/10 shrink-0 ${isUploading ? "animate-pulse pointer-events-none" : ""}`}
            title="Attach file"
            onClick={handleFileClick}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <button
            className="text-text-muted p-1.5 rounded-full flex items-center transition-all hover:text-accent-primary hover:bg-accent-primary/10 shrink-0"
            title="Voice Message"
            onClick={startRecording}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
          <input
            ref={inputRef}
            className="flex-1 bg-bg-primary border border-border-light rounded-3xl py-2.5 px-[18px] text-[0.875rem] text-text-primary transition-all placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-3 focus:ring-accent-primary/10"
            type="text"
            placeholder="Type a message..."
            value={inputVal}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`w-[42px] h-[42px] rounded-full text-white flex items-center justify-center transition-all duration-200 active:scale-95 shrink-0 ${inputVal.trim() ? "bg-accent-primary hover:bg-accent-dark hover:scale-105" : "bg-border-medium"}`}
            onClick={handleSend}
            title="Send"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      )}
      {isBlocked && (
        <div className="py-4 px-5 bg-bg-white border-t border-border-light text-center text-text-secondary text-[0.85rem] font-medium">
          You cannot send messages to this user.
        </div>
      )}
    </div>
  );
}
