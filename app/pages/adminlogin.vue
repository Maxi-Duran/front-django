<template>
  <div class="container mx-auto px-4 py-8 relative z-10">
    <div
      class="max-w-md mx-auto mt-20 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
    >
      <div
        class="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-center text-white"
      >
        <h1 class="text-3xl font-bold mb-2">Admin Panel</h1>
        <p class="text-lg opacity-90">Acceso exclusivo para administradores</p>
      </div>

      <div class="p-8">
        <form @submit.prevent="login" class="space-y-6">
          <div class="space-y-2">
            <label
              for="adminEmail"
              class="block text-sm font-semibold text-gray-700"
            >
              Email de Administrador
            </label>
            <input
              type="email"
              id="adminEmail"
              v-model="email"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-800 focus:ring-4 focus:ring-gray-800/20 transition-all duration-200 bg-white/80"
              placeholder="admin@hotel.com"
              required
            />
          </div>

          <div class="space-y-2">
            <label
              for="adminPassword"
              class="block text-sm font-semibold text-gray-700"
            >
              Contraseña
            </label>
            <input
              v-model="password"
              type="password"
              id="adminPassword"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-800 focus:ring-4 focus:ring-gray-800/20 transition-all duration-200 bg-white/80"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Iniciar Sesión
          </button>
          <div
            v-if="mensaje"
            class="mt-4 text-center text-red-600 font-semibold"
          >
            {{ mensaje }}
          </div>
        </form>
      </div>

      <div class="px-8 pb-8 text-center">
        <router-link
          to="/"
          class="text-gray-600 hover:text-gray-800 font-semibold underline underline-offset-4 decoration-2 transition-all duration-200"
        >
          Volver al Concurso
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      mensaje: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch("http://localhost:8000/api/admin-login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          this.mensaje = "Login exitoso: " + data.user.name;
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);

          localStorage.setItem("adminName", data.user.name);

          this.$router.push("/adminparticipants");
        } else {
          this.mensaje = data.error || "Error al iniciar sesión";
        }
      } catch (err) {
        console.error("Error en fetch:", err);
        this.mensaje = "Error de conexión con el backend";
      }
    },
  },
};
</script>
