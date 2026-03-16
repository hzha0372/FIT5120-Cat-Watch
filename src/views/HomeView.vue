<template>
  <main class="home-shell" aria-label="Home">
    <section class="card enter" aria-labelledby="uv-title">
      <div class="card-head">
        <h1 id="uv-title" class="card-title">UV Dashboard</h1>
        <p class="card-caption">
          Select a point on the map to load today’s hourly UV forecast (Open‑Meteo).
        </p>
      </div>

      <div class="map-grid">
        <div>
          <Map v-model="mapLocation" height="420px" aria-label="Melbourne map" />
          <div class="map-hint">
            Selected: {{ mapLocation.center.lng.toFixed(4) }}, {{ mapLocation.center.lat.toFixed(4) }}
          </div>
        </div>

        <div class="summary">
          <div class="metric">
            <div class="metric-label">Peak UV today</div>
            <div class="metric-value">{{ uvSummary ? uvSummary.peakUv : '—' }}</div>
            <div v-if="uvSummary" class="metric-sub">{{ riskLabel }} risk</div>
          </div>

          <div v-if="uvSummary" class="mini" :class="alertClass" role="status" aria-live="polite">
            <div class="mini-title">{{ alertContent.title }}</div>
            <div class="mini-text">
              {{ homepageCopy }}
            </div>
          </div>
          <div v-else class="placeholder">Click the map to load UV data.</div>

          <p v-if="loading" class="status">Loading hourly UV…</p>
          <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import Map from '@/components/Map.vue'

const loading = ref(false)
const errorMessage = ref('')

const mapLocation = ref({ center: { lng: 144.9631, lat: -37.8136 }, zoom: 11 })

const hourly = ref([])
const parseHourly = (data) => {
  const times = data?.hourly?.time
  const uvs = data?.hourly?.uv_index

  if (!Array.isArray(times) || !Array.isArray(uvs) || times.length !== uvs.length) {
    throw new Error('Hourly UV data not available for this location.')
  }

  return times
    .map((t, i) => ({
      time: new Date(t),
      uv: typeof uvs[i] === 'number' ? uvs[i] : Number(uvs[i]),
    }))
    .filter((d) => Number.isFinite(d.uv))
}

