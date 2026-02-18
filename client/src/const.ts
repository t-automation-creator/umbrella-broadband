export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Redirect to admin login page for unauthenticated access
export const getAdminLoginUrl = () => {
  return "/admin/login";
};

// Deprecated: OAuth login removed - use getAdminLoginUrl instead
export const getLoginUrl = () => {
  return "/admin/login";
};
