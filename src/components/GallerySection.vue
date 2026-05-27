<script setup>
import config from '../../config.js';
import themes from '../../themes.js';

const activeTheme = themes[config.theme] ?? themes['pink-gold'];
</script>

<template>
  <section class="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur" :data-theme="config.theme">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">Galeri</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Momen yang Kami Simpan</h2>
      </div>
      <p class="max-w-xl text-sm leading-7 text-slate-600">Kumpulan potret sederhana yang menangkap rasa syukur, kebahagiaan, dan harapan di hari istimewa kami.</p>
    </div>

    <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <figure v-for="(image, index) in config.gallery" :key="`${image}-${index}`" class="group overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm" data-aos="zoom-in" :style="{ '--aos-delay': `${index * 90}ms` }">
        <img :src="image" :alt="`Galeri pernikahan ${index + 1}`" class="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
      </figure>
    </div>

    <div class="mt-6 h-1 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))]" :style="{ '--_theme-color': activeTheme.accent }"></div>
  </section>
</template>
