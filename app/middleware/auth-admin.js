export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const token = localStorage.getItem("access");

    if (!token) {
      return navigateTo("/adminlogin");
    }
  }
});
