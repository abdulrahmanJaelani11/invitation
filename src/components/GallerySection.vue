<script setup>
import { computed, onBeforeUnmount, ref, onMounted } from 'vue';
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

// Slider state for mobile
const scrollContainer = ref(null);
const activeSlide = ref(0);

const updateActiveSlide = () => {
  const el = scrollContainer.value;
  if (!el) return;
  const items = Array.from(el.querySelectorAll('.gallery-card'));
  if (!items.length) return;
  const center = el.scrollLeft + el.clientWidth / 2;
  let nearest = 0;
  let nearestDistance = Infinity;
  items.forEach((child, idx) => {
    const rectLeft = child.offsetLeft;
    const rectCenter = rectLeft + child.clientWidth / 2;
    const dist = Math.abs(center - rectCenter);
    if (dist < nearestDistance) {
      nearestDistance = dist;
      nearest = idx;
    }
  });
  activeSlide.value = nearest;
};

const scrollToIndex = (i) => {
  const el = scrollContainer.value;
  if (!el) return;
  const items = Array.from(el.querySelectorAll('.gallery-card'));
  const item = items[i];
  if (!item) return;
  el.scrollTo({ left: item.offsetLeft, behavior: 'smooth' });
};

const prevSlide = () => scrollToIndex(Math.max(0, activeSlide.value - 1));
const nextSlide = () => {
  const items = Array.from(scrollContainer.value?.querySelectorAll('.gallery-card') || []);
  scrollToIndex(Math.min(items.length - 1, activeSlide.value + 1));
};

const canPrev = () => activeSlide.value > 0;
const canNext = () => {
  const items = Array.from(scrollContainer.value?.querySelectorAll('.gallery-card') || []);
  return activeSlide.value < items.length - 1;
};

const onKeydown = (e) => {
  const tag = document.activeElement?.tagName?.toLowerCase();
  const isInput = tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable;
  if (isInput) return;
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
};

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', updateActiveSlide, { passive: true });
    setTimeout(updateActiveSlide, 50);
  }
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  document.body.style.overflow = ''; // ensure scroll restored
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', updateActiveSlide);
  }
  window.removeEventListener('keydown', onKeydown);
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

    <div class="mt-6">
      <div ref="scrollContainer" class="flex gap-4 overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:gap-4" role="list">
        <button
          v-for="(image, index) in config.gallery"
          :key="`${image}-${index}`"
          type="button"
          class="gallery-card group min-w-[85%] sm:min-w-[60%] lg:min-w-0 snap-start flex-shrink-0 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 text-left shadow-sm"
          data-aos="zoom-in"
          :style="{ '--aos-delay': `${index * 90}ms` }"
          @click="openOverlay(image)"
        >
          <img :src="image" :alt="`Galeri pernikahan ${index + 1}`" class="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
        </button>
      </div>

      <!-- Mobile controls -->
      <div class="mt-4 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-sm shadow-sm"
          @click="prevSlide"
          :aria-disabled="!canPrev()"
          :disabled="!canPrev()"
          aria-label="Sebelumnya"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0L6.586 11a1 1 0 010-1.414l4.707-4.707a1 1 0 011.414 1.414L9.414 10l3.293 3.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
        </button>
        <div class="flex items-center gap-2">
          <button v-for="(_, i) in config.gallery.length" :key="i" type="button" class="h-2 w-8 rounded-full transition" :class="activeSlide === i ? 'bg-[var(--color-primary)]' : 'bg-white/60'" @click="scrollToIndex(i)" :aria-current="activeSlide === i" :aria-label="`Slide ${i+1}`"></button>
        </div>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-sm shadow-sm"
          @click="nextSlide"
          :aria-disabled="!canNext()"
          :disabled="!canNext()"
          aria-label="Selanjutnya"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.293 4.293a1 1 0 011.414 0L13.414 9a1 1 0 010 1.414L8.707 14.707a1 1 0 11-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>

    <div class="mt-6 h-1 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))]" :style="{ '--_theme-color': activeTheme.accent }"></div>

    <Teleport to="body">
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isOverlayOpen" class="fixed inset-0 z-[9999] grid place-items-center overflow-hidden px-4 py-4 text-white" @click.self="closeOverlay">
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
                Kumpulan potret sederhana yang menangkap rasa syukur, kebahagiaan, dan harapan di hari istimewa kami.
              </p>
            </div>

            <div class="mt-6 h-[58vh] max-h-[58vh] w-full overflow-hidden rounded-[1.75rem] border border-white/15 bg-black/20 shadow-inner shadow-black/20 sm:h-[62vh] sm:max-h-[62vh]">
              <img :src="activeImage" alt="Pratinjau foto galeri" class="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </section>
</template>
