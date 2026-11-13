/**
 * Один общий обработчик прокрутки на requestAnimationFrame (animations.md, общие правила):
 * параллакс, Numbers, Our Values подписываются сюда, пока их секция на экране.
 * Слушатели scroll / resize вешаются при первой подписке и снимаются, когда подписчиков не осталось.
 */
type Fn = () => void;

const subscribers = new Set<Fn>();
let ticking = false;

function run() {
  ticking = false;
  subscribers.forEach((fn) => fn());
}

function onEvent() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(run);
}

export function subscribeScroll(fn: Fn): () => void {
  if (subscribers.size === 0) {
    window.addEventListener("scroll", onEvent, { passive: true });
    window.addEventListener("resize", onEvent, { passive: true });
  }
  subscribers.add(fn);
  fn();
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) {
      window.removeEventListener("scroll", onEvent);
      window.removeEventListener("resize", onEvent);
    }
  };
}

/** Число из CSS-переменной на <html> (px и безразмерные значения). */
export function cssNumber(name: string, fallback: number): number {
  const v = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
}

/** Параллакс включён только с 1280 и без prefers-reduced-motion. */
export const parallaxQuery = "(min-width: 1280px) and (prefers-reduced-motion: no-preference)";
