interface MarqueeTickerProps {
  items: string[];
  speed?: number;
  reverse?: boolean;
  separator?: string;
  className?: string;
  itemClassName?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  items,
  speed = 35,
  reverse = false,
  separator = '✦',
  className = '',
  itemClassName = '',
}) => {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={`inline-flex gap-0 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className={`px-6 font-mono text-xs uppercase tracking-[0.3em] ${itemClassName}`}>
              {item}
            </span>
            <span className="text-neon-accent opacity-60 text-[8px]">{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
