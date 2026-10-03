'use client';

/**
 * Infinite marquee — a seamless, pausable ticker used for the tech stack.
 * The track is rendered twice so the loop has no visible seam; hover pauses it.
 */
export default function Marquee({
  items = [],
  speed = 38,
  direction = 'normal',
  reverse = false,
  className = '',
  ariaLabel = 'Technology stack',
}) {
  if (!items.length) return null;

  const renderTrack = (key) => (
    <div className="mq__track" key={key} aria-hidden={key === 'clone' ? 'true' : undefined}>
      {items.map((item, index) => {
        const label = typeof item === 'object' ? item.label ?? item.title : item;
        const icon = typeof item === 'object' ? item.icon : null;
        const color = typeof item === 'object' ? item.color : undefined;
        return (
          <span className="mq__item" key={`${label}-${index}`}>
            {icon ? (
              <span aria-hidden="true" style={{ color }}>
                {icon}
              </span>
            ) : null}
            {label}
          </span>
        );
      })}
    </div>
  );

  return (
    <div
      className={`mq ${className}`}
      aria-label={ariaLabel}
      style={{
        '--mq-speed': `${speed}s`,
        '--mq-direction': reverse || direction === 'reverse' ? 'reverse' : 'normal',
      }}
    >
      {renderTrack('primary')}
      {renderTrack('clone')}
    </div>
  );
}
