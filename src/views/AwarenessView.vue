<template>
  <main class="awareness-main">
    <header class="awareness-hero">
      <div>
        <h1 class="awareness-title">UV Awareness</h1>
        <p class="awareness-subtitle">
          See how UV changes across the day (often peaking around midday) so you can plan outdoor time
          safely.
        </p>
      </div>
    </header>

    <section class="awareness-card" aria-labelledby="uv-daily-title">
      <div class="card-head">
        <h2 id="uv-daily-title" class="card-title">UV throughout the day (Hourly)</h2>
        <p class="card-caption">
          Data source: Open-Meteo hourly forecast. Select your location to view today’s UV curve.
        </p>
      </div>

      <div class="control-row">
        <button @click="useCurrentLocation" :disabled="loading">Use My Location</button>
        <button @click="useMapLocation" :disabled="loading">Use Map Location</button>
        <span>or</span>
        <input
          v-model.trim="postcode"
          type="text"
          inputmode="numeric"
          maxlength="4"
          placeholder="Enter Australian postcode"
          aria-label="Enter Australian postcode"
        />
        <button @click="searchByPostcode" :disabled="loading || !postcode">Load UV</button>
      </div>

      <p v-if="loading">Loading hourly UV...</p>
      <p v-else-if="errorMessage" class="error-text">{{ errorMessage }}</p>

      <div v-if="locationLabel" class="location-pill">
        <strong>Location:</strong> {{ locationLabel }}
      </div>

      <div class="chart-wrapper">
        <div ref="chart" class="chart-surface" aria-label="Hourly UV line chart"></div>
      </div>

      <div v-if="summary" class="summary-grid" aria-label="UV summary">
        <div class="summary-item">
          <div class="summary-label">Peak UV</div>
          <div class="summary-value">{{ summary.peakUv }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Peak time</div>
          <div class="summary-value">{{ summary.peakTime }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Hours UV ≥ 3</div>
          <div class="summary-value">{{ summary.hoursUv3Plus }}</div>
        </div>
      </div>
    </section>

    <section class="awareness-card" aria-labelledby="myth-title">
      <div class="card-head">
        <h2 id="myth-title" class="card-title">Myth or Fact (coming next)</h2>
        <p class="card-caption">
          Next we’ll connect your datasets here to show Australia UV impacts and debunk common myths
          with live stats.
        </p>
      </div>

      <div class="placeholder-box">Dataset integration pending</div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as d3 from 'd3'
import Map from '@/components/Map.vue'

const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || ''

const postcode = ref('')
const loading = ref(false)
const errorMessage = ref('')

const mapLocation = ref({ center: { lng: 144.9631, lat: -37.8136 }, zoom: 12 })
const locationLabel = ref('')

const hourly = ref([])

const chart = ref(null)
let resizeHandler = null

const summary = computed(() => {
  if (!hourly.value.length) return null

  const sorted = [...hourly.value].sort((a, b) => a.time.getTime() - b.time.getTime())
  const peak = sorted.reduce((acc, cur) => (cur.uv > acc.uv ? cur : acc), sorted[0])

  const uv3PlusHours = sorted.filter((d) => d.uv >= 3).length
  const peakTime = peak.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return {
    peakUv: peak.uv.toFixed(1),
    peakTime,
    hoursUv3Plus: uv3PlusHours,
  }
})

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

const fetchHourlyUvForCoordinates = async (latitude, longitude, label) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=uv_index&forecast_days=1&timezone=auto`,
    )
    const data = await response.json()

    hourly.value = parseHourly(data)
    locationLabel.value = label

    await nextTick()
    drawChart()
  } catch (error) {
    hourly.value = []
    locationLabel.value = ''
    errorMessage.value = error?.message || 'Failed to load hourly UV data.'
  } finally {
    loading.value = false
  }
}

const reverseGeocode = async (lng, lat) => {
  if (!mapboxToken) return ''

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=place,locality,postcode&limit=1&access_token=${mapboxToken}`,
    )
    const data = await response.json()
    return data?.features?.[0]?.place_name || ''
  } catch {
    return ''
  }
}

const useCurrentLocation = () => {
  if (!navigator.geolocation) {
    errorMessage.value = 'Geolocation is not supported by your browser.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude

      const label = (await reverseGeocode(lng, lat)) || 'Current location'
      await fetchHourlyUvForCoordinates(lat, lng, label)
    },
    async (error) => {
      if (error?.code === 1) {
        errorMessage.value =
          'Location permission was denied. Please allow location permission, or enter an Australian postcode.'
      } else {
        errorMessage.value = 'Could not determine your location. Please try again or use postcode.'
      }
      loading.value = false
    },
    { enableHighAccuracy: true, timeout: 8000 },
  )
}

