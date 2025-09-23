<script setup>
definePageMeta({
  middleware: "auth-admin",
});

import { ref, onMounted } from "vue";
const winner = ref(null);
const isRaffling = ref(false);

const performRaffle = async () => {
  isRaffling.value = true;

  try {
    const token = localStorage.getItem("access");
    if (!token) throw new Error("No token encontrado");

    const res = await fetch(
      "http://localhost:8000/api/contest/winner/select/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al realizar el sorteo");
    }

    const data = await res.json();
    console.log("Ganador seleccionado:", data);
    winner.value = data;
    console.log("Ganador actualizado:", winner.value);
  } catch (err) {
    console.error(err);
    alert(err.message);
  } finally {
    isRaffling.value = false;
  }
};
const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("adminName");
  navigateTo("/adminlogin");
};
const raffleHistory = ref([]);

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const loadRaffleHistory = async () => {
  try {
    const token = localStorage.getItem("access");
    if (!token) return;

    const res = await fetch(
      "http://localhost:8000/api/contest/winner/history/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Error al cargar historial de sorteos");

    const data = await res.json();
    console.log("Historial de sorteos:", data);

    raffleHistory.value = data.map((p) => ({
      winnerName: p.user.name,
      winnerEmail: p.user.email,
      date: p.won_at,
    }));
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  loadRaffleHistory();
});
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"
  >
    <div class="container mx-auto px-4 py-6 relative z-10">
      <div
        class="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 flex flex-col lg:flex-row justify-between items-center gap-4"
        >
          <div class="flex items-center gap-3">
            <div class="text-3xl">🎲</div>
            <h1 class="text-2xl lg:text-3xl font-bold">Sorteo del Ganador</h1>
          </div>
          <button
            @click="logout"
            class="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-1"
          >
            Cerrar Sesión
          </button>
        </div>

        <div class="p-6 lg:p-8">
          <div v-if="!winner" class="text-center py-12">
            <div class="text-8xl mb-8 animate-pulse-slow">🎰</div>
            <h2 class="text-4xl font-bold text-gray-800 mb-6">
              ¿Listo para el sorteo?
            </h2>
            <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Hay
              <span class="font-bold text-blue-600">{{
                eligibleParticipants
              }}</span>
              participantes verificados listos para el sorteo.
            </p>

            <button
              @click="performRaffle"
              :disabled="isRaffling"
              :class="[
                'px-12 py-6 rounded-2xl font-bold text-xl shadow-lg transform transition-all duration-200',
                isRaffling
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl hover:-translate-y-2 hover:scale-105',
              ]"
            >
              <span v-if="isRaffling" class="animate-pulse"
                >🎲 Sorteando...</span
              >
              <span v-else>🎉 ¡Realizar Sorteo!</span>
            </button>
          </div>

          <div v-if="winner" class="py-8">
            <div
              class="bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-400 text-white p-8 lg:p-12 rounded-3xl text-center shadow-2xl border-4 border-yellow-300 mb-8"
            >
              <div class="text-6xl mb-6 animate-bounce">🏆</div>
              <h2 class="text-4xl lg:text-5xl font-bold mb-8">
                ¡Tenemos un Ganador!
              </h2>

              <div
                class="bg-white/90 text-gray-800 p-6 lg:p-8 rounded-2xl shadow-lg max-w-2xl mx-auto"
              >
                <h3 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {{ winner.user.name }}
                </h3>
                <div class="space-y-2 text-lg">
                  <p>
                    <span class="font-semibold">Email:</span>
                    {{ winner.user.email }}
                  </p>
                  <p>
                    <span class="font-semibold">Teléfono:</span>
                    {{ winner.user.phone }}
                  </p>
                  <p>
                    <span class="font-semibold">Fecha del sorteo:</span>
                    {{ formatDate(new Date()) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                @click="newRaffle"
                class="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Nuevo Sorteo
              </button>
              <router-link
                to="/adminparticipants"
                class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-center"
              >
                Ver Participantes
              </router-link>
            </div>
          </div>
          <div
            class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 lg:p-8 rounded-2xl shadow-inner"
          >
            <h4
              class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3"
            >
              <span class="text-3xl">📋</span>
              Historial de Sorteos
            </h4>

            <div v-if="raffleHistory.length === 0" class="text-center py-8">
              <div class="text-4xl mb-4 opacity-50">📅</div>
              <p class="text-lg text-gray-600">No hay sorteos previos</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="(entry, index) in raffleHistory"
                :key="index"
                class="bg-white p-4 lg:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-blue-500"
              >
                <div
                  class="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2"
                >
                  <div>
                    <h5 class="font-bold text-lg text-gray-900">
                      {{ entry.winnerName }}
                    </h5>
                    <p class="text-gray-600">{{ entry.winnerEmail }}</p>
                  </div>
                  <div class="text-sm text-gray-500 font-medium">
                    {{ formatDate(entry.date) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
