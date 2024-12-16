import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import wordCloudData from '@/data/word-cloud.json';

const SENTIMENT_COLORS = {
  positive: "#4ade80",
  neutral: "#94a3b8",
  negative: "#f87171",
  mixed: "#fbbf24"
};

interface WordCloudProps {
  sentimentFilters: {
    all: boolean;
    positive: boolean;
    negative: boolean;
    mixed: boolean;
    neutral: boolean;
  };
  posFilters: {
    all: boolean;
    nouns: boolean;
    verbs: boolean;
    adjectives: boolean;
  };
  selectedWords: string[];
}

export default function WordCloudsCardJensen({ sentimentFilters, posFilters, selectedWords }: WordCloudProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wordCloudData?.wordcloud_data || !svgRef.current || !containerRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Get container dimensions
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Update SVG dimensions
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const words = wordCloudData.wordcloud_data
      .filter(item => selectedWords.includes(item.word))
      .filter(item => {
        if (sentimentFilters.all) return true;
        return (
          (item.sentiment === 'positive' && sentimentFilters.positive) ||
          (item.sentiment === 'negative' && sentimentFilters.negative) ||
          (item.sentiment === 'mixed' && sentimentFilters.mixed) ||
          (item.sentiment === 'neutral' && sentimentFilters.neutral)
        );
      })
      .filter(item => {
        if (posFilters.all) return true;
        const posMapping = {
          noun: 'nouns',
          verb: 'verbs',
          adjective: 'adjectives'
        };
        return (
          (item.pos === 'noun' && posFilters.nouns) ||
          (item.pos === 'verb' && posFilters.verbs) ||
          (item.pos === 'adjective' && posFilters.adjectives)
        );
      });

    // Adjust the size calculation to better distribute words
    const maxCount = Math.max(...words.map(d => d.count));
    const minCount = Math.min(...words.map(d => d.count));
    const sizeScale = d3.scaleLinear()
      .domain([minCount, maxCount])
      .range([12, 40]); // Adjust min and max font sizes

    const layout = cloud()
      .size([width, height]) // Use container dimensions
      .words(words.map(d => ({
        text: d.word,
        size: sizeScale(d.count),
        sentiment: d.sentiment
      })))
      .padding(2)
      .rotate(0)
      .spiral('archimedean')
      .font("'Seoul UI', 'Noto Sans KR', sans-serif")
      .fontSize(d => d.size)
      .on("end", draw);

    function draw(words: any[]) {
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      const g = svg.append("g")
        .attr("transform", `translate(${width/2},${height/2})`);

      g.selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "'Seoul UI', 'Noto Sans KR', sans-serif")
        .style("fill", d => SENTIMENT_COLORS[d.sentiment as keyof typeof SENTIMENT_COLORS])
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          const word = wordCloudData.wordcloud_data.find(item => item.word === d.text);
          if (!word) return;

          tooltip.html(`
            <div style="
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 8px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding-bottom: 8px;
            ">${word.word}</div>
            
            <div style="
              display: grid;
              gap: 6px;
              font-size: 13px;
              color: rgba(255, 255, 255, 0.9);
            ">
              <div style="display: flex; align-items: center;">
                <span style="width: 20px;">📊</span>
                <span style="color: rgba(255, 255, 255, 0.7);">Count:</span>
                <span style="margin-left: 8px; font-weight: 500;">${word.count.toLocaleString()}</span>
              </div>
              
              <div style="display: flex; align-items: center;">
                <span style="width: 20px;">🎯</span>
                <span style="color: rgba(255, 255, 255, 0.7);">Type:</span>
                <span style="margin-left: 8px; font-weight: 500;">${word.pos}</span>
              </div>
              
              <div style="display: flex; align-items: center;">
                <span style="width: 20px;">💭</span>
                <span style="color: rgba(255, 255, 255, 0.7);">Sentiment:</span>
                <span style="margin-left: 8px; font-weight: 500;">${word.sentiment}</span>
              </div>
            </div>
          `)
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);

          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.7);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", function() {
          tooltip.style("visibility", "hidden");
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1);
        });

      // Add debug information
      console.log(`Rendered ${words.length} words out of ${selectedWords.length} selected`);
    }

    layout.start();

    // Create tooltip div
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "word-cloud-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("padding", "12px")
      .style("background", "rgba(0, 0, 0, 0.5)")
      .style("backdrop-filter", "blur(8px)")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.2)")
      .style("font-family", "system-ui, -apple-system, sans-serif")
      .style("pointer-events", "none")
      .style("z-index", "100")
      .style("color", "white");

    // Add resize handler
    const handleResize = () => {
      if (containerRef.current) {
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        
        svg.attr("width", newWidth)
           .attr("height", newHeight);
        
        layout.size([newWidth, newHeight]);
        layout.start();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      tooltip.remove();
    };
  }, [sentimentFilters, posFilters, selectedWords]);

  if (!wordCloudData?.wordcloud_data) {
    return (
      <div className="flex justify-center items-center h-full">
        No word cloud data available
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[400px] flex justify-center items-center overflow-hidden"
    >
      <svg 
        ref={svgRef}
        className="w-full h-full"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      ></svg>
    </div>
  );
}
