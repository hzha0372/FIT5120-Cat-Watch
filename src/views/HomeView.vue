<template>
  <main class="home-shell">
    <header class="hero">
      <div>
        <h1 class="hero-title">Sun Safety Dashboard</h1>
        <p class="hero-subtitle">
          Click anywhere on the Melbourne map to see the UV level, what it means for your skin, and
          what to do next.
        </p>
      </div>
    </header>

    <section class="layout">
      <div class="main">
        <section class="card" aria-labelledby="uv-title">
          <div class="card-head">
            <h2 id="uv-title" class="card-title">1) Location-based UV levels (Melbourne)</h2>
            <p class="card-caption">Select a point on the map to load hourly UV from Open-Meteo.</p>
          </div>

          <div class="map-grid">
            <div class="map-col">
              <Map v-model="mapLocation" height="420px" aria-label="Melbourne UV map" />
              <div class="map-hint">
                Selected: {{ mapLocation.center.lng.toFixed(4) }}, {{ mapLocation.center.lat.toFixed(4) }}
              </div>
            </div>

            <div class="info-col">
              <div class="metric">
                <div class="metric-label">Selected location UV (peak today)</div>
                <div class="metric-value">{{ uvSummary ? uvSummary.peakUv : '—' }}</div>
                <div v-if="uvSummary" class="metric-sub">
                  Peak time: {{ uvSummary.peakTime }} | Hours UV ≥ 3: {{ uvSummary.hoursUv3Plus }}
                </div>
              </div>

              <div v-if="uvSummary" class="alert" :class="alertClass" role="alert" aria-live="polite">
                <div class="alert-title">{{ alertContent.title }}</div>
                <div class="alert-main">{{ alertContent.main }}</div>
                <div class="alert-detail">
                  Short-term: {{ alertContent.shortTerm }}
                </div>
                <div class="alert-detail">
                  Long-term: {{ alertContent.longTerm }}
                </div>
              </div>
              <div v-else class="placeholder">Click the map to load UV data.</div>

              <p v-if="loading" class="status">Loading hourly UV…</p>
              <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
            </div>
          </div>

          <div class="chart-area">
            <div class="chart-title">UV throughout the day (hourly)</div>
            <div ref="chart" class="chart-surface" aria-label="Hourly UV chart"></div>
          </div>
        </section>

        <section class="card" aria-labelledby="sunscreen-title">
          <div class="card-head">
            <h2 id="sunscreen-title" class="card-title">2) Sunscreen amount and type</h2>
            <p class="card-caption">
              Guidance updates based on the UV you selected. Apply 20 minutes before going outside.
            </p>
          </div>

          <div class="sunscreen-grid">
            <div class="sunscreen-box">
              <div class="sunscreen-label">Recommended type</div>
              <div class="sunscreen-value">SPF50 / SPF50+</div>
              <div class="sunscreen-detail">{{ sunscreenTypeReason }}</div>
            </div>

            <div class="sunscreen-box">
              <div class="sunscreen-label">Estimated amount (adult body)</div>
              <div class="sunscreen-value">{{ sunscreenGuide.amount }}</div>
              <div class="sunscreen-detail">Aim for full coverage on exposed skin. Reapply at least every 2 hours.</div>
            </div>

            <div class="sunscreen-box">
              <div class="sunscreen-label">Reapply sooner if</div>
              <div class="sunscreen-value">Sweating / swimming</div>
              <div class="sunscreen-detail">If you’re active or in water, reapply more frequently (and after towelling).</div>
            </div>
          </div>

          <div class="sunscreen-note">
            Current UV context: <strong>{{ uvSummary ? uvSummary.peakUv : '—' }}</strong>
            <span v-if="uvSummary">({{ riskLabel }})</span>
          </div>

          <!-- Sunscreen Reminder Panel -->
          <div class="reminder-panel" aria-label="Sunscreen reapply reminder">
            <div class="reminder-header">
              <div class="reminder-header-left">
                <div class="reminder-title">Reapply Reminder</div>
                <div class="reminder-desc">Select your activity to get a timed reminder.</div>
              </div>
              <button
                class="toggle-btn"
                :class="{ 'toggle-btn--on': reminderEnabled }"
                @click="toggleReminder"
                :aria-pressed="reminderEnabled"
                aria-label="Toggle reapply reminder"
              >
                {{ reminderEnabled ? 'ON' : 'OFF' }}
              </button>
            </div>

            <div class="activity-row">
              <label
                v-for="opt in activityOptions"
                :key="opt.value"
                class="activity-option"
                :class="{ 'activity-option--active': activity === opt.value }"
              >
                <input type="radio" v-model="activity" :value="opt.value" class="sr-only" />
                <span class="activity-icon">{{ opt.icon }}</span>
                <span class="activity-name">{{ opt.label }}</span>
              </label>
            </div>

            <div v-if="reminderEnabled" class="reminder-body">
              <div class="reminder-info-box">
                <div class="ri-interval">Every <strong>{{ reminderIntervalMinutes }} min</strong></div>
                <div class="ri-reason">{{ reminderReason }}</div>
              </div>
              <div class="reminder-countdown-box">
                <div class="countdown-label">Next reminder in</div>
                <div class="countdown-value" :class="{ 'countdown-value--urgent': reminderCountdown <= 60 }">
                  {{ countdownDisplay }}
                </div>
                <button class="reset-btn" @click="resetTimer">Reset</button>
              </div>
            </div>

            <div
              v-if="reminderFired"
              class="reminder-toast"
              role="alert"
              aria-live="assertive"
            >
              <span class="toast-bell">🔔</span>
              <div class="toast-content">
                <div class="toast-title">Time to reapply sunscreen!</div>
                <div class="toast-body">{{ reminderToastMessage }}</div>
              </div>
              <button class="toast-dismiss" @click="dismissReminder">Done</button>
            </div>
          </div>
        </section>
        <!-- Feature: Safe Outdoor Time Window -->
        <section class="card" aria-labelledby="safe-window-title">
          <div class="card-head">
            <h2 id="safe-window-title" class="card-title">5) Safe Outdoor Time Window</h2>
            <p class="card-caption">
              When is it safe to go outside today? Based on today's UV forecast for your selected location.
            </p>
          </div>

          <div v-if="!uvSummary" class="placeholder">
            Select a location on the map to see today's safe outdoor windows.
          </div>

          <div v-else>
            <div class="safe-timeline-wrap">
              <div class="safe-timeline">
                <div
                  v-for="seg in safeTimelineSegments"
                  :key="seg.hour"
                  class="safe-seg"
                  :class="`safe-seg--${seg.level}`"
                  :title="`${seg.label} — UV ${seg.uv}`"
                >
                  <div class="safe-seg-hour">{{ seg.hourLabel }}</div>
                </div>
              </div>
              <div class="safe-legend">
                <span class="safe-leg safe-leg--safe">🟢 Safe (UV &lt; 3)</span>
                <span class="safe-leg safe-leg--moderate">🟡 Moderate (3–5.9)</span>
                <span class="safe-leg safe-leg--high">🟠 High (6–7.9)</span>
                <span class="safe-leg safe-leg--veryhigh">🔴 Very High / Extreme (≥8)</span>
              </div>
            </div>

            <div class="safe-windows-summary">
              <div class="safe-window-item" v-if="safeWindowsBefore.length">
                <div class="sw-icon">☀️</div>
                <div>
                  <div class="sw-title">Best morning window</div>
                  <div class="sw-value">{{ safeWindowsBefore }}</div>
                </div>
              </div>
              <div class="safe-window-item safe-window-item--peak">
                <div class="sw-icon">⚠️</div>
                <div>
                  <div class="sw-title">Avoid outdoors (UV ≥ 3)</div>
                  <div class="sw-value">{{ safeWindowsPeak }}</div>
                </div>
              </div>
              <div class="safe-window-item" v-if="safeWindowsAfter.length">
                <div class="sw-icon">🌇</div>
                <div>
                  <div class="sw-title">Safe evening window</div>
                  <div class="sw-value">{{ safeWindowsAfter }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Feature: UV Burn Time Calculator -->
        <section class="card" aria-labelledby="burn-calc-title">
          <div class="card-head">
            <h2 id="burn-calc-title" class="card-title">6) UV Burn Time Calculator</h2>
            <p class="card-caption">
              Estimate how quickly your skin may burn based on your skin type, current UV level, and
              whether you are wearing sunscreen.
            </p>
          </div>

          <div class="burn-form">
            <div class="burn-field">
              <label class="burn-label">Skin type</label>
              <div class="burn-options">
                <button
                  v-for="s in burnSkinTypes"
                  :key="s.id"
                  class="burn-opt-btn"
                  :class="{ 'burn-opt-btn--active': burnSkin === s.id }"
                  @click="burnSkin = s.id"
                >
                  <span class="burn-dot" :style="{ background: s.color }"></span>
                  {{ s.label }}
                </button>
              </div>
            </div>

            <div class="burn-field">
              <label class="burn-label">Sunscreen applied?</label>
              <div class="burn-options">
                <button
                  v-for="sp in burnSpfOptions"
                  :key="sp.id"
                  class="burn-opt-btn"
                  :class="{ 'burn-opt-btn--active': burnSpf === sp.id }"
                  @click="burnSpf = sp.id"
                >{{ sp.label }}</button>
              </div>
            </div>

            <div class="burn-field">
              <label class="burn-label">
                UV Index to calculate against
                <span class="burn-uv-hint">{{ burnUvInput }} ({{ burnUvLabel }})</span>
              </label>
              <input
                type="range"
                v-model.number="burnUvInput"
                min="1" max="14" step="0.5"
                class="burn-slider"
                :aria-valuenow="burnUvInput"
                aria-label="UV index slider"
              />
              <div class="burn-slider-labels">
                <span>1</span><span>3</span><span>6</span><span>8</span><span>11</span><span>14</span>
              </div>
              <button
                v-if="uvSummary"
                class="burn-use-current"
                @click="burnUvInput = uvSummary.peakUvNumber"
              >
                Use selected location peak UV ({{ uvSummary.peakUv }})
              </button>
            </div>
          </div>

          <transition name="burn-result-fade">
            <div v-if="burnResult" class="burn-result" :class="`burn-result--${burnResult.level}`">
              <div class="burn-result-left">
                <div class="burn-result-label">Estimated time to burn</div>
                <div class="burn-result-value">{{ burnResult.timeStr }}</div>
                <div class="burn-result-sub">{{ burnResult.advice }}</div>
              </div>
              <div class="burn-result-right">
                <div class="burn-dose-label">UV exposure rate</div>
                <div class="burn-dose-value">{{ burnResult.doseLabel }}</div>
              </div>
            </div>
          </transition>

          <div v-if="!burnResult" class="placeholder" style="margin-top:12px">
            Select options above to see your estimated burn time.
          </div>
        </section>

        <section class="card" aria-labelledby="clothing-uv-title">
          <div class="card-head">
            <h2 id="clothing-uv-title" class="card-title">3) Clothing Recommendations by UV Level</h2>
            <p class="card-caption">
              Use this quick guide to plan what to wear. The recommended row highlights based on the
              selected peak UV.
            </p>
          </div>

          <div class="uv-table" role="table" aria-label="Clothing recommendations by UV level">
            <div class="uv-table__header" role="row">
              <span role="columnheader">UV Level</span>
              <span role="columnheader">Clothing Recommendations</span>
            </div>
            <div
              v-for="row in clothingByUvLevel"
              :key="row.label"
              class="uv-table__row"
              role="row"
              :class="[`uv-table__row--${row.colorKey}`, { 'uv-table__row--active': row.isActive }]"
            >
              <span role="cell" class="uv-table__label">{{ row.label }}</span>
              <span role="cell" class="uv-table__text">{{ row.advice }}</span>
            </div>
          </div>
        </section>
      </div>

      <aside class="side" aria-label="Myth versus fact">
        <section class="card sticky" aria-labelledby="myth-title">
          <div class="card-head">
            <h2 id="myth-title" class="card-title">4) Myth vs Fact</h2>
            <p class="card-caption">Tap a myth to see the fact and what to do instead.</p>
          </div>

          <div class="qa">
            <details class="qa-item" open>
              <summary class="qa-q">Myth: “I only need sunscreen at the beach.”</summary>
              <div class="qa-a">
                <p>
                  <strong>Fact:</strong> UV can be high on everyday errands, outdoor sports, and even on cooler or
                  cloudy days. If UV is 3 or above, sun protection is recommended.
                </p>
                <p>
                  <strong>Do this:</strong> Check UV before you head out, apply sunscreen to exposed skin, and plan
                  shade breaks around midday.
                </p>
              </div>
            </details>

            <details class="qa-item">
              <summary class="qa-q">Myth: “Only fair-skinned people need protection.”</summary>
              <div class="qa-a">
                <p>
                  <strong>Fact:</strong> All skin tones can experience UV damage. Darker skin may burn less often,
                  but UV can still cause long-term damage and skin cancer.
                </p>
                <p>
                  <strong>Do this:</strong> Use sunscreen, protective clothing, and shade when UV is 3 or above—no
                  matter your skin tone.
                </p>
              </div>
            </details>

            <details class="qa-item">
              <summary class="qa-q">Myth: “Sunscreen prevents Vitamin D.”</summary>
              <div class="qa-a">
                <p>
                  <strong>Fact:</strong> You can still maintain Vitamin D while protecting your skin. If you’re
                  concerned, talk to a health professional rather than skipping protection during high UV.
                </p>
                <p>
                  <strong>Do this:</strong> Keep sun protection habits and use diet/supplements if recommended.
                </p>
              </div>
            </details>
          </div>

          <div class="sources" aria-label="Sources">
            <div class="sources-title">Sources</div>
            <a class="source-link" href="https://www.cancervic.org.au/get-support/stories/7-myths-about-sun-protection.html" target="_blank" rel="noreferrer">Cancer Council Victoria: Sun protection myths</a>
            <a class="source-link" href="https://www.mdanderson.org/cancerwise/sunscreen-myths-debunked.h00-159697545.html" target="_blank" rel="noreferrer">MD Anderson: Sunscreen myths debunked</a>
            <a class="source-link" href="https://www.youtube.com/watch?v=Uo4X12y5yAk" target="_blank" rel="noreferrer">Video: Sunscreen myths</a>
            <a class="source-link" href="https://www.youtube.com/watch?v=So27AO7JCEA" target="_blank" rel="noreferrer">Video: UV & sun safety</a>
          </div>

          <div class="live-box">
            <div class="live-title">
              <span>Melanoma Impact Data</span>
              <span v-if="impactFeed.loading" class="live-loading">Loading…</span>
              <span v-else-if="impactFeed.error" class="live-error-badge">Error</span>
            </div>

            <div v-if="impactFeed.error" class="live-error">{{ impactFeed.error }}</div>

            <template v-else-if="!impactFeed.loading && impactFeed.latestActualYear">
              <div class="live-stats-grid">
                <div class="live-stat live-stat--primary">
                  <div class="live-stat-value">{{ impactFeed.latestActualTotal.toLocaleString() }}</div>
                  <div class="live-stat-label">New cases ({{ impactFeed.latestActualYear }})</div>
                </div>
                <div class="live-stat">
                  <div class="live-stat-value">~{{ impactFeed.dailyEstimate }}</div>
                  <div class="live-stat-label">Diagnosed per day (est.)</div>
                </div>
                <div class="live-stat" v-if="impactFeed.fiveYearChangePct !== null">
                  <div class="live-stat-value" :class="impactFeed.fiveYearChangePct > 0 ? 'live-stat--up' : 'live-stat--down'">
                    {{ impactFeed.fiveYearChangePct > 0 ? '+' : '' }}{{ impactFeed.fiveYearChangePct }}%
                  </div>
                  <div class="live-stat-label">5-year trend</div>
                </div>
                <div class="live-stat" v-if="impactFeed.projTotal">
                  <div class="live-stat-value">{{ impactFeed.projTotal.toLocaleString() }}</div>
                  <div class="live-stat-label">Projected ({{ impactFeed.projYear }})</div>
                </div>
              </div>

              <div class="live-uv-row" v-if="impactFeed.uvLoaded">
                <div class="live-uv-item">
                  <div class="live-uv-city">Melbourne 2024</div>
                  <div class="live-uv-bar-wrap">
                    <div class="live-uv-bar" :style="{ width: impactFeed.melbDangerPct + '%' }"></div>
                  </div>
                  <div class="live-uv-pct">{{ impactFeed.melbDangerPct }}% danger days</div>
                </div>
                <div class="live-uv-item">
                  <div class="live-uv-city">Sydney 2024</div>
                  <div class="live-uv-bar-wrap">
                    <div class="live-uv-bar live-uv-bar--syd" :style="{ width: impactFeed.sydDangerPct + '%' }"></div>
                  </div>
                  <div class="live-uv-pct">{{ impactFeed.sydDangerPct }}% danger days</div>
                </div>
              </div>

              <div class="live-source">
                Source: {{ impactFeed.source }} · BoM UV Monitoring 2024
              </div>
            </template>

            <div v-else-if="impactFeed.loading" class="live-placeholder">
              Loading dataset…
            </div>
          </div>
        </section>
      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as d3 from 'd3'