const useMapLocation = async () => {
  const lng = mapLocation.value?.center?.lng
  const lat = mapLocation.value?.center?.lat

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    errorMessage.value = 'Please select a valid point on the map.'
    return
  }

  const label = (await reverseGeocode(lng, lat)) || 'Selected map location'
  await fetchHourlyUvForCoordinates(lat, lng, label)
}

const searchByPostcode = async () => {
  if (!mapboxToken) {
    errorMessage.value = 'Mapbox token missing. Set VITE_MAPBOX_TOKEN to enable postcode search.'
    return
  }
  if (!/^\d{4}$/.test(postcode.value)) {
    errorMessage.value = 'Please enter a valid 4-digit Australian postcode.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const geoResponse = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${postcode.value}.json?country=au&types=postcode&limit=1&access_token=${mapboxToken}`,
    )
    const geoData = await geoResponse.json()
    const feature = geoData?.features?.[0]

    if (!feature?.center) {
      throw new Error('Australian postcode not found. Please try another postcode.')
    }

    const [lng, lat] = feature.center
    const label = feature.place_name || `Postcode ${postcode.value}`

    await fetchHourlyUvForCoordinates(lat, lng, label)
  } catch (error) {
    hourly.value = []
    locationLabel.value = ''
    errorMessage.value = error?.message || 'Could not look up postcode.'
  } finally {
    loading.value = false
  }
}

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
  const height = 320

  const margin = { top: 18, right: 22, bottom: 44, left: 48 }
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const data = [...hourly.value].sort((a, b) => a.time.getTime() - b.time.getTime())

  const maxUv = d3.max(data, (d) => d.uv) || 0

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.time))
    .range([0, innerW])

  const y = d3
    .scaleLinear()
    .domain([0, Math.max(1, Math.ceil(maxUv))])
    .nice()
    .range([innerH, 0])

  const svg = d3
    .select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)

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
    .attr('class', 'risk')
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

  g.append('path').datum(data).attr('fill', 'none').attr('stroke', '#0ea5e9').attr('stroke-width', 3).attr('d', line)

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
    .attr('class', 'point')
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
    .call(d3.axisBottom(x).ticks(Math.min(8, data.length)).tickFormat(d3.timeFormat('%H:%M')))

  g.append('g').call(d3.axisLeft(y).ticks(6))

  g.append('text')
    .attr('x', innerW / 2)
    .attr('y', innerH + 36)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(15,23,42,0.7)')
    .style('font-size', '12px')
    .text('Time (local)')

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerH / 2)
    .attr('y', -36)
    .attr('text-anchor', 'middle')
    .attr('fill', 'rgba(15,23,42,0.7)')
    .style('font-size', '12px')
    .text('UV Index')
}

watch(
  () => hourly.value.length,
  async () => {
    await nextTick()
    drawChart()
  },
)

watch(
  () => mapLocation.value,
  () => {
    // if you change map selection but haven't loaded data yet, do nothing
  },
  { deep: true },
)

const setupResize = () => {
  resizeHandler = () => drawChart()
  window.addEventListener('resize', resizeHandler)
}

setupResize()

onBeforeUnmount(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<style scoped>
.awareness-main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  gap: 18px;
}

.awareness-hero {
  border-radius: 18px;
  padding: 20px 22px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.14), rgba(34, 197, 94, 0.08));
}

.awareness-title {
  margin: 0;
  font-size: 1.8rem;
}

.awareness-subtitle {
  margin: 8px 0 0;
  color: rgba(15, 23, 42, 0.75);
  max-width: 68ch;
}

.awareness-card {
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
  padding: 18px;
}

.card-head {
  margin-bottom: 14px;
}

.card-title {
  margin: 0;
  font-size: 1.2rem;
}

.card-caption {
  margin: 6px 0 0;
  color: rgba(15, 23, 42, 0.65);
}

.control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin: 12px 0;
}

.control-row input {
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.18);
}

.control-row button {
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 700;
  background: #0ea5e9;
  color: #ffffff;
}

.control-row button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  color: #b91c1c;
  font-weight: 600;
}

.location-pill {
  display: inline-block;
  margin-top: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
}

.chart-wrapper {
  margin-top: 12px;
  position: relative;
}

.chart-surface {
  width: 100%;
}

.summary-grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.summary-item {
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(15, 23, 42, 0.02);
}

.summary-label {
  color: rgba(15, 23, 42, 0.6);
  font-weight: 600;
  font-size: 0.9rem;
}

.summary-value {
  font-weight: 800;
  font-size: 1.25rem;
  margin-top: 4px;
}

.placeholder-box {
  border-radius: 14px;
  padding: 18px;
  border: 1px dashed rgba(15, 23, 42, 0.22);
  color: rgba(15, 23, 42, 0.7);
  background: rgba(15, 23, 42, 0.02);
}

@media (max-width: 840px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
