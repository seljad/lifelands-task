const FLAKE_COUNT = 40;

const FLAKES = Array.from({ length: FLAKE_COUNT }, (_, index) => ({
  id: index,
  left: (index * 37) % 100,
  size: 4 + ((index * 5) % 7),
  duration: 9 + ((index * 7) % 10),
  delay: -((index * 3) % 14),
}));

export function Snow() {
  return (
    <div
      aria-hidden="true"
      className="snow pointer-events-none fixed inset-0 z-10 overflow-hidden"
    >
      {FLAKES.map((flake) => (
        <span
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            width: flake.size,
            height: flake.size,
            animationDuration: `${flake.duration}s`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
