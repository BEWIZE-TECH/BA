import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';

// Initialize with startOnLoad: false so it doesn't fight React
mermaid.initialize({ 
  startOnLoad: false, 
  theme: 'dark',
  securityLevel: 'loose' 
});

export function Mermaid({ chart }: { chart: string }) {
  const [svgData, setSvgData] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      
      try {
        setError(false);
        // Generate a random ID so multiple charts don't conflict
        const id = `mermaid-svg-${Math.round(Math.random() * 1000000)}`;
        
        // Let Mermaid generate the SVG markup behind the scenes
        const { svg } = await mermaid.render(id, chart);
        setSvgData(svg);
      } catch (err) {
        console.error("Mermaid syntax error:", err);
        setError(true);
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-sm font-mono overflow-auto whitespace-pre">{chart}</div>;
  }

  return (
    <div 
      className="bg-[#0a0a0a] p-6 rounded-xl flex justify-center overflow-x-auto border border-white/5"
      dangerouslySetInnerHTML={{ __html: svgData }} 
    />
  );
}