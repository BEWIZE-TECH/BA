

export default function BiwizeLogo() {
  return (
    <div className="relative h-11 w-11 flex items-center justify-center group/logo">
      <div className="absolute inset-0 bg-black-500/10 rounded-full blur-xl group-hover/logo:bg-black 500/20 transition-colors duration-500" />
      <div className="absolute inset-0 animate-[spin_8s_linear_infinite] opacity-20 group-hover/logo:opacity-40 transition-opacity">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-blue-400 fill-none stroke-[2]">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
        </svg>
      </div>
      <div className="absolute h-7 w-7 border border-blue-400/50 rotate-45 animate-[spin_4s_linear_infinite_reverse] group-hover/logo:border-white transition-colors duration-500" />
      <div className="absolute h-7 w-7 border border-blue-500/50 -rotate-12 group-hover/logo:rotate-12 transition-transform duration-700" />
      <div className="relative h-3 w-3 bg-white rounded-[2px] shadow-[0_0_15px_rgba(255,255,255,0.8)]">
        <div className="absolute inset-0 bg-white rounded-[1px] animate-ping opacity-50" />
      </div>
    </div>
  );
}