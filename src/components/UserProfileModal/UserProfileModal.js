'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '../Avatar/Avatar';

export default function UserProfileModal({ user, onClose }) {
  const router = useRouter();

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!user) return null;

  const handleEditClick = () => {
    onClose();
    router.push('/account-setting');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[12px] flex items-center justify-center z-[1000] animate-fadeIn p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative bg-bg-white rounded-[32px] w-full max-w-[380px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] animate-slide-up flex flex-col items-center border border-white/20" onClick={e => e.stopPropagation()}>
        
        {/* Top Header Background */}
        <div className="w-full h-[120px] bg-gradient-to-br from-accent-primary via-accent-light to-[#6a9ab0] relative shrink-0">
          <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md text-white border border-white/30 transition-all hover:bg-white/40 cursor-pointer shadow-lg" onClick={onClose} title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Profile Content */}
        <div className="w-full px-8 pb-8 flex flex-col items-center">
          {/* Avatar & Basic Info */}
          <div className="relative -mt-[54px] mb-4">
             <div className="p-1.5 bg-bg-white rounded-full shadow-xl">
               <Avatar contact={user} size="xl" />
             </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-[1.5rem] font-black text-text-primary tracking-tight leading-tight mb-1">{user.name}</h2>
            <p className="text-[0.9rem] font-bold text-accent-primary uppercase tracking-widest opacity-80">@{user.username}</p>
          </div>

          {/* Info Sections */}
          <div className="w-full space-y-5 mb-8">
            {/* About Section */}
            {user.bio && (
              <div className="space-y-2">
                <h3 className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest px-1">About</h3>
                <div className="bg-bg-primary/50 border border-border-light rounded-2xl p-4">
                  <p className="text-[0.85rem] text-text-secondary leading-relaxed font-medium">
                    {user.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Details Section */}
            <div className="space-y-2">
              <h3 className="text-[0.7rem] font-black text-text-muted uppercase tracking-widest px-1">Contact & Info</h3>
              <div className="bg-bg-primary/50 border border-border-light rounded-2xl overflow-hidden divide-y divide-border-light/50">
                <div className="flex items-center gap-3.5 p-3.5 px-4 transition-colors hover:bg-bg-primary">
                  <div className="w-9 h-9 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.62rem] font-black text-text-muted uppercase tracking-wider mb-0.5">Email Address</p>
                    <p className="text-[0.82rem] text-text-primary font-semibold truncate">{user.email}</p>
                  </div>
                </div>

                {user.location && (
                  <div className="flex items-center gap-3.5 p-3.5 px-4 transition-colors hover:bg-bg-primary">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.62rem] font-black text-text-muted uppercase tracking-wider mb-0.5">Location</p>
                      <p className="text-[0.82rem] text-text-primary font-semibold truncate">{user.location}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3.5 p-3.5 px-4 transition-colors hover:bg-bg-primary">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.62rem] font-black text-text-muted uppercase tracking-wider mb-0.5">Joined Bridge</p>
                    <p className="text-[0.82rem] text-text-primary font-semibold truncate">{user.joinedDate || 'Recently'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="w-full py-4 bg-accent-primary text-white rounded-2xl text-[0.95rem] font-bold cursor-pointer transition-all shadow-[0_12px_24px_-8px_rgba(0,120,212,0.5)] hover:bg-accent-dark hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2" 
            onClick={handleEditClick}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Account Profile
          </button>
        </div>
      </div>
    </div>
  );
}
