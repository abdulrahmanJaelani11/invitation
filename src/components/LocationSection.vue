<script setup>
import config from '../../config.js';
import themes from '../../themes.js';

const activeTheme = themes[config.theme] ?? themes['pink-gold'];
</script>

<template>
  <section class="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur" :data-theme="config.theme" data-aos="fade-up">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">Lokasi</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Peta Acara</h2>
      </div>
      <p class="max-w-xl text-sm leading-7 text-slate-600">Silakan gunakan peta berikut untuk menuju lokasi acara dengan lebih mudah.</p>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="rounded-3xl border border-slate-100 p-5" :style="{ backgroundColor: 'var(--color-bg)' }" data-aos="fade-right">
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Tempat</p>
        <h3 class="mt-3 text-xl font-semibold text-slate-900">{{ config.event.venue }}</h3>
        <p class="mt-2 text-sm leading-7 text-slate-600">{{ config.event.venueAddress }}</p>
      </div>

      <div class="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm" data-aos="fade-left">
        <iframe
          :src="config.event.mapsEmbedUrl"
          :title="`Lokasi ${config.event.venue}`"
          class="h-[28rem] w-full"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <div class="mt-6 h-1 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))]" :style="{ '--_theme-color': activeTheme.accent }"></div>
  </section>
</template>
