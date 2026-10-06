import { FILTERS } from "@/lib/filters/config.ts";
import { PAGE_SIZE } from "@/lib/config.ts";
import {
  CARD_BODY_CLASS,
  CARD_CLASS,
  CARD_IMAGE_CLASS,
  CONTROL_HEIGHT_CLASS,
  CONTROL_WIDTH_CLASS,
  GRID_CLASS,
  LOAD_MORE_ROW_CLASS,
  SUMMARY_CLASS,
} from "./layout.ts";

function Bone({ className }: { className: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

export function GameGridSkeleton() {
  return (
    <div role="status" aria-label="در حال بارگذاری بازی‌ها">
      <ul className={GRID_CLASS}>
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
          <li key={index} className={CARD_CLASS} aria-hidden="true">
            <div className={`skeleton ${CARD_IMAGE_CLASS}`} />
            <div className={CARD_BODY_CLASS}>
              <div className="space-y-2">
                <Bone className="h-5 w-3/4" />
                <Bone className="h-4 w-1/2" />
              </div>
              <Bone className="h-6 w-2/3" />
              <Bone className="h-9 w-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GamesSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-3" aria-hidden="true">
        <Bone className={`${CONTROL_HEIGHT_CLASS} w-full max-w-xl`} />
        <div className="flex flex-wrap gap-3">
          {FILTERS.map((filter) => (
            <Bone
              key={filter.id}
              className={`${CONTROL_HEIGHT_CLASS} ${CONTROL_WIDTH_CLASS[filter.kind]}`}
            />
          ))}
          <Bone className={`${CONTROL_HEIGHT_CLASS} ${CONTROL_WIDTH_CLASS.sort}`} />
          <Bone className={`${CONTROL_HEIGHT_CLASS} ${CONTROL_WIDTH_CLASS.toggle}`} />
        </div>
      </div>
      <div className={SUMMARY_CLASS} aria-hidden="true">
        <Bone className="h-5 w-64" />
      </div>
      <GameGridSkeleton />
      <div className={LOAD_MORE_ROW_CLASS} aria-hidden="true">
        <Bone className="h-11 w-48" />
      </div>
    </div>
  );
}
