"use client";

import { useRouter } from "next/navigation";
import { Component, startTransition } from "react";
import type { ReactNode } from "react";
import { FeedbackPanel } from "./feedback-panels.tsx";

function ErrorFallback({ reset }: { reset: () => void }) {
  const router = useRouter();

  return (
    <FeedbackPanel
      tone="error"
      title="بارگذاری بازی‌ها با مشکل روبه‌رو شد"
      description="در دریافت فهرست بازی‌ها خطایی رخ داد. لطفاً دوباره تلاش کنید."
      actions={[
        {
          label: "تلاش دوباره",
          primary: true,
          onClick: () =>
            startTransition(() => {
              router.refresh();
              reset();
            }),
        },
      ]}
    />
  );
}

type BoundaryProps = { children: ReactNode };
type BoundaryState = { hasError: boolean };

export class GamesErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  private reset = () => this.setState({ hasError: false });

  render() {
    return this.state.hasError ? (
      <ErrorFallback reset={this.reset} />
    ) : (
      this.props.children
    );
  }
}
