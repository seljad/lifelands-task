type PanelProps = {
  title: string;
  description: string;
  actions: { label: string; onClick: () => void; primary?: boolean }[];
  tone?: "neutral" | "error";
};

export function FeedbackPanel({ title, description, actions, tone = "neutral" }: PanelProps) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center"
    >
      <h2 className={`text-lg font-bold ${tone === "error" ? "text-danger" : ""}`}>{title}</h2>
      <p className="max-w-md text-muted">{description}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={`h-11 rounded-xl px-5 text-sm font-semibold transition-colors ${
              action.primary
                ? "bg-accent text-accent-foreground hover:opacity-90"
                : "border border-border hover:bg-surface-muted"
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