import Map from '@/components/Map.vue'

const loading = ref(false)
const errorMessage = ref('')

const mapLocation = ref({ center: { lng: 144.9631, lat: -37.8136 }, zoom: 11 })

// ── Sunscreen Reminder ────────────────────────────────────────────────────────
const activityOptions = [
  { value: 'normal', icon: '🚶', label: 'Normal / Dry' },
  { value: 'sports', icon: '🏃', label: 'Sports / Sweating' },
  { value: 'water',  icon: '🏊', label: 'Beach / Water' },
]

const activity = ref('normal')
const reminderEnabled = ref(false)
const reminderCountdown = ref(0)
const reminderFired = ref(false)
let _reminderInterval = null

const reminderIntervalMinutes = computed(() => {
  if (activity.value === 'water') return 40
  if (activity.value === 'sports') return 60
  return 120
})

const reminderReason = computed(() => {
  if (activity.value === 'water')
    return 'Water and towelling remove sunscreen quickly — reapply every 40 min.'
  if (activity.value === 'sports')
    return 'Sweating reduces sunscreen effectiveness — reapply every 60 min.'
  return 'Standard recommendation: reapply every 2 hours.'
})

const countdownDisplay = computed(() => {
  const m = Math.floor(reminderCountdown.value / 60)
  const s = reminderCountdown.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const reminderToastMessage = computed(() => {
  if (activity.value === 'water')
    return 'After swimming or towelling off, reapply SPF50+ sunscreen to all exposed skin now.'
  if (activity.value === 'sports')
    return "You've been active and sweating. Apply a fresh coat of SPF50 sunscreen now."
  return "It's been 2 hours. Reapply SPF50 sunscreen to all exposed skin."
})

const clearReminderTimer = () => {
  if (_reminderInterval) {
    clearInterval(_reminderInterval)
    _reminderInterval = null
  }
}

const startTimer = () => {
  clearReminderTimer()
  reminderFired.value = false
  reminderCountdown.value = reminderIntervalMinutes.value * 60
  _reminderInterval = setInterval(() => {
    if (reminderCountdown.value > 0) {
      reminderCountdown.value--
    } else {
      clearReminderTimer()
      reminderFired.value = true
    }
  }, 1000)
}

const toggleReminder = () => {
  reminderEnabled.value = !reminderEnabled.value
  if (reminderEnabled.value) {
    startTimer()
  } else {
    clearReminderTimer()
    reminderFired.value = false
  }
}

const resetTimer = () => {
  reminderFired.value = false
  startTimer()
}

const dismissReminder = () => {
  reminderFired.value = false
  startTimer()
}

watch(activity, () => {
  if (reminderEnabled.value) startTimer()
})
// ─────────────────────────────────────────────────────────────────────────────

const hourly = ref([])
const chart = ref(null)
let resizeHandler = null

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
    drawChart()
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

const sunscreenGuide = computed(() => {
  const uv = uvSummary.value?.peakUvNumber
  if (!Number.isFinite(uv)) return { amount: 'Use the map to load UV first' }

  if (uv < 3) {
    return { amount: 'Optional (extended outdoor time)' }
  }
  if (uv < 6) {
    return { amount: '7 teaspoons (full body) or 2 finger-lengths per arm' }
  }
  if (uv < 8) {
    return { amount: '7 teaspoons + prioritise reapplication every 2 hours' }
  }
  return { amount: '7 teaspoons + reapply more often (sweat/water/peak UV)' }
})

const sunscreenTypeReason = computed(() => {
  const uv = uvSummary.value?.peakUvNumber
  if (!Number.isFinite(uv)) {
    return 'SPF50 blocks about 98% of UVB radiation. Load UV data to tailor the recommendation.'
  }
  if (uv < 3) {
    return 'Low UV: SPF50 still blocks about 98% of UVB, giving strong coverage for extended time outside.'
  }
  if (uv < 6) {
    return 'Moderate UV: SPF50 blocks about 98% of UVB, helping reduce daily exposure during longer outings.'
  }
  if (uv < 8) {
    return 'High UV: SPF50 blocks about 98% of UVB. Choose water-resistant formulas for sweat or activity.'
  }
  if (uv < 11) {
    return 'Very High UV: SPF50+ gives maximal UVB filtering (about 98%+). Reapply often, especially in heat.'
  }
  return 'Extreme UV: SPF50+ offers the strongest UVB filtering (about 98%+). Pair with shade and water resistance.'
})

const clothingByUvLevel = computed(() => {
  const uv = uvSummary.value?.peakUvNumber ?? null
  const buildRow = (label, advice, colorKey, isActive) => ({ label, advice, colorKey, isActive })

  return [
    buildRow('Low (0.0-2.9)',      'Normal clothing is fine. Keep sunglasses and a hat ready for midday.',                         'low',      uv !== null && uv < 3.0),
    buildRow('Moderate (3.0-5.9)', 'Long sleeves or light UPF layers, plus a broad-brim hat and sunglasses.',                     'moderate', uv !== null && uv >= 3.0 && uv <= 5.9),
    buildRow('High (6.0-7.9)',     'Tightly woven long sleeves and long pants with a broad-brim hat.',                            'high',     uv !== null && uv >= 6.0 && uv <= 7.9),
    buildRow('Very High (8.0-10.9)','UPF long sleeves or rash vest, long pants, and minimize time outdoors.',                     'veryhigh', uv !== null && uv >= 8.0 && uv <= 10.9),
    buildRow('Extreme (11.0+)',    'Full coverage UPF clothing, wide-brim hat, and avoid direct sun at peak hours.',               'extreme',  uv !== null && uv >= 11.0),
  ]
})
// ── Live Impact Feed ─────────────────────────────────────────────────────────
const impactFeed = ref({
  loading: true,
  error: null,
  latestActualYear: null,
  latestActualTotal: null,
  dailyEstimate: null,
  fiveYearChangePct: null,
  projYear: null,
  projTotal: null,
  source: '',
  uvLoaded: false,
  melbDangerPct: null,
  sydDangerPct: null,
})

const loadImpactData = async () => {
  try {
    const [melanoma, uv] = await Promise.all([
      fetch('/data/melanoma_stats.json').then(r => r.json()),
      fetch('/data/uv_stats.json').then(r => r.json()),
    ])
    impactFeed.value = {
      loading: false,
      error: null,
      latestActualYear: melanoma.latestActualYear,
      latestActualTotal: melanoma.latestActualTotal,
      dailyEstimate: melanoma.dailyEstimate,
      fiveYearChangePct: melanoma.fiveYearChangePct,
      projYear: melanoma.latestProjectionYear,
      projTotal: melanoma.latestProjectionTotal,
      source: melanoma.source,
      uvLoaded: true,
      melbDangerPct: uv.melbourne.dangerDaysPct,
      sydDangerPct: uv.sydney.dangerDaysPct,
    }
  } catch (e) {
    impactFeed.value = {
      ...impactFeed.value,
      loading: false,
      error: 'Failed to load dataset.',
    }
  }
}

loadImpactData()
// ─────────────────────────────────────────────────────────────────────────────

const clearChart = () => {
  if (!chart.value) return
  d3.select(chart.value).selectAll('*').remove()
}

const drawChart = () => {
  clearChart()
  if (!chart.value || !hourly.value.length) return

  const container = chart.value
  const rect = container.getBoundingClientRect()
  const width = Math.max(320, Math.floor(rect.width))
  const height = 280

  const margin = { top: 18, right: 20, bottom: 42, left: 46 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const data = [...hourly.value].sort((a, b) => a.time.getTime() - b.time.getTime())
  const maxUv = d3.max(data, (d) => d.uv) || 0

  const x = d3.scaleTime().domain(d3.extent(data, (d) => d.time)).range([0, innerW])
  const y = d3
    .scaleLinear()
    .domain([0, Math.max(1, Math.ceil(maxUv))])
    .nice()
    .range([innerH, 0])

  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height)
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  const riskBands = [
    { from: 0, to: 2.9, color: 'rgba(34,197,94,0.10)' },
    { from: 3.0, to: 5.9, color: 'rgba(234,179,8,0.12)' },
    { from: 6.0, to: 7.9, color: 'rgba(249,115,22,0.12)' },
    { from: 8.0, to: Math.max(12, maxUv), color: 'rgba(239,68,68,0.10)' },
  ]

  g.selectAll('rect.risk')
    .data(riskBands)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('width', innerW)
    .attr('y', (d) => y(d.to))
    .attr('height', (d) => Math.max(0, y(d.from) - y(d.to)))
    .attr('fill', (d) => d.color)

  const line = d3
    .line()
    .x((d) => x(d.time))
    .y((d) => y(d.uv))
    .curve(d3.curveMonotoneX)

  g.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#0ea5e9')
    .attr('stroke-width', 3)
    .attr('d', line)

  const tip = d3
    .select(container)
    .append('div')
    .style('position', 'absolute')
    .style('padding', '6px 8px')
    .style('background', 'rgba(15,23,42,.90)')
    .style('color', '#fff')
    .style('font-size', '12px')
    .style('border-radius', '8px')
    .style('pointer-events', 'none')
    .style('opacity', 0)

  g.selectAll('circle.point')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d) => x(d.time))
    .attr('cy', (d) => y(d.uv))
    .attr('r', 3)
    .attr('fill', '#0369a1')
    .on('mousemove', (e, d) => {
      const timeLabel = d.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      tip
        .style('opacity', 1)
        .html(`<b>${timeLabel}</b><br/>UV: ${d.uv.toFixed(1)}`)
        .style('left', e.offsetX + 14 + 'px')
        .style('top', e.offsetY - 10 + 'px')
    })
    .on('mouseleave', () => tip.style('opacity', 0))

  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(8).tickFormat(d3.timeFormat('%H:%M')))

  g.append('g').call(d3.axisLeft(y).ticks(6))
}

