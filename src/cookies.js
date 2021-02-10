import cookieCutter from "cookie-cutter";
import Cookies from "cookies";

export function saveQuizSlug(slug, req, res) {
  const c = req || res ? Cookies(req, res) : cookieCutter;
  c.set("quiz.current", slug);
}

export function loadQuizSlug(req, res) {
  const c = req || res ? Cookies(req, res) : cookieCutter;
  const slug = c.get("quiz.current");
  return slug === "null" || slug === "undefined" ? null : slug;
}
