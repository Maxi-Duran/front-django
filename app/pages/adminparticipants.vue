<script setup>
definePageMeta({
  middleware: "auth-admin",
});

import { ref, computed, onMounted } from "vue";

const participants = ref([]);
const searchTerm = ref("");

const totalParticipants = ref(0);
const verifiedParticipants = ref(0);
const pendingParticipants = ref(0);

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const filteredParticipants = computed(() => {
  if (!searchTerm.value) return participants.value;
  return participants.value.filter((p) =>
    [p.user.name, p.user.email].some((field) =>
      field?.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  );
});

const loadParticipants = async () => {
  try {
    const token = localStorage.getItem("access");
    if (!token) return;

    const res = await fetch(`http://localhost:8000/api/contest/participants`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Error al cargar participantes");
    }

    const data = await res.json();
    participants.value = data;

    console.log(" Participantes recibidos del backend:", data);

    totalParticipants.value = participants.value.length;
    verifiedParticipants.value = participants.value.filter(
      (p) => p.user.is_verified
    ).length;
    pendingParticipants.value = participants.value.filter(
      (p) => !p.user.is_verified
    ).length;
  } catch (error) {
    console.error(" Error en loadParticipants:", error);
  }
};

const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("adminName");
  navigateTo("/adminlogin");
};

onMounted(() => {
  loadParticipants();
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
            <div class="text-3xl">👥</div>
            <h1 class="text-2xl lg:text-3xl font-bold">
              Gestión de Concursantes
            </h1>
          </div>
          <button
            @click="logout"
            class="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-1"
          >
            Cerrar Sesión
          </button>
        </div>

        <div class="p-6 lg:p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all duration-300"
            >
              <div class="text-center">
                <div class="text-4xl font-bold mb-2">
                  {{ totalParticipants }}
                </div>
                <div class="text-blue-100">Total Participantes</div>
              </div>
            </div>
            <div
              class="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-all duration-300"
            >
              <div class="text-center">
                <div class="text-4xl font-bold mb-2">
                  {{ verifiedParticipants }}
                </div>
                <div class="text-emerald-100">Verificados</div>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <div class="text-xl">🔍</div>
              </div>
              <input
                type="text"
                class="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/80 text-lg"
                v-model="searchTerm"
                placeholder="Buscar participante por nombre o email..."
              />
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 mb-8">
            <router-link
              to="/admindraws"
              class="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              🎲 Realizar Sorteo
            </router-link>
            <button
              @click="exportData"
              class="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              📊 Exportar Datos
            </button>
          </div>

          <div class="overflow-hidden rounded-2xl shadow-lg bg-white">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gradient-to-r from-gray-100 to-gray-200">
                  <tr>
                    <th
                      class="px-6 py-4 text-left text-sm font-bold text-gray-700"
                    >
                      #
                    </th>
                    <th
                      class="px-6 py-4 text-left text-sm font-bold text-gray-700"
                    >
                      Nombre
                    </th>
                    <th
                      class="px-6 py-4 text-left text-sm font-bold text-gray-700"
                    >
                      Email
                    </th>
                    <th
                      class="px-6 py-4 text-left text-sm font-bold text-gray-700"
                    >
                      Teléfono
                    </th>
                    <th
                      class="px-6 py-4 text-left text-sm font-bold text-gray-700"
                    >
                      Estado
                    </th>
                    <th
                      class="px-6 py-4 text-left text-sm font-bold text-gray-700"
                    >
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(participant, index) in filteredParticipants"
                    :key="participant.id"
                    class="hover:bg-blue-50 transition-all duration-200"
                  >
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">
                      {{ index + 1 }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 font-medium">
                      {{ participant.user.name }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      {{ participant.user.email }}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      {{ participant.user.phone }}
                    </td>
                    <td class="px-6 py-4">
                      <span
                        :class="[
                          'px-3 py-1 rounded-full text-sm font-semibold',
                          participant.user.is_verified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-yellow-100 text-yellow-800',
                        ]"
                      >
                        {{
                          participant.user.is_verified
                            ? "✅ Verificado"
                            : "⏳ Pendiente"
                        }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                      {{ formatDate(participant.user.created_at) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div
            v-if="filteredParticipants.length === 0"
            class="text-center py-12"
          >
            <div class="text-6xl mb-4 opacity-50">🤷‍♂️</div>
            <p class="text-xl text-gray-600">
              No se encontraron participantes que coincidan con la búsqueda.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