watch(
  () => ({ lng: mapLocation.value.center.lng, lat: mapLocation.value.center.lat }),
  async ({ lng, lat }) => {
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) return
    await fetchHourlyUv(lat, lng)
  },
  { deep: true, immediate: true },
)

resizeHandler = () => drawChart()
window.addEventListener('resize', resizeHandler)

// ── Feature: Safe Outdoor Time Window ────────────────────────────────────────
const safeTimelineSegments = computed(() => {
  if (!hourly.value.length) return []
  const sorted = [...hourly.value].sort((a, b) => a.time.getTime() - b.time.getTime())
  // One segment per hour (pick max UV in that hour)
  const byHour = {}
  for (const d of sorted) {
    const h = d.time.getHours()
    if (!byHour[h] || d.uv > byHour[h]) byHour[h] = d.uv
  }
  return Object.entries(byHour).map(([h, uv]) => {
    const hour = Number(h)
    let level = 'safe'
    if (uv >= 8) level = 'veryhigh'
    else if (uv >= 6) level = 'high'
    else if (uv >= 3) level = 'moderate'
    return {
      hour,
      uv: uv.toFixed(1),
      level,
      hourLabel: `${String(hour).padStart(2, '0')}:00`,
      label: `${String(hour).padStart(2, '0')}:00`,
    }
  })
})

