"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "../Avatar/Avatar";

// Sun icon
function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Moon icon
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Sidebar({
  contacts,
  activeId,
  onSelect,
  currentUser,
  onSignOut,
  isDark,
  onToggleTheme,
  onAvatarClick,
}) {
  const [search, setSearch] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");
  const [newChatResults, setNewChatResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (newChatSearch.trim()) {
        setIsSearching(true);
        try {
          const { data } = await import("@/lib/axios").then((m) =>
            m.default.get(`/auth/users?search=${newChatSearch}`),
          );
          setNewChatResults(data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setNewChatResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [newChatSearch]);

  useEffect(() => {
    const handleClose = () => setShowSettings(false);
    if (showSettings) {
      window.addEventListener("click", handleClose);
    }
    return () => window.removeEventListener("click", handleClose);
  }, [showSettings]);

  const filtered = contacts.filter(
    (c) =>
      !c._isArchived &&
      (c._hasConversation || c.id === activeId) &&
      (c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.username?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())),
  );

  const archivedFiltered = contacts.filter((c) => c._isArchived);

  return (
    <aside className="w-full md:w-[280px] md:min-w-[280px] h-full bg-bg-sidebar flex flex-col border-r border-border-light overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between pt-5 pb-3.5 px-4">
        <h1 className="text-[1.3rem] font-bold text-text-primary tracking-tight">
          Bridge
        </h1>
        <div className="flex items-center gap-1.5">
          {/* Theme toggle */}
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary bg-bg-white border border-border-light transition-all duration-200 hover:text-accent-primary hover:bg-bg-primary hover:rotate-[20deg] cursor-pointer shadow-sm"
            onClick={onToggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          {/* Current user avatar — click to open modal */}
          <button
            className="cursor-pointer rounded-full p-0 transition-all duration-150 relative hover:scale-110 hover:ring-2 hover:ring-accent-primary"
            onClick={onAvatarClick}
            title="View profile"
          >
            <Avatar contact={currentUser} size="sm" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mx-3.5 mb-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center pointer-events-none">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className="w-full bg-bg-white border border-border-light rounded-xl py-[9px] pl-9 pr-3 text-[0.82rem] text-text-primary transition-all placeholder:text-text-muted focus:border-accent-primary focus:ring-3 focus:ring-accent-primary/10"
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Section label */}
      <p className="text-[0.62rem] font-bold text-text-muted tracking-[0.09em] pt-2.5 pb-1 px-4">
        MESSAGES
      </p>

      {/* Contact list */}
      <nav className="flex-1 overflow-y-auto py-0.5 px-2">
        {filtered.map((contact) => {
          const text = contact._lastMessageText;
          const time = contact._lastMessageTime;
          const isActive = contact.id.toString() === activeId?.toString();
          return (
            <button
              key={contact.id}
              className={`w-full flex items-center gap-[11px] p-2.5 rounded-xl mb-[1px] transition-all cursor-pointer text-left ${isActive ? "bg-gray-200/80 dark:bg-white/10 shadow-sm" : "bg-transparent hover:bg-gray-100 dark:hover:bg-white/5"}`}
              onClick={() => onSelect(contact.id)}
            >
              <Avatar contact={contact} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[0.855rem] font-semibold text-text-primary truncate max-w-[140px]">
                    {contact.name}
                  </span>
                  <span className="text-[0.68rem] text-text-muted shrink-0">
                    {time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-[0.76rem] truncate block max-w-[185px] ${contact.unreadCount > 0 ? "text-text-primary font-semibold" : "text-text-secondary"}`}>
                    {text}
                  </span>
                  {contact.unreadCount > 0 && (
                    <span className="bg-accent-primary text-white text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ml-2">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-text-muted text-[0.8rem] py-6 px-4">
            No contacts found
          </p>
        )}
      </nav>

      {/* Floating New Chat Button */}
      {!showNewChat && (
        <button
          className="absolute bottom-20 right-5 w-[52px] h-[52px] rounded-full bg-accent-primary text-white flex items-center justify-center shadow-lg cursor-pointer transition-all hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:bg-accent-dark z-10 border-none"
          title="New Chat"
          onClick={() => setShowNewChat(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between py-3 px-4 border-t border-border-light relative">
        <button
          className="flex items-center gap-[7px] text-text-secondary text-[0.82rem] font-medium py-[7px] px-2.5 rounded-xl transition-all hover:text-[#e05757] hover:bg-[#e05757]/10 cursor-pointer"
          onClick={onSignOut}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Sign Out</span>
        </button>

        <div className="relative">
          <button
            className="text-text-secondary p-[7px] rounded-xl flex items-center transition-all hover:text-text-primary hover:bg-accent-primary/10 cursor-pointer"
            title="Settings"
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {showSettings && (
            <div className="absolute bottom-full right-0 mb-2 bg-bg-white border border-border-light rounded-xl shadow-lg w-[180px] p-1.5 z-[100] animate-slide-up">
              <button
                className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary transition-all hover:bg-accent-primary/10 hover:text-text-primary cursor-pointer text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowArchived(true);
                  setShowSettings(false);
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="21 8 21 21 3 21 3 8" />
                  <rect x="1" y="3" width="22" height="5" />
                  <line x1="10" y1="12" x2="14" y2="12" />
                </svg>
                Archived Chats
              </button>
              <button className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary transition-all hover:bg-accent-primary/10 hover:text-text-primary cursor-pointer text-left">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
                Blocked Accounts
              </button>
              <div className="h-[1px] bg-border-light mx-2 my-1" />
              <button
                className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary transition-all hover:bg-accent-primary/10 hover:text-text-primary cursor-pointer text-left"
                onClick={(e) => {
                  e.stopPropagation();
                  // This would toggle currentUser.isOnline in a real app
                  alert("Active Status toggled");
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Active Status
                  </div>
                  <div
                    className={`w-7 h-4 rounded-xl relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3 after:bg-white after:rounded-full after:transition-transform ${currentUser.isOnline ? "bg-[#10b981] after:translate-x-3" : "bg-[#cbd5e1]"}`}
                  />
                </div>
              </button>
              <div className="h-[1px] bg-border-light mx-2 my-1" />
              <Link
                href="/account-setting"
                className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary transition-all hover:bg-accent-primary/10 hover:text-text-primary cursor-pointer text-left"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Account Settings
              </Link>
              <button className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary transition-all hover:bg-accent-primary/10 hover:text-text-primary cursor-pointer text-left">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                Notifications
              </button>
              <button className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary transition-all hover:bg-accent-primary/10 hover:text-text-primary cursor-pointer text-left">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Privacy & Security
              </button>
              <Link
                href="/support"
                className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary transition-all hover:bg-accent-primary/10 hover:text-text-primary cursor-pointer text-left"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Help & Support
              </Link>
              <Link 
                href="/about"
                className="w-full py-2 px-3 rounded-lg flex items-center gap-2.5 text-[0.8rem] text-text-secondary transition-all hover:bg-accent-primary/10 hover:text-text-primary cursor-pointer text-left"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                About Bridge
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Search Overlay */}
      <div
        className={`absolute inset-0 bg-bg-sidebar flex flex-col z-20 transition-transform duration-300 ease-in-out ${showNewChat ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center gap-3 pt-5 pb-3.5 px-4">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full text-text-primary transition-colors hover:bg-accent-primary/10 cursor-pointer"
            onClick={() => {
              setShowNewChat(false);
              setNewChatSearch("");
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <span className="text-[1.1rem] font-semibold text-text-primary">
            New Chat
          </span>
        </div>
        <div className="relative mx-4 mb-2.5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center pointer-events-none">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="w-full bg-bg-white border border-border-light rounded-xl py-[9px] pl-9 pr-3 text-[0.82rem] text-text-primary transition-all placeholder:text-text-muted focus:border-accent-primary focus:ring-3 focus:ring-accent-primary/10"
            type="text"
            placeholder="Search username or email..."
            value={newChatSearch}
            onChange={(e) => setNewChatSearch(e.target.value)}
          />
        </div>
        <nav className="flex-1 overflow-y-auto py-0.5 px-2">
          {isSearching && (
            <div className="text-center text-text-muted text-[0.8rem] py-6 px-4 italic">
              Searching...
            </div>
          )}
          {!isSearching &&
            newChatResults.map((contact) => (
              <button
                key={contact._id}
                className="w-full flex items-center gap-[11px] p-2.5 rounded-xl mb-[1px] transition-colors cursor-pointer text-left bg-transparent hover:bg-accent-primary/5"
                onClick={() => {
                  onSelect(contact._id);
                  setShowNewChat(false);
                  setNewChatSearch("");
                }}
              >
                <Avatar
                  contact={{
                    name: contact.name,
                    username: contact.username,
                    profilePic: contact.profilePic,
                  }}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[0.855rem] font-semibold text-text-primary truncate max-w-[140px]">
                      {contact.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.76rem] text-text-secondary truncate block max-w-[185px]">
                      @{contact.username} • {contact.email}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          {!isSearching &&
            newChatResults.length === 0 &&
            newChatSearch.trim() !== "" && (
              <p className="text-center text-text-muted text-[0.8rem] py-6 px-4">
                No users found
              </p>
            )}
          {!isSearching &&
            newChatResults.length === 0 &&
            newChatSearch.trim() === "" && (
              <p className="text-center text-text-muted text-[0.8rem] py-6 px-4">
                Type to search for users
              </p>
            )}
        </nav>
      </div>

      {/* Archived Chats Overlay */}
      <div
        className={`absolute inset-0 bg-bg-sidebar flex flex-col z-20 transition-transform duration-300 ease-in-out ${showArchived ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center gap-3 pt-5 pb-3.5 px-4">
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full text-text-primary transition-colors hover:bg-accent-primary/10 cursor-pointer"
            onClick={() => setShowArchived(false)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <span className="text-[1.1rem] font-semibold text-text-primary">
            Archived Chats
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-0.5 px-2 mt-2.5">
          {archivedFiltered.map((contact) => {
            const text = contact._lastMessageText;
            const time = contact._lastMessageTime;
            const isActive = contact.id === activeId;
            return (
              <button
                key={contact.id}
                className={`w-full flex items-center gap-[11px] p-2.5 rounded-xl mb-[1px] transition-colors cursor-pointer text-left bg-transparent hover:bg-accent-primary/5 ${isActive ? "bg-accent-primary/10" : ""}`}
                onClick={() => {
                  onSelect(contact.id);
                  setShowArchived(false);
                }}
              >
                <Avatar contact={contact} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[0.855rem] font-semibold text-text-primary truncate max-w-[140px]">
                      {contact.name}
                    </span>
                    <span className="text-[0.68rem] text-text-muted shrink-0">
                      {time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.76rem] text-text-secondary truncate block max-w-[185px]">
                      {text}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
          {archivedFiltered.length === 0 && (
            <p className="text-center text-text-muted text-[0.8rem] py-6 px-4">
              No archived chats
            </p>
          )}
        </nav>
      </div>
    </aside>
  );
}
