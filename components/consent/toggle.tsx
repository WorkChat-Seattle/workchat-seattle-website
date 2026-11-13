/** Переключатель (Figma: toggle `1457:23422`): 44×24, квадратный; off — text/placeholder, on — button/dark, locked — on с opacity 50%. */
export function ToggleVisual({ on, locked = false }: { on: boolean; locked?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "flex h-6 w-11 shrink-0 items-center p-0.5 transition-colors duration-(--duration-link) ease-link motion-reduce:transition-none",
        on ? "bg-button-dark" : "bg-text-placeholder",
        locked ? "opacity-50" : "",
      ].join(" ")}
    >
      <span
        className={[
          "block size-5 bg-button-white transition-transform duration-(--duration-link) ease-link motion-reduce:transition-none",
          on ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </span>
  );
}