const safeWindowsBefore = computed(() => {
  const segs = safeTimelineSegments.value
  const safe = segs.filter(s => s.level === 'safe' && s.hour < 12)
  if (!safe.length) return ''
  const first = safe[0].hourLabel
  const last = safe[safe.length - 1].hourLabel
  return first === last ? first : `${first} – ${last}`
})

const safeWindowsAfter = computed(() => {
  const segs = safeTimelineSegments.value
  const safe = segs.filter(s => s.level === 'safe' && s.hour >= 12)
  if (!safe.length) return ''
  const first = safe[0].hourLabel
  const last = safe[safe.length - 1].hourLabel
  return first === last ? first : `${first} – ${last}`
})

const safeWindowsPeak = computed(() => {
  const segs = safeTimelineSegments.value
  const risky = segs.filter(s => s.level !== 'safe')
  if (!risky.length) return 'No high-UV period today'
  const first = risky[0].hourLabel
  const last = risky[risky.length - 1].hourLabel
  return `${first} – ${last}`
})

// ── Feature: UV Burn Time Calculator ─────────────────────────────────────────
const burnSkinTypes = [
  { id: 1, label: 'Type I (Very Fair)', color: '#FDDAC4', mppd: 200 },
  { id: 2, label: 'Type II (Fair)',     color: '#F5C5A3', mppd: 250 },
  { id: 3, label: 'Type III (Medium)',  color: '#E8A882', mppd: 350 },
  { id: 4, label: 'Type IV (Olive)',    color: '#C68642', mppd: 450 },
  { id: 5, label: 'Type V (Brown)',     color: '#8D5524', mppd: 600 },
  { id: 6, label: 'Type VI (Dark)',     color: '#4A2912', mppd: 1000 },
]

