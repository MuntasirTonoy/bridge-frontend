import Avatar from '../Avatar/Avatar';

export default function ProfilePanel({ contact }) {
  if (!contact) return <aside className="w-60 min-w-[240px] h-full bg-bg-sidebar border-l border-border-light py-7 px-5 flex flex-col items-center gap-1" />;

  return (
    <aside className="w-60 min-w-[240px] h-full bg-bg-sidebar border-l border-border-light overflow-y-auto py-7 px-5 flex flex-col items-center gap-1">
      {/* Avatar */}
      <div className="mb-3 relative">
        <Avatar contact={contact} size="xl" />
      </div>

      {/* Name & username */}
      <h2 className="text-[1.05rem] font-bold text-text-primary text-center tracking-tight mb-0.5">{contact.name}</h2>
      <p className="text-[0.78rem] text-text-secondary text-center mb-5">{contact.username}</p>

      {/* About */}
      <section className="w-full mb-4">
        <h3 className="text-[0.65rem] font-bold text-text-muted tracking-widest mb-2 uppercase">About</h3>
        <div className="bg-bg-white rounded-xl p-3 px-3.5 shadow-sm">
          <p className="text-[0.8rem] text-text-secondary leading-relaxed">{contact.about}</p>
        </div>
      </section>

      {/* Contact info */}
      <div className="w-full bg-bg-white rounded-xl p-3 px-3.5 shadow-sm mb-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-text-muted flex items-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </span>
          <span className="text-[0.78rem] text-text-secondary truncate">{contact.email}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-text-muted flex items-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </span>
          <span className="text-[0.78rem] text-text-secondary truncate">{contact.location}</span>
        </div>
      </div>

      {/* Shared media */}
      {contact.sharedMedia && contact.sharedMedia.length > 0 && (
        <section className="w-full mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[0.65rem] font-bold text-text-muted tracking-widest uppercase">Shared Media</h3>
            <button className="text-[0.72rem] text-accent-primary font-medium transition-opacity hover:opacity-70">view all</button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {contact.sharedMedia.map((src, i) => (
              <div key={i} className="aspect-square rounded-lg overflow-hidden bg-border-light">
                <img src={src} alt="shared media" className="w-full h-full object-cover transition-transform duration-200 hover:scale-105" />
              </div>
            ))}
            {contact.extraMedia > 0 && (
              <div className="aspect-square rounded-lg overflow-hidden bg-accent-primary flex items-center justify-center">
                <span className="text-white text-[0.8rem] font-semibold">+{contact.extraMedia}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </aside>
  );
}
