<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import config from '../config.js';
import themes from '../themes.js';
import HeroSection from './components/HeroSection.vue';
import CountdownTimer from './components/CountdownTimer.vue';
import GallerySection from './components/GallerySection.vue';
import RSVPForm from './components/RSVPForm.vue';
import LocationSection from './components/LocationSection.vue';
import DonationSection from './components/DonationSection.vue';

const activeTheme = themes[config.theme] ?? themes['pink-gold'];
const musicRef = ref(null);
const isMusicPlaying = ref(false);
const musicSource = './assets/music/0527.MP3';
let scrollObserver = null;

const musicLabel = computed(() => (isMusicPlaying.value ? 'Matikan Musik' : 'Nyalakan Musik'));

const toggleMusic = async () => {
  if (!musicRef.value) {
    return;
  }

  if (isMusicPlaying.value) {
    musicRef.value.pause();
    isMusicPlaying.value = false;
    return;
  }

  try {
    await musicRef.value.play();
    isMusicPlaying.value = true;
  } catch {
    isMusicPlaying.value = false;
  }
};

onMounted(() => {
  // Inject tema aktif ke CSS custom properties agar semua komponen konsisten.
  const root = document.documentElement;
  root.style.setProperty('--color-primary', activeTheme.primary);
  root.style.setProperty('--color-accent', activeTheme.accent);
  root.style.setProperty('--color-bg', activeTheme.bg);

  // Coba putar musik saat halaman dibuka; beberapa browser memerlukan interaksi user.
  if (musicRef.value) {
    musicRef.value.volume = 0.35;
    musicRef.value.play()
      .then(() => {
        isMusicPlaying.value = true;
      })
      .catch(() => {
        isMusicPlaying.value = false;
      });
  }

  // Aktifkan animasi saat elemen masuk viewport.
  const motionTargets = document.querySelectorAll('[data-aos]');

  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-in');
          scrollObserver?.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  motionTargets.forEach((element) => {
    scrollObserver.observe(element);
  });
});

onBeforeUnmount(() => {
  if (scrollObserver) {
    scrollObserver.disconnect();
    scrollObserver = null;
  }
});
</script>

<template>
  <main class="min-h-screen bg-[var(--color-bg)] text-slate-800">
    <section class="relative overflow-hidden" data-aos="fade-down">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_transparent_58%)]"></div>
      <div class="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <HeroSection />
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8" data-aos="fade-up" style="--aos-delay: 120ms;">
      <CountdownTimer />
    </section>

    <section class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8" data-aos="fade-right" style="--aos-delay: 180ms;">
      <div class="grid gap-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur md:grid-cols-[1.2fr_0.8fr]">
        <div class="space-y-4" data-aos="fade-up" style="--aos-delay: 80ms;">
          <p class="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--color-primary)]">Undangan</p>
          <blockquote class="text-xl leading-relaxed text-slate-700 sm:text-2xl">
            {{ config.content.openingQuote }}
          </blockquote>
          <p class="text-base leading-8 text-slate-600 sm:text-lg">{{ config.content.invitationText }}</p>
          <p class="text-base leading-8 text-slate-600 sm:text-lg">{{ config.content.closingMessage }}</p>
        </div>
        <div class="rounded-3xl border bg-white p-5 shadow-lg shadow-slate-100" :style="{ borderColor: 'var(--color-primary)' }" data-aos="zoom-in" style="--aos-delay: 180ms;">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Detail Singkat</p>
          <div class="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <p><span class="font-semibold text-slate-800">Akad:</span> {{ config.event.akadDate }}</p>
            <p><span class="font-semibold text-slate-800">Resepsi:</span> {{ config.event.receptionDate }}</p>
            <p><span class="font-semibold text-slate-800">Lokasi:</span> {{ config.event.venue }}</p>
            <p>{{ config.event.venueAddress }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8" data-aos="fade-left" style="--aos-delay: 240ms;">
      <LocationSection />
    </section>

    <section class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8" data-aos="fade-up" style="--aos-delay: 300ms;">
      <GallerySection />
    </section>

    <section class="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8" data-aos="fade-right" style="--aos-delay: 360ms;">
      <RSVPForm />
    </section>

    <section v-if="config.donation" class="mx-auto max-w-6xl px-4 py-6 pb-16 sm:px-6 lg:px-8" data-aos="zoom-in" style="--aos-delay: 420ms;">
      <DonationSection />
    </section>

    <audio ref="musicRef" :src="musicSource" loop preload="auto"></audio>

    <button
      type="button"
      class="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/70 bg-white/90 text-2xl shadow-xl shadow-slate-300/60 backdrop-blur transition hover:scale-105"
      :style="{ color: 'var(--color-primary)' }"
      :aria-label="musicLabel"
      :title="musicLabel"
      @click="toggleMusic"
    >
      <span v-if="isMusicPlaying" aria-hidden="true">🔊</span>
      <span v-else aria-hidden="true">🔇</span>
    </button>
  </main>
</template>