const burnSpfOptions = [
  { id: 'none',  label: 'No sunscreen', multiplier: 1 },
  { id: 'spf15', label: 'SPF 15',       multiplier: 15 },
  { id: 'spf30', label: 'SPF 30',       multiplier: 30 },
  { id: 'spf50', label: 'SPF 50+',      multiplier: 50 },
]

const burnSkin = ref(2)
const burnSpf  = ref('none')
const burnUvInput = ref(6)

const burnUvLabel = computed(() => {
  const uv = burnUvInput.value
  if (uv < 3)  return 'Low'
  if (uv < 6)  return 'Moderate'
  if (uv < 8)  return 'High'
  if (uv < 11) return 'Very High'
  return 'Extreme'
})

const burnResult = computed(() => {
  const uv = burnUvInput.value
  if (!uv || uv <= 0) return null
  const skinType = burnSkinTypes.find(s => s.id === burnSkin.value)
  const spfOpt = burnSpfOptions.find(s => s.id === burnSpf.value)
  if (!skinType || !spfOpt) return null

  // MED (Minimal Erythemal Dose) in J/m²; UV index 1 ≈ 25 mW/m²
  // Time to burn (minutes) = MED / (UV_index × 25 mW/m² × 60) × SPF
  const uvIrr = uv * 25 // mW/m²
  const baseMinutes = (skinType.mppd / (uvIrr * 0.060)) * spfOpt.multiplier
  const mins = Math.round(baseMinutes)

  let timeStr, level, advice
  if (mins < 10) {
    timeStr = `< 10 minutes`
    level = 'danger'
    advice = 'Extremely rapid burn risk. Stay indoors or in full shade.'
  } else if (mins < 30) {
    timeStr = `~${mins} minutes`
    level = 'high'
    advice = 'Seek shade, limit exposure, and reapply sunscreen every 40–60 min.'
  } else if (mins < 90) {
    timeStr = `~${mins} minutes`
    level = 'moderate'
    advice = 'Apply sunscreen and take shade breaks regularly.'
  } else {
    const hrs = (mins / 60).toFixed(1)
    timeStr = `~${hrs} hours`
    level = 'low'
    advice = 'Relatively protected. Still apply SPF and reapply every 2 hours.'
  }

  const dosePerHour = (uv * 25 * 60) / 1000
  return {
    timeStr,
    level,
    advice,
    doseLabel: `${dosePerHour.toFixed(1)} J/m² per hour`,
  }
})
// ─────────────────────────────────────────────────────────────────────────────

