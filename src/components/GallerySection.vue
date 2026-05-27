<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import config from '../../config.js';
import themes from '../../themes.js';

const activeTheme = themes[config.theme] ?? themes['pink-gold'];
const activeImage = ref('');

const isOverlayOpen = computed(() => Boolean(activeImage.value));

const openOverlay = (image) => {
  activeImage.value = image;
  document.body.style.overflow = 'hidden';
};

const closeOverlay = () => {
  activeImage.value = '';
  document.body.style.overflow = '';
};

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
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
      <button
        v-for="(image, index) in config.gallery"
        :key="`${image}-${index}`"
        type="button"
        class="group overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 text-left shadow-sm"
        data-aos="zoom-in"
        :style="{ '--aos-delay': `${index * 90}ms` }"
        @click="openOverlay(image)"
      >
        <img :src="image" :alt="`Galeri pernikahan ${index + 1}`" class="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
      </button>
    </div>

    <div class="mt-6 h-1 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))]" :style="{ '--_theme-color': activeTheme.accent }"></div>

    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOverlayOpen" class="fixed inset-0 z-[100] grid place-items-center overflow-hidden px-4 py-4 text-white" @click.self="closeOverlay">
        <div class="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"></div>
        <div class="relative z-10 mx-auto flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col rounded-[2rem] border border-white/20 bg-white/10 px-5 py-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-8 sm:py-8">
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/85 text-2xl text-slate-800 shadow-lg transition hover:scale-105"
            aria-label="Tutup foto"
            @click="closeOverlay"
          >
            ×
          </button>

          <div class="text-center">
            <p class="text-sm font-semibold uppercase tracking-[0.5em] text-white/70">Galeri Pernikahan</p>
            <h3 class="mt-3 text-2xl font-semibold sm:text-3xl">Momen Indah Kami</h3>
            <p class="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
              Foto yang Anda pilih ditampilkan dalam popup bergaya undangan agar tetap serasi dengan nuansa acara.
            </p>
          </div>

          <div class="mt-6 flex min-h-[48vh] flex-1 items-center justify-center overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/20 shadow-inner shadow-black/20 sm:min-h-[55vh]">
            <img :src="activeImage" alt="Pratinjau foto galeri" class="block h-auto w-auto max-h-full max-w-full object-contain" />
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>
