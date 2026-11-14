import { Icon, type IconType } from "@/components/ui/icon";

/** Строка события: иконка + текст feature, зазор 8 (Figma: event-detail `1034:1380`, type date | time | location | language). */
export function EventDetail({ type, children }: { type: IconType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <Icon type={type} />
      <span className="text-feature text-text-body xl:whitespace-nowrap">{children}</span>
    </div>
  );
}