const fetchHourlyUv = async (lat, lng) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=uv_index&forecast_days=1&timezone=auto`,
    )
    const data = await response.json()
    hourly.value = parseHourly(data)
    await nextTick()
  } catch (e) {
    hourly.value = []
    errorMessage.value = e?.message || 'Failed to load hourly UV.'
  } finally {
    loading.value = false
  }
}

const uvSummary = computed(() => {
  if (!hourly.value.length) return null
  const sorted = [...hourly.value].sort((a, b) => a.time.getTime() - b.time.getTime())
  const peak = sorted.reduce((acc, cur) => (cur.uv > acc.uv ? cur : acc), sorted[0])
  const uv3PlusHours = sorted.filter((d) => d.uv >= 3).length
  const peakTime = peak.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return {
    peakUv: peak.uv.toFixed(1),
    peakUvNumber: peak.uv,
    peakTime,
    hoursUv3Plus: uv3PlusHours,
  }
})

const riskLabel = computed(() => {
  const uv = uvSummary.value?.peakUvNumber
  if (!Number.isFinite(uv)) return '—'
  if (uv <= 2.9) return 'Low'
  if (uv <= 5.9) return 'Moderate'
  if (uv <= 7.9) return 'High'
  if (uv <= 10.9) return 'Very High'
  return 'Extreme'
})

const alertContent = computed(() => {
  const uv = uvSummary.value?.peakUvNumber
  if (!Number.isFinite(uv)) {
    return { title: '', main: '', shortTerm: '', longTerm: '' }
  }

  if (uv >= 11) {
    return {
      title: 'Extreme UV: act now',
      main: 'Severe skin damage can occur quickly. Prioritise shade and protection immediately.',
      shortTerm: 'Burning may occur rapidly without protection.',
      longTerm: 'Higher cumulative risk of skin cancer and premature skin aging.',
    }
  }
  if (uv >= 8) {
    return {
      title: 'Very High UV: protect your skin',
      main: 'Plan shade breaks and apply sunscreen to exposed skin.',
      shortTerm: 'Sunburn risk is high during peak hours.',
      longTerm: 'Repeated exposure increases long-term risk of DNA damage.',
    }
  }
  if (uv >= 6) {
    return {
      title: 'High UV: limit exposure',
      main: 'Use sunscreen, protective clothing, and shade—especially around midday.',
      shortTerm: 'Skin can start to burn if unprotected.',
      longTerm: 'Long-term exposure contributes to skin aging and cancer risk.',
    }
  }
  if (uv >= 3) {
    return {
      title: 'Moderate UV: start protection',
      main: 'UV is high enough to cause damage. Prepare before you go outside.',
      shortTerm: 'Unprotected skin can still burn over time.',
      longTerm: 'Cumulative UV exposure adds up across the year.',
    }
  }
  return {
    title: 'Low UV: stay UV-aware',
    main: 'Protection is usually not required unless you will be outside for extended time.',
    shortTerm: 'Low immediate risk.',
    longTerm: 'Continue checking near midday in case UV rises.',
  }
})

const alertClass = computed(() => {
  const uv = uvSummary.value?.peakUvNumber
  if (!Number.isFinite(uv)) return ''
  if (uv <= 2.9) return 'alert--low'
  if (uv <= 5.9) return 'alert--moderate'
  if (uv <= 7.9) return 'alert--high'
  if (uv <= 10.9) return 'alert--veryhigh'
  return 'alert--extreme'
})

const homepageCopy = computed(() => {
  const uv = uvSummary.value?.peakUvNumber
  if (!Number.isFinite(uv)) return ''

  if (uv < 3) {
    return 'UV is usually low right now. Keep UV-aware—levels can rise quickly around midday.'
  }
  if (uv < 6) {
    return 'UV can damage skin even if it doesn’t feel hot. If you’ll be outside, start protection now.'
  }
  if (uv < 8) {
    return 'UV is high. Unprotected skin can burn. Use sunscreen, shade and protective clothing.'
  }
  return 'UV is very high to extreme. Skin damage can occur quickly—avoid peak sun and protect immediately.'
})

watch(
  () => ({ lng: mapLocation.value.center.lng, lat: mapLocation.value.center.lat }),
  async ({ lng, lat }) => {
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return
    await fetchHourlyUv(lat, lng)
  },
  { deep: true, immediate: true },
)
</script>

<style scoped>
.home-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 22px;
  display: grid;
  gap: 16px;
}

.card {
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
  padding: 16px;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
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

.map-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 12px;
  align-items: start;
}

.map-hint {
  margin-top: 10px;
  color: rgba(15, 23, 42, 0.65);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
  font-size: 0.9rem;
}

.metric {
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(15, 23, 42, 0.02);
}

.metric-label {
  color: rgba(15, 23, 42, 0.6);
  font-weight: 700;
  font-size: 0.9rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 900;
  margin-top: 2px;
}

.metric-sub {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.65);
  font-size: 0.9rem;
}

.mini {
  margin-top: 12px;
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, 0.1);
}

.mini-title {
  font-weight: 900;
}

.mini-text {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.82);
  line-height: 1.55;
}

.alert--low {
  background: rgba(34, 197, 94, 0.10);
}

.alert--moderate {
  background: rgba(234, 179, 8, 0.12);
}

.alert--high {
  background: rgba(249, 115, 22, 0.12);
}

.alert--veryhigh,
.alert--extreme {
  background: rgba(239, 68, 68, 0.10);
}

.placeholder {
  margin-top: 12px;
  padding: 12px;
  border-radius: 14px;
  border: 1px dashed rgba(15, 23, 42, 0.25);
  color: rgba(15, 23, 42, 0.7);
  background: rgba(15, 23, 42, 0.02);
}

.status {
  margin: 10px 0 0;
  color: rgba(15, 23, 42, 0.7);
  font-weight: 700;
}

.error {
  margin: 10px 0 0;
  color: #b91c1c;
  font-weight: 800;
}

@media (max-width: 1080px) {
  .map-grid {
    grid-template-columns: 1fr;
  }
}

.enter {
  animation: enter 420ms ease both;
}

@keyframes enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
