export default function Avatar({ contact, size = 'md' }) {
  const isOnline = contact?.isOnline;

  const sizeConfigs = {
    sm: { container: 'w-9 h-9', dot: 'w-[9px] h-[9px] bottom-0 right-0' },
    md: { container: 'w-[46px] h-[46px]', dot: 'w-3 h-3 bottom-[2px] right-[2px]' },
    lg: { container: 'w-20 h-20', dot: 'w-4 h-4 bottom-1 right-1' },
    xl: { container: 'w-24 h-24', dot: 'w-4 h-4 bottom-1 right-1' },
  };

  const config = sizeConfigs[size] || sizeConfigs.md;

  const initials = contact?.initials ||
    (contact?.name ? contact.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?');

  return (
    <div className={`relative shrink-0 flex items-center justify-center rounded-full ${config.container}`}>
      <div className={`w-full h-full rounded-full p-[2.5px] flex items-center justify-center border-[1.5px] transition-[border-color,box-shadow] duration-300 ${isOnline ? 'border-online-dot shadow-[0_0_0_1px_rgba(76,175,158,0.2)]' : 'border-transparent'}`}>
        <div className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center ${!contact?.avatar ? 'bg-gradient-to-br from-accent-primary to-accent-light text-white font-bold text-[0.8rem] tracking-wide' : 'bg-bg-secondary'}`}>
          {contact?.avatar ? (
            <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
      </div>
      {isOnline && (
        <span className={`absolute bg-online-dot rounded-full border-2 border-bg-white z-10 shadow-sm ${config.dot}`} />
      )}
    </div>
  );
}
