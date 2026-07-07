// Zentrierter Inhalts-Wrapper im buttje-Raster (max 1320px, fluide Innenabstaende).

export default function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1320px] px-[clamp(18px,5vw,64px)] ${className}`}
    >
      {children}
    </div>
  );
}
