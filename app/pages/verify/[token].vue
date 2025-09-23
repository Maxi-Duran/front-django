<template>
  <div class="container mx-auto px-4 py-8 relative z-10">
    <div
      class="max-w-lg mx-auto mt-12 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
    >
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center text-white"
      >
        <div class="text-5xl mb-4">
          <span v-if="!isVerified" class="animate-pulse-slow">📧</span>
          <span v-else class="animate-bounce">🎊</span>
        </div>
        <h1 class="text-3xl font-bold mb-2">
          <span v-if="!isVerified">Verificando correo...</span>
          <span v-else>Correo verificado ✅</span>
        </h1>
        <p class="text-lg opacity-90">
          <span v-if="!isVerified"
            >Espere un momento mientras validamos tu cuenta</span
          >
          <span v-else>Completa tu registro creando una contraseña</span>
        </p>
      </div>

      <div class="p-8">
        <!-- Formulario de contraseña -->
        <div v-if="isVerified && !isCompleted">
          <form @submit.prevent="setPassword" class="space-y-6">
            <div class="space-y-2">
              <label
                for="password"
                class="block text-sm font-semibold text-gray-700"
                >Crear Contraseña *</label
              >
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Crea una contraseña segura"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/80 placeholder-gray-500 shadow-inner hover:shadow-md"
              />
            </div>
            <div class="space-y-2">
              <label
                for="confirmPassword"
                class="block text-sm font-semibold text-gray-700"
                >Confirmar Contraseña *</label
              >
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="Repite tu contraseña"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-200 bg-white/80 placeholder-gray-500 shadow-inner hover:shadow-md"
              />
            </div>
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 animate-bounce-slow"
            >
              ✅ Activar Cuenta
            </button>
          </form>
        </div>

        <!-- Mensaje final de cuenta activada -->
        <div v-if="isCompleted" class="text-center mt-6">
          <div
            class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-8 rounded-2xl shadow-lg animate-bounce"
          >
            <div class="text-5xl mb-4">🎊</div>
            <h2 class="text-3xl font-bold mb-2">¡Cuenta Activada!</h2>
            <p class="text-lg opacity-90">
              Tu cuenta ha sido activada. Ya estás participando en el sorteo.
            </p>
          </div>
          <router-link
            to="/"
            class="inline-block bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-1 shadow-md mt-4"
          >
            Volver al Inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const isVerified = ref(false); // token válido y correo verificado
const isCompleted = ref(false); // contraseña creada

const token = ref(route.params.token || "");

onMounted(async () => {
  try {
    const res = await fetch(
      `http://localhost:8000/api/users/verify/${token.value}/`,
      { method: "GET" }
    );
    if (res.ok) isVerified.value = true;
  } catch (err) {
    console.error(err);
  }
});

const setPassword = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:8000/api/users/verify/${token.value}/`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token.value, password: password.value }),
      }
    );

    if (res.ok) {
      isCompleted.value = true;
    } else {
      const data = await res.json();
      alert(data.error || "Error al crear contraseña");
    }
  } catch (err) {
    console.error(err);
  }
};
</script>
