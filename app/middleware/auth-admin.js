export default defineNuxtRouteMiddleware((to, from) => {
  const token = localStorage.getItem("access");

  if (!token) {
    return navigateTo("/adminlogin");
  }
});
