<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import config from '../../config.js';
import themes from '../../themes.js';

const activeTheme = themes[config.theme] ?? themes['pink-gold'];
const now = ref(Date.now());
let timerId = null;

const targetTime = computed(() => new Date(config.event.receptionDate).getTime());

const remaining = computed(() => {
  const distance = Math.max(targetTime.value - now.value, 0);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return { days, hours, minutes, seconds };
});

const pad = (value) => String(value).padStart(2, '0');

onMounted(() => {
  // Perbarui hitung mundur setiap detik agar waktu tampil akurat.
  timerId = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timerId) {
    window.clearInterval(timerId);
  }
});
</script>

<template>
  <section class="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur" :data-theme="config.theme">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">Hitung Mundur</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Menuju Resepsi</h2>
      </div>
      <p class="max-w-xl text-sm leading-7 text-slate-600">
        Kami menantikan kehadiran Anda pada momen yang kami syukuri dengan penuh cinta dan doa.
      </p>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div v-for="item in [
        { label: 'Hari', value: remaining.days },
        { label: 'Jam', value: remaining.hours },
        { label: 'Menit', value: remaining.minutes },
        { label: 'Detik', value: remaining.seconds }
      ]" :key="item.label" class="rounded-3xl border border-slate-100 p-4 text-center shadow-inner" data-aos="zoom-in" :style="{ backgroundColor: 'var(--color-bg)' }">
        <p class="text-3xl font-semibold text-slate-900">{{ pad(item.value) }}</p>
        <p class="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{{ item.label }}</p>
      </div>
    </div>

    <div class="mt-6 h-1 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))]" :style="{ '--_theme-color': activeTheme.primary }"></div>
  </section>
</template>
