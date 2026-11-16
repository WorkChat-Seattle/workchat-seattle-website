import { type NextRequest, NextResponse } from "next/server";
import { isIndexableHost } from "@/lib/seo";

/**
 * Передаёт путь запроса в заголовке `x-pathname`: страница 404 (`app/global-not-found.tsx`) не получает
 * параметров и по этому заголовку понимает язык (`/ru/...` — русский, остальное — английский).
 * Закрывает от индексации чужие адреса (X-Robots-Tag). Ничего не переписывает и не перенаправляет; языка по браузеру не определяем (CLAUDE.md).
 */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  const response = NextResponse.next({ request: { headers } });
  // индексация только на workchatseattle.org; на *.vercel.app и других адресах — noindex (страницы статические, мета-тегом не решить)
  if (!isIndexableHost(request.headers.get("x-forwarded-host") ?? request.headers.get("host"))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  // всё, кроме служебных путей Next и файлов из public
  matcher: ["/((?!_next/|api/|.*\\..*).*)"],
};
