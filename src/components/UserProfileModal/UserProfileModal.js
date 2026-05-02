'use client';

import { useEffect, useState } from 'react';
import Avatar from '../Avatar/Avatar';

export default function UserProfileModal({ user, onClose, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: user.name || '', 
    username: user.username || '', 
    bio: user.bio || '', 
    location: user.location || '' 
  });

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!user) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a101c66] backdrop-blur-[10px] flex items-center justify-center z-[1000] animate-fadeIn" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative bg-bg-white rounded-[24px] w-[340px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.1)] animate-slide-up flex flex-col items-center pb-7 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/85 text-text-secondary transition-all hover:bg-white hover:text-text-primary cursor-pointer shadow-sm" onClick={onClose} title="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Header gradient band */}
        <div className="w-full h-[90px] bg-[linear-gradient(135deg,#3d5a73_0%,#4f7391_50%,#6a9ab0_100%)] shrink-0" />

        {/* Avatar */}
        <div className="flex flex-col items-center -mt-11 mb-2">
          <div className="w-[92px] h-[92px] rounded-full p-[3px] bg-[linear-gradient(135deg,#3d5a73,#6a9ab0)] shadow-[0_4px_16px_rgba(61,90,115,0.35)]">
            <Avatar contact={user} size="xl" />
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[0.72rem] font-medium text-online-dot">
            <span className="w-[7px] h-[7px] rounded-full bg-online-dot inline-block" />
            <span>Active now</span>
          </div>
        </div>

        {isEditing ? (
          <div className="w-[calc(100%-40px)] flex flex-col gap-3 py-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Full Name</label>
              <input 
                className="w-full bg-bg-primary border border-border-light rounded-lg p-2 px-3 text-[0.85rem] text-text-primary"
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Username</label>
              <input 
                className="w-full bg-bg-primary border border-border-light rounded-lg p-2 px-3 text-[0.85rem] text-text-primary"
                type="text" 
                value={formData.username} 
                onChange={e => setFormData({...formData, username: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Bio</label>
              <textarea 
                className="w-full bg-bg-primary border border-border-light rounded-lg p-2 px-3 text-[0.85rem] text-text-primary min-h-[80px] resize-y"
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider">Location</label>
              <input 
                className="w-full bg-bg-primary border border-border-light rounded-lg p-2 px-3 text-[0.85rem] text-text-primary"
                type="text" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
              />
            </div>
            <div className="flex flex-col gap-2 mt-2.5">
              <button className="bg-accent-primary text-white p-2.5 rounded-lg font-semibold text-[0.85rem] cursor-pointer" onClick={handleSave}>Save Changes</button>
              <button className="bg-transparent text-text-secondary p-2 rounded-lg font-medium text-[0.85rem] cursor-pointer border border-border-light hover:bg-bg-primary" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            {/* Name & username */}
            <div className="flex flex-col items-center gap-0.5 mb-[18px] px-6 text-center">
              <h2 className="text-[1.2rem] font-bold text-text-primary tracking-tight">{user.name}</h2>
              <span className="text-[0.8rem] text-accent-primary font-medium">{user.username}</span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-0 bg-bg-primary rounded-[14px] p-3 px-2 w-[calc(100%-40px)] mb-4">
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[0.88rem] font-bold text-text-primary">6</span>
                <span className="text-[0.66rem] text-text-muted font-medium tracking-tight">Connections</span>
              </div>
              <div className="w-[1px] h-7 bg-border-medium shrink-0" />
              <div className="flex-1 flex flex-col items-center gap-0.5">
                <span className="text-[0.88rem] font-bold text-text-primary">{user.joinedDate}</span>
                <span className="text-[0.66rem] text-text-muted font-medium tracking-tight">Joined</span>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="w-[calc(100%-40px)] bg-bg-primary rounded-xl p-3 px-3.5 mb-3">
                <p className="text-[0.8rem] text-text-secondary leading-relaxed text-center">{user.bio}</p>
              </div>
            )}

            {/* Info rows */}
            <div className="w-[calc(100%-40px)] bg-bg-primary rounded-xl p-2.5 px-3.5 mb-5 flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-text-muted flex items-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <span className="text-[0.78rem] text-text-secondary truncate">{user.email}</span>
              </div>
              {user.location && (
                <div className="flex items-center gap-2.5">
                  <span className="text-text-muted flex items-center shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span className="text-[0.78rem] text-text-secondary truncate">{user.location}</span>
                </div>
              )}
            </div>

            {/* Edit profile button */}
            <button className="flex items-center gap-[7px] py-2.5 px-7 bg-accent-primary text-white rounded-xl text-[0.85rem] font-semibold cursor-pointer transition-all shadow-[0_4px_14px_rgba(61,90,115,0.28)] hover:bg-accent-dark hover:-translate-y-0.5" onClick={() => setIsEditing(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
