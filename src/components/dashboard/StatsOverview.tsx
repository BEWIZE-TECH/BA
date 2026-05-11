'use client';
export function SystemHub() {
  return (
    <aside className="w-64 bg-[#141414] flex flex-col p-6 h-full shrink-0">

      <div className="flex flex-col items-start px-1 mb-8">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">System Hub</h2>
        <p className="text-blue-500/80 text-[11px] font-mono mt-1">biwize_os_v2.4.0</p>
      </div>

      <div className="mb-4 p-4 rounded-2xl bg-[#0f0f0f] border border-gray-800/60 shadow-sm">
        <div className="flex justify-between items-end mb-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Project Load</span>
        </div>
        <div className="w-full bg-[#1a1a1a] border border-gray-800/80 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-[10%] shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
        </div>
      </div>

      <div className="space-y-4 mb-10 px-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500"> Uptime</span>
          <span className="text-gray-300 font-mono">00:31:52</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Active Bridges</span>
          <span className="text-emerald-500 font-mono shadow-emerald-500/20 drop-shadow-md">12</span>
        </div>
      </div>

      <div className="flex-1 px-1">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Live Logs</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shadow-[0_0_5px_rgba(37,99,235,0.8)] shrink-0"></span>
            <span className="text-xs text-gray-400 font-mono leading-relaxed">Biwize AI established</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_5px_rgba(16,185,129,0.8)] shrink-0"></span>
            <span className="text-xs text-gray-400 font-mono leading-relaxed">Biwize AI optimized</span>
          </li>
        </ul>
      </div>
      
    </aside>
  );
}