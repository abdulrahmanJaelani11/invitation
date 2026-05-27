<script setup>
import config from '../../config.js';
import themes from '../../themes.js';
import heroImage from '../assets/images/20260321_12_ninetysix_kdr.jpg';
const activeTheme = themes[config.theme] ?? themes['pink-gold'];

const formatDate = (value) => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(value));
};
</script>

<template>
  <section class="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 shadow-2xl shadow-slate-200/70 backdrop-blur" :data-theme="config.theme">
    <div class="grid lg:grid-cols-2">
      <div class="relative min-h-[26rem] lg:min-h-[36rem]" data-aos="fade-right" style="--aos-delay: 80ms;">
        <img
          :src="heroImage"
          :alt="`${config.couple.groomName} dan ${config.couple.brideName}`"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          <p class="text-sm uppercase tracking-[0.35em] text-white/80">Save the Date</p>
          <p class="mt-3 max-w-md text-lg leading-8 text-white/95">{{ config.content.openingQuote }}</p>
        </div>
      </div>

      <div class="flex flex-col justify-center gap-6 p-6 sm:p-8 lg:p-10">
        <div data-aos="fade-up" style="--aos-delay: 140ms;">
          <p class="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-primary)]">Undangan Pernikahan</p>
          <h1 class="mt-3 text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
            {{ config.couple.groomName }}
            <span class="block text-2xl text-slate-500">&</span>
            {{ config.couple.brideName }}
          </h1>
        </div>

        <div class="space-y-4 rounded-3xl border border-slate-100 p-5 shadow-inner shadow-slate-100" data-aos="fade-left" :style="{ backgroundColor: 'var(--color-bg)' }">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Akad Nikah</p>
            <p class="mt-2 text-lg text-slate-800">{{ formatDate(config.event.akadDate) }}</p>
            <p class="text-sm text-slate-500">{{ config.event.venue }}</p>
          </div>
          <div class="h-px bg-slate-200"></div>
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Resepsi</p>
            <p class="mt-2 text-lg text-slate-800">{{ formatDate(config.event.receptionDate) }}</p>
            <p class="text-sm text-slate-500">{{ config.event.venueAddress }}</p>
          </div>
        </div>

        <div class="rounded-3xl border bg-white p-5" data-aos="zoom-in" :style="{ borderColor: 'var(--color-primary)' }">
          <p class="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Keluarga</p>
          <div class="mt-3 grid gap-3 text-sm leading-7 text-slate-600 sm:grid-cols-2">
            <p><span class="block font-semibold text-slate-800">Mempelai Pria</span>{{ config.couple.groomParents }}</p>
            <p><span class="block font-semibold text-slate-800">Mempelai Wanita</span>{{ config.couple.brideParents }}</p>
          </div>
          <div class="mt-4 h-1 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))]" :style="{ '--_theme-color': activeTheme.primary }"></div>
        </div>
      </div>
    </div>
  </section>
</template>
