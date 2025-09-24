<script>
export default {
  data() {
    return {
      email: "",
      name: "",
      phone: "",
      respuesta: null,
      errorMsg: "", // Mensaje de error
    };
  },
  methods: {
    async registrarUsuario() {
      this.errorMsg = ""; // limpiar error antes de enviar
      this.respuesta = null; // limpiar respuesta anterior

      try {
        const response = await fetch("http://localhost:8000/api/users/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            name: this.name,
            phone: this.phone,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.email) this.errorMsg = errorData.email[0];
          else if (errorData.error) this.errorMsg = errorData.error;
          else this.errorMsg = "Error al registrar el usuario.";
          return;
        }

        const data = await response.json();
        this.respuesta = data;
        console.log("Usuario creado:", data);

        this.email = "";
        this.name = "";
        this.phone = "";
      } catch (error) {
        console.error("Error al crear usuario:", error);
        this.errorMsg = "No se pudo conectar con el servidor.";
      }
    },
  },
};
</script>

<template>
  <div class="w-full min-h-screen mx-auto px-4 py-8 relative z-10">
    <div
      class="max-w-2xl mx-auto mt-12 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-3xl"
    >
      <div
        class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-8 text-center text-white"
      >
        <h1
          class="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200"
        >
          Concurso Hotel Luxury
        </h1>
        <p class="text-xl opacity-90">Participa y gana una estadía increíble</p>
      </div>

      <div class="p-8 lg:p-12">
        <form class="space-y-6" @submit.prevent="registrarUsuario">
          <div class="space-y-2">
            <label
              for="fullName"
              class="block text-sm font-semibold text-gray-700"
            >
              Nombre Completo *
            </label>
            <input
              v-model="name"
              type="text"
              id="fullName"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 placeholder-gray-500"
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>

          <div class="space-y-2">
            <label
              for="email"
              class="block text-sm font-semibold text-gray-700"
            >
              Correo Electrónico *
            </label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 placeholder-gray-500"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div class="space-y-2">
            <label
              for="phone"
              class="block text-sm font-semibold text-gray-700"
            >
              Teléfono *
            </label>
            <input
              v-model="phone"
              type="text"
              id="phone"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 placeholder-gray-500"
              placeholder="999999999"
              required
            />
          </div>

          <!-- Mensaje de error -->
          <p v-if="errorMsg" class="text-red-500 font-semibold">
            Ya existe un usuario con ese correo electrónico.
          </p>

          <button
            type="submit"
            class="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 hover:scale-105"
          >
            Participar en el Sorteo
          </button>
        </form>

        <div
          v-if="respuesta"
          class="mt-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-2xl text-center shadow-lg animate-bounce-slow"
        >
          <div class="text-4xl mb-3">🎉</div>
          <h2 class="text-2xl font-bold mb-2">¡Gracias por registrarte!</h2>
          <p class="text-lg opacity-90">
            Revisa tu correo para verificar tu cuenta.
          </p>
        </div>
      </div>

      <div class="px-8 pb-8 text-center">
        <router-link
          to="/adminlogin"
          class="text-blue-600 hover:text-purple-600 font-semibold underline underline-offset-4 decoration-2 hover:decoration-purple-600 transition-all duration-200"
        >
          Panel de Administración
        </router-link>
      </div>
    </div>
  </div>
</template>
