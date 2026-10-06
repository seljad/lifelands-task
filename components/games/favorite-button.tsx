type FavoriteButtonProps = {
  title: string;
  isFavorite: boolean;
  onToggle: () => void;
};

export function FavoriteButton({ title, isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={`${isFavorite ? "حذف از" : "افزودن به"} علاقه‌مندی‌ها: ${title}`}
      className="absolute inset-e-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface/90 text-foreground shadow transition-transform hover:scale-110 active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 transition-colors ${isFavorite ? "fill-danger stroke-danger" : "fill-none stroke-current"}`}
        strokeWidth="2"
        aria-hidden="true"
      >
        <path
          d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 2.5c0 5.6-7.5 10.2-7.5 10.2Z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