onBeforeUnmount(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  clearReminderTimer()
})
</script>

<style scoped>
.home-shell {
  max-width: 1220px;
  margin: 0 auto;
  padding: 22px;
  display: grid;
  gap: 16px;
}

.hero {
  border-radius: 18px;
  padding: 18px 20px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.16), rgba(34, 197, 94, 0.08));
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

.layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 16px;
  align-items: start;
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
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #0f172a;
  position: relative;
  padding-left: 12px;
}

.card-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.2em;
  width: 4px;
  height: 1.1em;
  border-radius: 999px;
  background: linear-gradient(180deg, #60a5fa, #a78bfa);
}

.card-caption {
  margin: 6px 0 0;
  color: rgba(15, 23, 42, 0.65);
}

.map-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
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
  background: #eaf6ff;
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

.alert {
  margin-top: 12px;
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, 0.1);
}

.alert-title {
  font-weight: 900;
  font-size: 1rem;
}

.alert-main {
  margin-top: 4px;
  font-weight: 700;
}

.alert-detail {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.8);
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

.chart-area {
  margin-top: 14px;
  position: relative;
}

.chart-title {
  font-weight: 900;
  margin-bottom: 6px;
}

.chart-surface {
  width: 100%;
  position: relative;
}

.sunscreen-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.sunscreen-box {
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.6), rgba(226, 255, 248, 0.6));
}

.sunscreen-label {
  color: rgba(15, 23, 42, 0.6);
  font-weight: 800;
  font-size: 0.9rem;
}

.sunscreen-value {
  font-weight: 900;
  font-size: 1.2rem;
  margin-top: 4px;
}

.sunscreen-detail {
  margin-top: 6px;
  color: rgba(15, 23, 42, 0.75);
}

.sunscreen-note {
  margin-top: 12px;
  color: rgba(15, 23, 42, 0.75);
}

/* ── Sunscreen Reminder ──────────────────────────────────────────────── */
.reminder-panel {
  margin-top: 16px;
  border-radius: 14px;
  border: 1px solid rgba(14, 165, 233, 0.22);
  background: rgba(14, 165, 233, 0.05);
  padding: 14px;
  display: grid;
  gap: 12px;
}

.reminder-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.reminder-title {
  font-weight: 900;
  font-size: 1rem;
}

