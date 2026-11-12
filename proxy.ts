import { type NextRequest, NextResponse } from "next/server";

/**
 * Передаёт путь запроса в заголовке `x-pathname`: страница 404 (`app/global-not-found.tsx`) не получает
 * параметров и по этому заголовку понимает язык (`/ru/...` — русский, остальное — английский).
 * Ничего не переписывает и не перенаправляет; языка по браузеру не определяем (CLAUDE.md).
 */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // всё, кроме служебных путей Next и файлов из public
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
