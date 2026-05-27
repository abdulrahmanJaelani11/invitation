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
import musicFile from './assets/music/bs.mp3';

const activeTheme = themes[config.theme] ?? themes['pink-gold'];
const musicRef = ref(null);
const isMusicPlaying = ref(false);
const isInvitationOpen = ref(false);
const musicSource = musicFile;
const openingBackground = '/assets/images/20260321_12_ninetysix_kdr.jpg';
let scrollObserver = null;

const musicLabel = computed(() => (isMusicPlaying.value ? 'Matikan Musik' : 'Nyalakan Musik'));
const inviteeName = computed(() => {
  if (typeof window === 'undefined') {
    return config.inviteeName ?? 'Bapak/Ibu/Saudara/i';
  }

  const params = new URLSearchParams(window.location.search);
  return params.get('nama') || params.get('to') || params.get('guest') || (config.inviteeName ?? 'Bapak/Ibu/Saudara/i');
});

const openInvitation = async () => {
  isInvitationOpen.value = true;
  document.body.style.overflow = '';

  if (!musicRef.value || isMusicPlaying.value) {
    return;
  }

  try {
    musicRef.value.volume = 0.35;
    await musicRef.value.play();
    isMusicPlaying.value = true;
  } catch {
    isMusicPlaying.value = false;
  }
};

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
  document.body.style.overflow = 'hidden';

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
  document.body.style.overflow = '';

  if (scrollObserver) {
    scrollObserver.disconnect();
    scrollObserver = null;
  }
});
</script>

<template>
  <div class="min-h-screen bg-[var(--color-bg)] text-slate-800">
    <transition
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="!isInvitationOpen" class="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden px-4 py-8 text-white">
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" :style="{ backgroundImage: `url(${openingBackground})` }"></div>
        <div class="absolute inset-0 bg-slate-950/65"></div>
        <div class="relative z-10 mx-auto w-full max-w-xl rounded-[2rem] border border-white/20 bg-white/10 px-6 py-10 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:px-10">
          <p class="text-sm font-semibold uppercase tracking-[0.5em] text-white/75">Undangan Pernikahan</p>
          <h1 class="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">
            Kepada Yth.
          </h1>
          <p class="mt-4 text-2xl font-medium text-white sm:text-3xl">
            {{ inviteeName }}
          </p>
          <p class="mt-5 text-sm leading-7 text-white/85 sm:text-base">
            Dengan hormat, kami mengundang Anda untuk hadir dan memberikan doa restu pada hari bahagia kami.
          </p>
          <button
            type="button"
            class="mt-8 inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            :style="{ backgroundColor: 'var(--color-primary)', color: '#fff' }"
            @click="openInvitation"
          >
            Buka Undangan
          </button>
        </div>
      </div>
    </transition>

    <main :class="['min-h-screen transition duration-300', !isInvitationOpen ? 'pointer-events-none select-none blur-[1.5px]' : '']">
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
        v-if="isInvitationOpen"
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
  </div>
</template>