.reminder-desc {
  color: rgba(15, 23, 42, 0.65);
  font-size: 0.88rem;
  margin-top: 2px;
}

.toggle-btn {
  flex-shrink: 0;
  border: none;
  border-radius: 999px;
  padding: 6px 18px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.12);
  color: rgba(15, 23, 42, 0.6);
  transition: background 0.2s, color 0.2s;
}

.toggle-btn--on {
  background: #0ea5e9;
  color: #ffffff;
}

.activity-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.activity-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 10px;
  border: 1.5px solid rgba(15, 23, 42, 0.14);
  background: rgba(239, 246, 255, 0.9);
  cursor: pointer;
  font-weight: 700;
  transition: border-color 0.15s, background 0.15s;
  user-select: none;
}

.activity-option--active {
  border-color: #0ea5e9;
  background: rgba(14, 165, 233, 0.1);
  color: #0369a1;
}

.activity-icon {
  font-size: 1.1rem;
  line-height: 1;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.reminder-body {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
}

.reminder-info-box {
  border-radius: 10px;
  padding: 10px 12px;
  background: rgba(239, 246, 255, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.1);
}

.ri-interval {
  font-size: 0.95rem;
  color: rgba(15, 23, 42, 0.85);
}

.ri-reason {
  margin-top: 4px;
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.65);
}

.reminder-countdown-box {
  text-align: center;
  padding: 10px 16px;
  background: rgba(239, 246, 255, 0.9);
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.1);
}

.countdown-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.6);
  margin-bottom: 2px;
}

.countdown-value {
  font-size: 1.75rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  color: #0369a1;
  font-variant-numeric: tabular-nums;
}

.countdown-value--urgent {
  color: #dc2626;
}

.reset-btn {
  margin-top: 6px;
  border: none;
  border-radius: 8px;
  padding: 4px 12px;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.08);
  color: rgba(15, 23, 42, 0.75);
}

.reset-btn:hover {
  background: rgba(15, 23, 42, 0.14);
}

.reminder-toast {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  padding: 12px 14px;
  background: #fef9c3;
  border: 1.5px solid #f59e0b;
}

.toast-bell {
  font-size: 1.4rem;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 900;
  color: #92400e;
}

.toast-body {
  margin-top: 3px;
  font-size: 0.9rem;
  color: rgba(120, 53, 15, 0.9);
}

.toast-dismiss {
  flex-shrink: 0;
  border: none;
  border-radius: 8px;
  padding: 6px 14px;
  font-weight: 800;
  cursor: pointer;
  background: #f59e0b;
  color: #fff;
}

.toast-dismiss:hover {
  background: #d97706;
}
/* ─────────────────────────────────────────────────────────────────────── */

.uv-table {
  margin-top: 12px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  overflow: hidden;
  background: rgba(248, 250, 255, 0.95);
}

.uv-table__header,
.uv-table__row {
  display: grid;
  grid-template-columns: minmax(160px, 210px) 1fr;
  gap: 12px;
  padding: 10px 12px;
  align-items: start;
}

.uv-table__header {
  background: rgba(219, 234, 254, 0.45);
  font-weight: 800;
  color: rgba(15, 23, 42, 0.85);
  border-bottom: 1px solid rgba(15, 23, 42, 0.12);
}

.uv-table__row {
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  color: rgba(15, 23, 42, 0.85);
}

.uv-table__row:last-child {
  border-bottom: none;
}

/* Per-level fixed colours */
.uv-table__row--low      { background: rgba(34,  197, 94,  0.10); }
.uv-table__row--moderate { background: rgba(234, 179, 8,   0.15); }
.uv-table__row--high     { background: rgba(249, 115, 22,  0.13); }
.uv-table__row--veryhigh { background: rgba(239, 68,  68,  0.11); }
.uv-table__row--extreme  { background: rgba(139, 0,   0,   0.10); }

