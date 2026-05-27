<script setup>
import { computed, onBeforeUnmount, ref, onMounted } from 'vue';
import config from '../../config.js';
import themes from '../../themes.js';

const activeTheme = themes[config.theme] ?? themes['pink-gold'];
const copiedProvider = ref('');
const copyTimeouts = new Map();
const previewImage = ref('');
const scrollContainer = ref(null);
const activeSlide = ref(0);

const updateActiveSlide = () => {
  const el = scrollContainer.value;
  if (!el) return;
  const children = Array.from(el.children).filter((c) => c.tagName === 'ARTICLE');
  if (!children.length) return;
  const center = el.scrollLeft + el.clientWidth / 2;
  let nearest = 0;
  let nearestDistance = Infinity;
  children.forEach((child, idx) => {
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

const canPrev = () => activeSlide.value > 0;
const canNext = () => {
  const el = scrollContainer.value;
  if (!el) return false;
  const children = Array.from(el.children).filter((c) => c.tagName === 'ARTICLE');
  return activeSlide.value < children.length - 1;
};

const onKeydown = (e) => {
  const tag = document.activeElement?.tagName?.toLowerCase();
  const isInput = tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable;
  if (isInput) return;
  if (e.key === 'ArrowLeft') {
    prevSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
  }
};

const scrollToIndex = (i) => {
  const el = scrollContainer.value;
  if (!el) return;
  const children = Array.from(el.children).filter((c) => c.tagName === 'ARTICLE');
  const item = children[i];
  if (!item) return;
  el.scrollTo({ left: item.offsetLeft, behavior: 'smooth' });
};

const prevSlide = () => {
  const next = Math.max(0, activeSlide.value - 1);
  scrollToIndex(next);
};

const nextSlide = () => {
  const el = scrollContainer.value;
  if (!el) return;
  const children = Array.from(el.children).filter((c) => c.tagName === 'ARTICLE');
  const next = Math.min(children.length - 1, activeSlide.value + 1);
  scrollToIndex(next);
};

const sortedMethods = computed(() => {
  const order = { bank: 0, ewallet: 1, qris: 2 };
  return [...(config.donation?.methods ?? [])].sort((left, right) => order[left.type] - order[right.type]);
});

const copyAccountNumber = async (provider, accountNumber) => {
  try {
    // Gunakan clipboard browser agar nomor rekening mudah disalin.
    await navigator.clipboard.writeText(accountNumber);
    copiedProvider.value = provider;

    if (copyTimeouts.has(provider)) {
      window.clearTimeout(copyTimeouts.get(provider));
    }

    copyTimeouts.set(
      provider,
      window.setTimeout(() => {
        if (copiedProvider.value === provider) {
          copiedProvider.value = '';
        }
        copyTimeouts.delete(provider);
      }, 2000)
    );
  } catch {
    copiedProvider.value = '';
  }
};

const openPreview = (imageUrl) => {
  if (!imageUrl) {
    return;
  }

  previewImage.value = imageUrl;
};

const closePreview = () => {
  previewImage.value = '';
};

onBeforeUnmount(() => {
  copyTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
  copyTimeouts.clear();
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', updateActiveSlide);
  }
  window.removeEventListener('keydown', onKeydown);
});

onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', updateActiveSlide, { passive: true });
    // initial update
    setTimeout(updateActiveSlide, 50);
  }
  window.addEventListener('keydown', onKeydown);
});
</script>

<template>
  <section class="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur" :data-theme="config.theme" data-aos="fade-up">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">Donasi</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">{{ config.donation.title }}</h2>
      </div>
      <p class="max-w-2xl text-sm leading-7 text-slate-600">{{ config.donation.description }}</p>
    </div>

    <div class="mt-6">
      <div ref="scrollContainer" class="relative flex gap-4 overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:gap-4" role="list">
        <article v-for="(method, index) in sortedMethods" :key="`${method.type}-${method.provider}-${method.accountNumber}`" class="min-w-[85%] sm:min-w-[60%] lg:min-w-0 snap-start flex-shrink-0 flex h-full flex-col rounded-3xl border border-slate-100 p-5 shadow-sm" :style="{ backgroundColor: 'var(--color-bg)' }" data-aos="zoom-in" :data-aos-delay="index * 100">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{{ method.type }}</p>
            <h3 class="mt-2 text-xl font-semibold text-slate-900">{{ method.provider }}</h3>
          </div>
          <span class="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600" :style="{ backgroundColor: 'rgba(255,255,255,0.8)' }">{{ method.type }}</span>
        </div>

        <div class="mt-5 space-y-3 text-sm leading-7 text-slate-600">
          <p><span class="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Nomor Akun</span>{{ method.accountNumber }}</p>
          <p><span class="block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Nama Pemilik</span>{{ method.accountName }}</p>
        </div>

        <div class="mt-5">
          <button
            type="button"
            class="inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            :style="{ backgroundColor: 'var(--color-primary)' }"
            @click="copyAccountNumber(method.provider, method.accountNumber)"
          >
            {{ copiedProvider === method.provider ? 'Tersalin ✓' : 'Salin Nomor' }}
          </button>
        </div>

        <div v-if="method.type === 'qris'" class="mt-5" data-aos="fade-up" style="--aos-delay: 120ms;">
          <button type="button" class="block w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm" @click="openPreview(method.qrisImageUrl)">
            <img :src="method.qrisImageUrl || ''" alt="QRIS" class="h-64 w-full object-cover" />
          </button>
          <p class="mt-3 text-xs leading-6 text-slate-500">Klik gambar untuk membuka tampilan yang lebih besar.</p>
        </div>
        </article>
      </div>

      <!-- Controls for mobile slides -->
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
          <button v-for="(_, i) in sortedMethods.length" :key="i" type="button" class="h-2 w-8 rounded-full transition" :class="activeSlide === i ? 'bg-[var(--color-primary)]' : 'bg-white/60'" @click="scrollToIndex(i)" :aria-current="activeSlide === i" :aria-label="`Slide ${i+1}`"></button>
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

    <div class="mt-6 h-1 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))]" :style="{ '--_theme-color': activeTheme.primary }"></div>

    <Teleport to="body">
      <div v-if="previewImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" @click.self="closePreview">
        <div class="w-full max-w-4xl overflow-hidden rounded-3xl bg-white p-4 shadow-2xl">
          <div class="flex justify-end">
            <button type="button" class="rounded-full px-4 py-2 text-sm font-semibold text-slate-700" @click="closePreview">Tutup</button>
          </div>
          <img :src="previewImage" alt="QRIS diperbesar" class="max-h-[80vh] w-full object-contain" />
        </div>
      </div>
    </Teleport>
  </section>
</template>
