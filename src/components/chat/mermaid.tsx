import { useEffect } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: true, theme: 'dark' });

export function Mermaid({ chart }: { chart: string }) {
  useEffect(() => {
    mermaid.contentLoaded();
  }, [chart]);

  return <div className="mermaid bg-[#0a0a0a] p-4 rounded-xl">{chart}</div>;
}