/* Active row: stronger colour + left accent bar */
.uv-table__row--active.uv-table__row--low      { background: rgba(34,  197, 94,  0.28); box-shadow: inset 4px 0 0 #22c55e; font-weight: 700; color: #14532d; }
.uv-table__row--active.uv-table__row--moderate { background: rgba(234, 179, 8,   0.30); box-shadow: inset 4px 0 0 #f59e0b; font-weight: 700; color: #4b2c00; }
.uv-table__row--active.uv-table__row--high     { background: rgba(249, 115, 22,  0.28); box-shadow: inset 4px 0 0 #f97316; font-weight: 700; color: #431407; }
.uv-table__row--active.uv-table__row--veryhigh { background: rgba(239, 68,  68,  0.25); box-shadow: inset 4px 0 0 #ef4444; font-weight: 700; color: #450a0a; }
.uv-table__row--active.uv-table__row--extreme  { background: rgba(139, 0,   0,   0.22); box-shadow: inset 4px 0 0 #7f1d1d; font-weight: 700; color: #3b0000; }

.uv-table__label {
  font-weight: 700;
  color: inherit;
}

.sticky {
  position: sticky;
  top: 16px;
}

.qa {
  display: grid;
  gap: 10px;
}

.qa-item {
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  background: #eaf6ff;
  padding: 10px 12px;
}

.qa-q {
  cursor: pointer;
  font-weight: 900;
}

.qa-a {
  margin-top: 8px;
  color: rgba(15, 23, 42, 0.85);
}

.sources {
  margin-top: 14px;
  display: grid;
  gap: 6px;
}

.sources-title {
  font-weight: 900;
  margin-bottom: 2px;
}

.source-link {
  color: #0369a1;
  text-decoration: none;
  font-weight: 700;
}

.source-link:hover {
  text-decoration: underline;
}

.live-box {
  margin-top: 14px;
  border-radius: 14px;
  border: 1px solid rgba(14, 165, 233, 0.18);
  padding: 14px;
  background: rgba(14, 165, 233, 0.05);
}

.live-title {
  font-weight: 900;
  font-size: 0.95rem;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.live-loading {
  font-size: 0.78rem;
  font-weight: 700;
  color: #0369a1;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 6px;
  padding: 2px 8px;
}

.live-error-badge {
  font-size: 0.78rem;
  font-weight: 700;
  color: #b91c1c;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  padding: 2px 8px;
}

.live-error {
  font-size: 0.85rem;
  color: #b91c1c;
}

.live-stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.live-stat {
  border-radius: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(15, 23, 42, 0.07);
}

.live-stat--primary {
  background: rgba(14, 165, 233, 0.1);
  border-color: rgba(14, 165, 233, 0.2);
}

.live-stat-value {
  font-size: 1.15rem;
  font-weight: 900;
  line-height: 1.2;
}

.live-stat--up   { color: #b91c1c; }
.live-stat--down { color: #15803d; }

.live-stat-label {
  font-size: 0.74rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.55);
  margin-top: 2px;
}

.live-uv-row {
  display: grid;
  gap: 7px;
  margin-bottom: 8px;
}

.live-uv-item {
  display: grid;
  gap: 3px;
}

.live-uv-city {
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.65);
}

.live-uv-bar-wrap {
  height: 8px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.live-uv-bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #22c55e, #f59e0b, #ef4444);
  transition: width 0.8s ease;
}

.live-uv-bar--syd {
  background: linear-gradient(90deg, #22c55e, #f97316, #dc2626);
}

.live-uv-pct {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.5);
}

.live-source {
  font-size: 0.72rem;
  color: rgba(15, 23, 42, 0.45);
  border-top: 1px solid rgba(15, 23, 42, 0.08);
  padding-top: 7px;
  margin-top: 4px;
  line-height: 1.4;
}

.live-placeholder {
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.5);
  text-align: center;
  padding: 10px 0;
}

/* ── Safe Outdoor Time Window ───────────────────────────────────────── */
.safe-timeline-wrap {
  margin-bottom: 16px;
}

.safe-timeline {
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  height: 52px;
  border: 1px solid rgba(15, 23, 42, 0.1);
}

.safe-seg {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  transition: filter 0.15s;
  cursor: default;
}

.safe-seg:hover {
  filter: brightness(0.88);
}

.safe-seg--safe     { background: rgba(34, 197, 94, 0.30); }
.safe-seg--moderate { background: rgba(234, 179, 8, 0.40); }
.safe-seg--high     { background: rgba(249, 115, 22, 0.50); }
.safe-seg--veryhigh { background: rgba(239, 68, 68, 0.55); }

.safe-seg-hour {
  font-size: 0.65rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.65);
  white-space: nowrap;
}

.safe-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.7);
}

.safe-windows-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.safe-window-item {
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.safe-window-item--peak {
  background: rgba(239, 68, 68, 0.07);
  border-color: rgba(239, 68, 68, 0.2);
}

.sw-icon { font-size: 1.2rem; line-height: 1; flex-shrink: 0; }

.sw-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.6);
}

.sw-value {
  font-weight: 900;
  font-size: 0.95rem;
  margin-top: 2px;
}

/* ── UV Burn Time Calculator ─────────────────────────────────────────── */
.burn-form {
  display: grid;
  gap: 16px;
}

.burn-field {
  display: grid;
  gap: 8px;
}

.burn-label {
  font-weight: 800;
  font-size: 0.92rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.burn-uv-hint {
  font-weight: 700;
  color: #0369a1;
  font-size: 0.88rem;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 6px;
  padding: 2px 8px;
}

.burn-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.burn-opt-btn {
  border: 1.5px solid rgba(15, 23, 42, 0.14);
  border-radius: 10px;
  padding: 6px 12px;
  background: #fff;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.86rem;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: border-color 0.15s, background 0.15s;
}

.burn-opt-btn--active {
  border-color: #0ea5e9;
  background: rgba(14, 165, 233, 0.1);
  color: #0369a1;
}

.burn-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid rgba(0,0,0,0.15);
  flex-shrink: 0;
}

.burn-slider {
  width: 100%;
  accent-color: #0ea5e9;
  cursor: pointer;
}

.burn-slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  color: rgba(15, 23, 42, 0.5);
  margin-top: -2px;
}

.burn-use-current {
  border: none;
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  background: rgba(14, 165, 233, 0.12);
  color: #0369a1;
  width: fit-content;
}

.burn-result {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 14px;
  align-items: center;
  border-radius: 14px;
  padding: 14px 16px;
  margin-top: 14px;
  border: 1px solid transparent;
}

.burn-result--low      { background: rgba(34, 197, 94, 0.1);  border-color: rgba(34, 197, 94, 0.25); }
.burn-result--moderate { background: rgba(234, 179, 8, 0.12); border-color: rgba(234, 179, 8, 0.3); }
.burn-result--high     { background: rgba(249, 115, 22, 0.12); border-color: rgba(249, 115, 22, 0.3); }
.burn-result--danger   { background: rgba(239, 68, 68, 0.1);  border-color: rgba(239, 68, 68, 0.3); }

.burn-result-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.6);
}

.burn-result-value {
  font-size: 1.6rem;
  font-weight: 900;
  margin-top: 2px;
}

.burn-result-sub {
  margin-top: 6px;
  font-size: 0.88rem;
  color: rgba(15, 23, 42, 0.75);
}

.burn-dose-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.55);
}

.burn-dose-value {
  font-size: 1rem;
  font-weight: 900;
  margin-top: 2px;
}

.burn-result-fade-enter-active,
.burn-result-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.burn-result-fade-enter-from,
.burn-result-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* ─────────────────────────────────────────────────────────────────────── */

@media (max-width: 1080px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sticky {
    position: static;
  }
  .map-grid {
    grid-template-columns: 1fr;
  }
  .sunscreen-grid {
    grid-template-columns: 1fr;
  }
  .safe-windows-summary {
    grid-template-columns: 1fr;
  }
}
</style>
