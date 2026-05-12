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
    let isMounted = true;
    
    const renderChart = async () => {
      if (!chart) return;
      
      try {
        setError(false);
        
        // 1. Surgical extraction: Strip markdown backticks
        let cleanChart = chart.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
        
        // Isolate the valid syntax block, dropping conversational filler
        const match = cleanChart.match(/(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|pie|gantt|journey|gitGraph)[\s\S]*/);
        if (match) {
            cleanChart = match[0].trim();
        }

        // 2. LLM Typographic Sanitizer: Fix AI formatting quirks
        cleanChart = cleanChart
          .replace(/—>>/g, '->>')  // Fix em-dash arrows
          .replace(/—>/g, '->')    // Fix em-dash arrows
          .replace(/–>>/g, '->>')  // Fix en-dash arrows
          .replace(/–>/g, '->')    // Fix en-dash arrows
          .replace(/—/g, '--')     // Revert standalone em-dashes to double hyphens
          .replace(/< /g, '&lt; ') // Safely escape less-than signs
          .replace(/ >/g, ' &gt;'); // Safely escape greater-than signs

        // 3. Generate a random ID so multiple charts don't conflict
        const id = `mermaid-svg-${Math.round(Math.random() * 1000000)}`;
        
        // Let Mermaid generate the SVG markup behind the scenes
        const { svg } = await mermaid.render(id, cleanChart);
        
        if (isMounted) {
          setSvgData(svg);
        }
      } catch (err) {
        console.error("Mermaid syntax error:", err);
        if (isMounted) setError(true);
      }
    };

    renderChart();
    
    // Cleanup function to prevent memory leaks if component unmounts mid-render
    return () => { isMounted = false; };
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-sm font-mono overflow-auto whitespace-pre border border-red-500/20">
        <span className="font-bold mb-2 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
          AI Syntax Error
        </span>
        {chart}
      </div>
    );
  }

  return (
    <div 
      className="bg-[#0a0a0a] p-6 rounded-xl flex justify-center overflow-x-auto border border-white/5 custom-scrollbar"
      dangerouslySetInnerHTML={{ __html: svgData }} 
    />
  );
}