<script setup>
import { reactive, ref } from 'vue';
import config from '../../config.js';
import themes from '../../themes.js';

const activeTheme = themes[config.theme] ?? themes['pink-gold'];

const form = reactive({
  name: '',
  attendance: 'Hadir',
  message: ''
});

const isSubmitting = ref(false);
const statusMessage = ref('');
const statusType = ref('idle');

const submitForm = async () => {
  if (!config.rsvp.googleScriptUrl) {
    statusType.value = 'error';
    statusMessage.value = 'URL Google Script belum diatur.';
    return;
  }

  isSubmitting.value = true;
  statusType.value = 'idle';
  statusMessage.value = '';

  // Bentuk payload sesuai nama kolom yang didefinisikan di config.js.
  const payload = {
    [config.rsvp.sheetColumns[0]]: form.name,
    [config.rsvp.sheetColumns[1]]: form.attendance,
    [config.rsvp.sheetColumns[2]]: form.message
  };

  try {
    const response = await fetch(config.rsvp.googleScriptUrl, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || (result && result.status === 'error')) {
      throw new Error(result?.message || 'Gagal mengirim RSVP');
    }

    form.name = '';
    form.attendance = 'Hadir';
    form.message = '';
    statusType.value = 'success';
    statusMessage.value = 'Terima kasih, RSVP Anda sudah kami terima.';
  } catch (error) {
    statusType.value = 'error';
    statusMessage.value = error instanceof Error ? error.message : 'Terjadi kendala saat mengirim RSVP.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <section class="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-lg shadow-slate-200/60 backdrop-blur" :data-theme="config.theme" data-aos="fade-up">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-primary)]">RSVP</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Konfirmasi Kehadiran</h2>
      </div>
      <p class="max-w-xl text-sm leading-7 text-slate-600">Mohon konfirmasi kehadiran Anda agar kami dapat menyiapkan sambutan dengan sebaik-baiknya.</p>
    </div>

    <form class="mt-6 grid gap-4 md:grid-cols-2" @submit.prevent="submitForm">
      <label class="space-y-2 md:col-span-1" data-aos="fade-up" style="--aos-delay: 80ms;">
        <span class="text-sm font-semibold text-slate-700">Nama</span>
        <input
          v-model="form.name"
          type="text"
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
          placeholder="Nama lengkap"
          required
        />
      </label>

      <label class="space-y-2 md:col-span-1" data-aos="fade-up" style="--aos-delay: 140ms;">
        <span class="text-sm font-semibold text-slate-700">Kehadiran</span>
        <select
          v-model="form.attendance"
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
        >
          <option value="Hadir">Hadir</option>
          <option value="Tidak">Tidak</option>
        </select>
      </label>

      <label class="space-y-2 md:col-span-2" data-aos="fade-up" style="--aos-delay: 200ms;">
        <span class="text-sm font-semibold text-slate-700">Pesan</span>
        <textarea
          v-model="form.message"
          rows="4"
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
          placeholder="Tulis doa dan pesan hangat untuk kami"
        ></textarea>
      </label>

      <div class="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-aos="fade-up" style="--aos-delay: 260ms;">
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          :style="{ backgroundColor: 'var(--color-primary)' }"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Mengirim...' : 'Kirim RSVP' }}
        </button>
        <p v-if="statusMessage" class="text-sm font-medium" :class="statusType === 'success' ? 'text-emerald-600' : 'text-rose-600'">
          {{ statusMessage }}
        </p>
      </div>
    </form>

    <div class="mt-6 h-1 rounded-full bg-[linear-gradient(90deg,var(--color-primary),var(--color-accent))]" :style="{ '--_theme-color': activeTheme.primary }"></div>
  </section>
</template>
