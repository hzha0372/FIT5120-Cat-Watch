<template>
  <main class="reminder-shell" aria-label="Reminder Centre">
    <header class="hero">
      <h1 class="hero-title">Reminder Centre</h1>
      <p class="hero-subtitle">Set a simple sunscreen reminder so you don’t forget to reapply.</p>
    </header>

    <section class="card" aria-labelledby="setup-title">
      <div class="card-head">
        <h2 id="setup-title" class="card-title">Reapply reminder</h2>
        <p class="card-caption">Default: every 2 hours. Choose a scenario to adjust.</p>
      </div>

      <div class="option-row" aria-label="Activity presets">
        <button
          v-for="o in options"
          :key="o.value"
          class="opt"
          :class="{ 'opt--active': activity === o.value }"
          type="button"
          @click="selectActivity(o.value)"
        >
          <span class="opt-icon">{{ o.icon }}</span>
          <span class="opt-label">{{ o.label }}</span>
        </button>
      </div>

      <div class="grid" aria-label="Reminder settings">
        <div class="box">
          <div class="label">Interval</div>
          <div class="value">Every {{ intervalMinutes }} min</div>
          <div class="detail">{{ intervalReason }}</div>
        </div>

        <div class="box">
          <div class="label">Status</div>
          <div class="value">{{ enabled ? 'ON' : 'OFF' }}</div>
          <div class="detail">Turn it on to start the countdown.</div>
        </div>

        <div class="box">
          <div class="label">Next reminder</div>
          <div class="value">{{ enabled ? countdownText : '—' }}</div>
          <div class="detail">Reset anytime if you reapply early.</div>
        </div>
      </div>

      <div class="actions">
        <button class="btn" type="button" @click="toggle">{{ enabled ? 'Turn OFF' : 'Turn ON' }}</button>
        <button class="btn btn--secondary" type="button" :disabled="!enabled" @click="reset">Reset timer</button>
      </div>

      <div v-if="toast" class="toast" role="alert" aria-live="assertive">
        <div class="toast-title">Time to reapply sunscreen</div>
        <div class="toast-body">{{ toast }}</div>
        <button class="toast-btn" type="button" @click="toast = ''">Done</button>
      </div>
    </section>

    <section class="card" aria-labelledby="tips-title">
      <div class="card-head">
        <h2 id="tips-title" class="card-title">Reminder tips</h2>
        <p class="card-caption">A reminder only helps if it matches your day.</p>
      </div>

      <ul class="tips">
        <li>Reapply after swimming, sweating, or towel drying.</li>
        <li>Keep sunscreen in your bag/car so it’s available when the reminder triggers.</li>
        <li>Use hat + shade as backup protection.</li>
      </ul>
    </section>
  </main>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const options = [
  { value: 'everyday', label: 'Everyday', icon: '☀️', interval: 120, reason: 'Standard guidance for most days.' },
  { value: 'sport', label: 'Sport / Sweat', icon: '🏃', interval: 80, reason: 'Sweat can reduce effectiveness faster.' },
  { value: 'swim', label: 'Swimming', icon: '🏊', interval: 60, reason: 'Water exposure needs more frequent reapplication.' },
]

const activity = ref('everyday')
const enabled = ref(false)
const toast = ref('')

const intervalMinutes = computed(() => options.find((o) => o.value === activity.value)?.interval || 120)
const intervalReason = computed(() => options.find((o) => o.value === activity.value)?.reason || '')

const remainingSeconds = ref(intervalMinutes.value * 60)
let timerId = null

const countdownText = computed(() => {
  const s = remainingSeconds.value
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
})

const clearTimer = () => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

const startTimer = () => {
  clearTimer()
  timerId = setInterval(() => {
    if (!enabled.value) return

    remainingSeconds.value = Math.max(0, remainingSeconds.value - 1)
    if (remainingSeconds.value === 0) {
      toast.value = `Activity: ${options.find((o) => o.value === activity.value)?.label || 'Reminder'}. Reapply now.`
      remainingSeconds.value = intervalMinutes.value * 60
    }
  }, 1000)
}

const reset = () => {
  remainingSeconds.value = intervalMinutes.value * 60
}

const toggle = () => {
  enabled.value = !enabled.value
  if (enabled.value && !timerId) startTimer()
  if (!enabled.value) clearTimer()
}

const selectActivity = (value) => {
  activity.value = value
  reset()
}

watch(
  () => intervalMinutes.value,
  () => {
    reset()
  },
)

onBeforeUnmount(() => {
  clearTimer()
})
</script>

<style scoped>
.reminder-shell {
  max-width: 980px;
  margin: 0 auto;
  padding: 22px;
  display: grid;
  gap: 16px;
}

.hero {
  border-radius: 18px;
  padding: 18px 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.14), rgba(249, 115, 22, 0.10));
}

.hero-title {
  margin: 0;
  font-size: 2rem;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin: 8px 0 0;
  color: rgba(15, 23, 42, 0.75);
  max-width: 72ch;
}

.card {
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
  padding: 16px;
}

.card-head {
  margin-bottom: 12px;
}

.card-title {
  margin: 0;
  font-size: 1.15rem;
}

.card-caption {
  margin: 6px 0 0;
  color: rgba(15, 23, 42, 0.65);
}

.option-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.opt {
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(15, 23, 42, 0.02);
  padding: 12px;
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.opt:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.10);
}

.opt--active {
  background: rgba(14, 165, 233, 0.10);
  border-color: rgba(14, 165, 233, 0.35);
}

.opt-icon {
  font-size: 1.1rem;
}

.grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.box {
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(15, 23, 42, 0.02);
}

.label {
  color: rgba(15, 23, 42, 0.6);
  font-weight: 800;
  font-size: 0.9rem;
}

.value {
  font-weight: 900;
  font-size: 1.2rem;
  margin-top: 4px;
}

.detail {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.75);
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  cursor: pointer;
  background: #0f172a;
  color: #fff;
}

.btn--secondary {
  background: rgba(15, 23, 42, 0.06);
  color: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(15, 23, 42, 0.12);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.toast {
  margin-top: 14px;
  border-radius: 16px;
  border: 1px solid rgba(249, 115, 22, 0.35);
  background: rgba(249, 115, 22, 0.10);
  padding: 12px;
  display: grid;
  gap: 6px;
}

.toast-title {
  font-weight: 900;
}

.toast-body {
  color: rgba(15, 23, 42, 0.85);
}

.toast-btn {
  justify-self: start;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  font-weight: 900;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.10);
}

.tips {
  margin: 0;
  padding-left: 18px;
  color: rgba(15, 23, 42, 0.85);
}

@media (max-width: 860px) {
  .option-row {
    grid-template-columns: 1fr;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
