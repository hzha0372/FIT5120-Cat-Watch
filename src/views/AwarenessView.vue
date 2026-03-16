<template>
  <main class="awareness-main">
    <header class="awareness-hero">
      <div>
        <h1 class="awareness-title">UV Awareness</h1>
        <p class="awareness-subtitle">
          Understand UV in plain language, learn what's myth vs fact, and explore trusted sources.
        </p>
      </div>
    </header>

    <!-- Jump nav -->
    <section class="jump" aria-label="What you'll find on this page">
      <h2 class="jump-title">What you'll find on this page</h2>
      <div class="jump-grid">
        <button class="jump-card" @click="openModal('uv')">
          <div class="jump-number">01</div>
          <div class="jump-text">UV throughout the day</div>
          <div class="jump-btn">Read more</div>
        </button>
        <button class="jump-card" @click="openModal('myth')">
          <div class="jump-number">02</div>
          <div class="jump-text">Myth vs Fact</div>
          <div class="jump-btn">Read more</div>
        </button>
        <button class="jump-card" @click="openModal('videos')">
          <div class="jump-number">03</div>
          <div class="jump-text">Videos</div>
          <div class="jump-btn">Read more</div>
        </button>
        <button class="jump-card" @click="openModal('articles')">
          <div class="jump-number">04</div>
          <div class="jump-text">Articles</div>
          <div class="jump-btn">Read more</div>
        </button>
      </div>
    </section>

    <!-- Modal overlay -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="activeModal" class="modal-backdrop" @click.self="closeModal" role="dialog" aria-modal="true">
          <div class="modal-box">
            <button class="modal-close" @click="closeModal" aria-label="Close">&#x2715;</button>

            <!-- ── 01 UV throughout the day ───────────────────────────────── -->
            <div v-if="activeModal === 'uv'">
              <div class="modal-header modal-header--uv">
                <span class="modal-icon">☀️</span>
                <div>
                  <h2 class="modal-title">UV Throughout the Day</h2>
                  <p class="modal-subtitle">How ultraviolet radiation changes from dawn to dusk</p>
                </div>
              </div>
              <div class="modal-body">
                <p class="modal-intro">
                  UV (ultraviolet) radiation from the sun does not stay constant — it rises steeply in the morning,
                  peaks around solar noon, and drops again in the late afternoon. Understanding this daily pattern
                  helps you plan outdoor activities safely.
                </p>

                <h3 class="modal-section-title">The UV Index Explained</h3>
                <div class="uv-scale">
                  <div class="uv-band uv-band--low">
                    <span class="uv-band-range">0 – 2</span>
                    <span class="uv-band-label">Low</span>
                    <span class="uv-band-advice">No protection needed for most people</span>
                  </div>
                  <div class="uv-band uv-band--mod">
                    <span class="uv-band-range">3 – 5</span>
                    <span class="uv-band-label">Moderate</span>
                    <span class="uv-band-advice">Wear sunscreen &amp; a hat outdoors</span>
                  </div>
                  <div class="uv-band uv-band--high">
                    <span class="uv-band-range">6 – 7</span>
                    <span class="uv-band-label">High</span>
                    <span class="uv-band-advice">Seek shade during midday hours</span>
                  </div>
                  <div class="uv-band uv-band--vhigh">
                    <span class="uv-band-range">8 – 10</span>
                    <span class="uv-band-label">Very High</span>
                    <span class="uv-band-advice">Minimise exposure 10 am – 4 pm</span>
                  </div>
                  <div class="uv-band uv-band--extreme">
                    <span class="uv-band-range">11+</span>
                    <span class="uv-band-label">Extreme</span>
                    <span class="uv-band-advice">Avoid sun exposure; full protection required</span>
                  </div>
                </div>

                <h3 class="modal-section-title">Daily UV Pattern in Australia</h3>
                <div class="info-cards">
                  <div class="info-card">
                    <div class="info-card-icon">🌅</div>
                    <div>
                      <strong>Morning (6–10 am)</strong>
                      <p>UV rises from zero. Safe for most outdoor activity, but apply SPF30+ if you plan extended time outside.</p>
                    </div>
                  </div>
                  <div class="info-card info-card--warn">
                    <div class="info-card-icon">🔥</div>
                    <div>
                      <strong>Midday (10 am – 2 pm)</strong>
                      <p>Peak UV window. In Australian summer, UV can exceed 12 (Extreme). Stay in the shade, cover up, reapply sunscreen every 2 hours.</p>
                    </div>
                  </div>
                  <div class="info-card">
                    <div class="info-card-icon">🌇</div>
                    <div>
                      <strong>Afternoon (2–6 pm)</strong>
                      <p>UV falls but can stay above 3 until 4–5 pm in summer. Continue sun protection until UV drops below 3.</p>
                    </div>
                  </div>
                </div>

                <h3 class="modal-section-title">Key Facts</h3>
                <ul class="modal-list">
                  <li>UV does <strong>not</strong> depend on temperature — a cold, clear winter day can have UV Index 5 or above.</li>
                  <li>Clouds reduce UV by only 10–30 %. Overcast days still require sun protection.</li>
                  <li>Reflective surfaces (water, sand, snow) can <strong>double</strong> UV exposure.</li>
                  <li>Australia has one of the highest UV levels on earth due to its proximity to the ozone hole.</li>
                  <li>SunSmart recommends sun protection whenever the UV Index is <strong>3 or above</strong>.</li>
                </ul>

                <div class="modal-tip">
                  <strong>Tip:</strong> Use the <a href="https://www.arpansa.gov.au/our-services/monitoring/uv-radiation-monitoring" target="_blank" rel="noreferrer">ARPANSA UV Alert</a> or the
                  <a href="https://www.sunsmart.com.au/tools/uv-and-sun-protection-times" target="_blank" rel="noreferrer">SunSmart app</a> to check today's UV forecast before heading outdoors.
                </div>
              </div>
            </div>

            <!-- ── 02 Myth vs Fact ─────────────────────────────────────────── -->
            <div v-if="activeModal === 'myth'">
              <div class="modal-header modal-header--myth">
                <span class="modal-icon">🔍</span>
                <div>
                  <h2 class="modal-title">Myth vs Fact</h2>
                  <p class="modal-subtitle">Separating sun safety fiction from evidence-based facts</p>
                </div>
              </div>
              <div class="modal-body">
                <p class="modal-intro">
                  Misinformation about sun safety is surprisingly common. Here are the most widespread myths,
                  corrected with evidence from Cancer Council Australia and the WHO.
                </p>
                <div class="myth-list">
                  <div v-for="m in myths" :key="m.myth" class="myth-item">
                    <div class="myth-row">
                      <span class="badge badge--myth">MYTH</span>
                      <p class="myth-text">{{ m.myth }}</p>
                    </div>
                    <div class="fact-row">
                      <span class="badge badge--fact">FACT</span>
                      <p class="fact-text">{{ m.fact }}</p>
                    </div>
                    <div class="do-row">
                      <span class="badge badge--do">DO THIS</span>
                      <p class="do-text">{{ m.doThis }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── 03 Videos ──────────────────────────────────────────────── -->
            <div v-if="activeModal === 'videos'">
              <div class="modal-header modal-header--video">
                <span class="modal-icon">▶️</span>
                <div>
                  <h2 class="modal-title">Sun Safety Videos</h2>
                  <p class="modal-subtitle">Watch trusted videos from health organisations and researchers</p>
                </div>
              </div>
              <div class="modal-body">
                <p class="modal-intro">
                  These videos come from Cancer Council Australia, the World Health Organization, and leading dermatologists.
                  Click any card to watch on YouTube.
                </p>
                <div class="video-grid">
                  <a v-for="v in videos" :key="v.url" :href="v.url" target="_blank" rel="noreferrer" class="video-card">
                    <div class="video-thumb">
                      <img :src="v.thumb" :alt="v.title" loading="lazy" />
                      <div class="video-play-btn">▶</div>
                    </div>
                    <div class="video-info">
                      <p class="video-title">{{ v.title }}</p>
                      <p class="video-desc">{{ v.desc }}</p>
                      <span class="video-cta">Watch on YouTube →</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- ── 04 Articles ────────────────────────────────────────────── -->
            <div v-if="activeModal === 'articles'">
              <div class="modal-header modal-header--article">
                <span class="modal-icon">📄</span>
                <div>
                  <h2 class="modal-title">Recommended Articles</h2>
                  <p class="modal-subtitle">Evidence-based reading from Australia's leading health organisations</p>
                </div>
              </div>
              <div class="modal-body">
                <p class="modal-intro">
                  Curated articles from Cancer Council Australia, the WHO, ARPANSA, and leading medical centres.
                  All links open in a new tab.
                </p>
                <div class="article-list">
                  <a v-for="a in articles" :key="a.url" :href="a.url" target="_blank" rel="noreferrer" class="article-card">
                    <div class="article-org-badge">{{ a.org }}</div>
                    <div class="article-body">
                      <p class="article-title">{{ a.title }}</p>
                      <p class="article-desc">{{ a.desc }}</p>
                    </div>
                    <div class="article-arrow">→</div>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </transition>
    </teleport>

    <!-- Existing detail sections (kept below for deep-link access) -->
    <section id="uv-hourly" class="awareness-card fade" aria-labelledby="uv-daily-title">
      <div class="card-head">
        <h2 id="uv-daily-title" class="card-title">UV throughout the day (Live Chart)</h2>
        <p class="card-caption">Hourly UV forecast — auto-loaded for Melbourne. Enter a postcode to change location.</p>
      </div>

      <div class="control-row">
        <button class="ctrl-btn" @click="useCurrentLocation" :disabled="loading">📍 Use My Location</button>
        <span class="ctrl-or">or</span>
        <input v-model.trim="postcode" class="ctrl-input" type="text" inputmode="numeric" maxlength="4" placeholder="Postcode (e.g. 3000)" />
        <button class="ctrl-btn ctrl-btn--primary" @click="searchByPostcode" :disabled="loading || !postcode">Load UV</button>
      </div>

      <p v-if="loading" class="status-text">Loading UV data…</p>
      <p v-else-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      <div v-if="locationLabel" class="location-pill"><strong>📌</strong> {{ locationLabel }}</div>

      <div class="chart-wrapper">
        <div ref="chart" class="chart-surface" aria-label="Hourly UV line chart"></div>
      </div>

      <div v-if="summary" class="summary-grid">
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

    <section id="myth-fact" class="awareness-card fade" aria-labelledby="myth-title">
      <div class="card-head">
        <h2 id="myth-title" class="card-title">Myth vs Fact</h2>
        <p class="card-caption">Tap a myth to see the evidence-backed fact and what to do.</p>
      </div>
      <div class="qa">
        <details v-for="m in myths" :key="m.myth" class="qa-item">
          <summary class="qa-q"><span class="qa-badge">MYTH</span> {{ m.myth }}</summary>
          <div class="qa-a">
            <div class="qa-row"><span class="qa-badge qa-badge--fact">FACT</span><p>{{ m.fact }}</p></div>
            <div class="qa-row"><span class="qa-badge qa-badge--do">DO THIS</span><p>{{ m.doThis }}</p></div>
          </div>
        </details>
      </div>
    </section>

    <section id="videos" class="awareness-card fade" aria-labelledby="videos-title">
      <div class="card-head">
        <h2 id="videos-title" class="card-title">Videos</h2>
        <p class="card-caption">Click any card to watch on YouTube.</p>
      </div>
      <div class="source-grid">
        <a v-for="v in videos" :key="v.url" :href="v.url" target="_blank" rel="noreferrer" class="source-card">
          <div class="source-thumb">
            <img :src="v.thumb" :alt="v.title" loading="lazy" />
            <div class="source-play">▶</div>
          </div>
          <div class="source-body">
            <span class="source-tag source-tag--video">Video</span>
            <p class="source-title">{{ v.title }}</p>
            <p class="source-desc">{{ v.desc }}</p>
            <span class="source-cta">Watch now →</span>
          </div>
        </a>
      </div>
    </section>

    <section id="articles" class="awareness-card fade" aria-labelledby="articles-title">
      <div class="card-head">
        <h2 id="articles-title" class="card-title">Articles</h2>
        <p class="card-caption">Evidence-based articles from Australia's leading health organisations.</p>
      </div>
      <div class="source-grid">
        <a v-for="a in articles" :key="a.url" :href="a.url" target="_blank" rel="noreferrer" class="source-card source-card--article">
          <div class="source-article-icon">📄</div>
          <div class="source-body">
            <span class="source-tag source-tag--article">{{ a.org }}</span>
            <p class="source-title">{{ a.title }}</p>
            <p class="source-desc">{{ a.desc }}</p>
            <span class="source-cta">Read article →</span>
          </div>
        </a>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as d3 from 'd3'

// ── Modal ─────────────────────────────────────────────────────────────────────
const activeModal = ref(null)
const openModal = (id) => {
  activeModal.value = id
  document.body.style.overflow = 'hidden'
}
const closeModal = () => {
  activeModal.value = null
  document.body.style.overflow = ''
}

// ── UV Chart ──────────────────────────────────────────────────────────────────
const loading = ref(false)
const errorMessage = ref('')
const locationLabel = ref('')
const postcode = ref('')
const hourly = ref([])
const chart = ref(null)
let resizeHandler = null

const summary = computed(() => {
  if (!hourly.value.length) return null
  const sorted = [...hourly.value].sort((a, b) => a.time - b.time)
  const peak = sorted.reduce((acc, cur) => (cur.uv > acc.uv ? cur : acc), sorted[0])
  return {
    peakUv: peak.uv.toFixed(1),
    peakTime: peak.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    hoursUv3Plus: sorted.filter((d) => d.uv >= 3).length,
  }
})

const parseHourly = (data) => {
  const times = data?.hourly?.time
  const uvs = data?.hourly?.uv_index
  if (!Array.isArray(times) || !Array.isArray(uvs)) throw new Error('UV data unavailable.')
  return times.map((t, i) => ({ time: new Date(t), uv: Number(uvs[i]) })).filter((d) => Number.isFinite(d.uv))
}

const fetchHourlyUvForCoordinates = async (lat, lon, label) => {
  loading.value = true
  errorMessage.value = ''
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=uv_index&forecast_days=1&timezone=auto`)
    hourly.value = parseHourly(await res.json())
    locationLabel.value = label
    await nextTick()
    drawChart()
  } catch (e) {
    hourly.value = []
    errorMessage.value = e.message || 'Failed to load UV data.'
  } finally {
    loading.value = false
  }
}

const useCurrentLocation = () => {
  if (!navigator.geolocation) { errorMessage.value = 'Geolocation not supported.'; return }
  loading.value = true
  navigator.geolocation.getCurrentPosition(
    async ({ coords }) => fetchHourlyUvForCoordinates(coords.latitude, coords.longitude, 'Your location'),
    () => { loading.value = false; errorMessage.value = 'Location access denied. Enter a postcode.' },
    { timeout: 8000 },
  )
}

const searchByPostcode = async () => {
  if (!/^\d{4}$/.test(postcode.value)) { errorMessage.value = 'Enter a valid 4-digit postcode.'; return }
  loading.value = true; errorMessage.value = ''
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${postcode.value}&country=AU&format=json&limit=1`)
    const data = await res.json()
    if (!data.length) throw new Error('Postcode not found.')
    await fetchHourlyUvForCoordinates(+data[0].lat, +data[0].lon, data[0].display_name.split(',')[0])
  } catch (e) { loading.value = false; errorMessage.value = e.message }
}

const clearChart = () => { if (chart.value) d3.select(chart.value).selectAll('*').remove() }

const drawChart = () => {
  clearChart()
  if (!chart.value || !hourly.value.length) return
  const container = chart.value
  const width = Math.max(320, container.getBoundingClientRect().width)
  const height = 300
  const m = { top: 18, right: 22, bottom: 44, left: 48 }
  const iW = width - m.left - m.right, iH = height - m.top - m.bottom
  const data = [...hourly.value].sort((a, b) => a.time - b.time)
  const maxUv = d3.max(data, (d) => d.uv) || 0
  const x = d3.scaleTime().domain(d3.extent(data, (d) => d.time)).range([0, iW])
  const y = d3.scaleLinear().domain([0, Math.max(1, Math.ceil(maxUv))]).nice().range([iH, 0])
  const svg = d3.select(container).append('svg').attr('width', width).attr('height', height)
  const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`)
  const bands = [
    { from: 0, to: 2.9, color: 'rgba(34,197,94,.10)' },
    { from: 3, to: 5.9, color: 'rgba(234,179,8,.12)' },
    { from: 6, to: 7.9, color: 'rgba(249,115,22,.12)' },
    { from: 8, to: Math.max(12, maxUv), color: 'rgba(239,68,68,.10)' },
  ]
  g.selectAll('rect.risk').data(bands).enter().append('rect')
    .attr('x', 0).attr('width', iW)
    .attr('y', (d) => y(d.to)).attr('height', (d) => Math.max(0, y(d.from) - y(d.to)))
    .attr('fill', (d) => d.color)
  const line = d3.line().x((d) => x(d.time)).y((d) => y(d.uv)).curve(d3.curveMonotoneX)
  g.append('path').datum(data).attr('fill', 'none').attr('stroke', '#0ea5e9').attr('stroke-width', 3).attr('d', line)
  const tip = d3.select(container).append('div')
    .style('position', 'absolute').style('padding', '6px 10px').style('background', 'rgba(15,23,42,.9)')
    .style('color', '#fff').style('font-size', '12px').style('border-radius', '8px')
    .style('pointer-events', 'none').style('opacity', 0)
  g.selectAll('circle').data(data).enter().append('circle')
    .attr('cx', (d) => x(d.time)).attr('cy', (d) => y(d.uv)).attr('r', 4).attr('fill', '#0369a1')
    .on('mousemove', (e, d) => tip.style('opacity', 1)
      .html(`<b>${d.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</b><br/>UV: ${d.uv.toFixed(1)}`)
      .style('left', e.offsetX + 14 + 'px').style('top', e.offsetY - 10 + 'px'))
    .on('mouseleave', () => tip.style('opacity', 0))
  g.append('g').attr('transform', `translate(0,${iH})`).call(d3.axisBottom(x).ticks(8).tickFormat(d3.timeFormat('%H:%M')))
  g.append('g').call(d3.axisLeft(y).ticks(6))
  g.append('text').attr('x', iW / 2).attr('y', iH + 36).attr('text-anchor', 'middle').style('font-size', '12px').attr('fill', 'rgba(15,23,42,.7)').text('Time')
  g.append('text').attr('transform', 'rotate(-90)').attr('x', -iH / 2).attr('y', -36).attr('text-anchor', 'middle').style('font-size', '12px').attr('fill', 'rgba(15,23,42,.7)').text('UV Index')
}

watch(() => hourly.value.length, async () => { await nextTick(); drawChart() })

const setupResize = () => { resizeHandler = () => drawChart(); window.addEventListener('resize', resizeHandler) }
setupResize()

onMounted(() => fetchHourlyUvForCoordinates(-37.8136, 144.9631, 'Melbourne (default)'))
onBeforeUnmount(() => { if (resizeHandler) window.removeEventListener('resize', resizeHandler) })

// ── Content data ──────────────────────────────────────────────────────────────
const myths = ref([
  {
    myth: 'I only need sunscreen at the beach.',
    fact: 'UV reaches dangerous levels during everyday errands, sport, and even on cool or cloudy days. Protection is needed whenever UV is 3 or above — that includes city streets and schoolyards.',
    doThis: 'Check the UV Index before heading out. Wear SPF30+ and a hat whenever UV reaches 3, regardless of location.',
  },
  {
    myth: 'Only fair-skinned people need sun protection.',
    fact: 'All skin tones can be damaged by UV radiation. While darker skin takes longer to burn, UV still causes cumulative DNA damage, premature ageing, and increases skin cancer risk for everyone.',
    doThis: 'Use SPF30+ sunscreen, protective clothing, and shade whenever UV is 3 or above — regardless of skin tone.',
  },
  {
    myth: 'Sunscreen prevents your body from making Vitamin D.',
    fact: 'In practice, people rarely apply enough sunscreen to block all UV. Studies show adequate Vitamin D production still occurs with regular sunscreen use.',
    doThis: 'Keep your sun-safe habits. If concerned about Vitamin D, speak to your doctor about dietary sources or supplementation.',
  },
  {
    myth: 'A base tan protects you from sunburn.',
    fact: 'A tan is a sign of UV damage to skin cells. The protection it offers is equivalent to roughly SPF 3 — far below the SPF30+ recommended by health authorities.',
    doThis: 'Skip the base tan. Use SPF50+ sunscreen and wear protective clothing during peak UV hours.',
  },
  {
    myth: 'UV is only dangerous in summer.',
    fact: 'UV levels can reach moderate-to-high on clear winter days, especially around midday. Season and temperature are unreliable guides — always check the UV Index.',
    doThis: 'Check the UV forecast year-round and apply sun protection whenever UV is 3 or above, even in winter.',
  },
  {
      myth: "Glass blocks UV, so I'm safe in a car.",
    fact: 'Standard car windshields block most UVB but only some UVA. Side windows typically block very little UV. Long drives can lead to significant UV exposure on the left arm and face.',
    doThis: 'Apply sunscreen before long drives. Consider UV-protective window film for frequently used vehicles.',
  },
])

const videos = ref([
  {
    title: 'Sunscreen myths debunked — what really works',
    url: 'https://www.youtube.com/watch?v=Uo4X12y5yAk',
    thumb: 'https://img.youtube.com/vi/Uo4X12y5yAk/hqdefault.jpg',
    desc: 'Experts bust common sunscreen myths and explain what SPF really means.',
  },
  {
    title: 'UV radiation and skin cancer — Cancer Council Australia',
    url: 'https://www.youtube.com/watch?v=So27AO7JCEA',
    thumb: 'https://img.youtube.com/vi/So27AO7JCEA/hqdefault.jpg',
    desc: 'How UV causes DNA damage and leads to melanoma over time.',
  },
  {
    title: 'How to apply sunscreen correctly',
    url: 'https://www.youtube.com/watch?v=bVx0QOF7B3g',
    thumb: 'https://img.youtube.com/vi/bVx0QOF7B3g/hqdefault.jpg',
    desc: 'Step-by-step guide to applying sunscreen for maximum protection.',
  },
  {
    title: 'Understanding the UV Index',
    url: 'https://www.youtube.com/watch?v=IlQCHQYpEtA',
    thumb: 'https://img.youtube.com/vi/IlQCHQYpEtA/hqdefault.jpg',
    desc: 'What the UV Index number means and how to act on it each day.',
  },
])

const articles = ref([
  {
    org: 'Cancer Council Vic',
    title: '7 myths about sun protection',
    url: 'https://www.cancervic.org.au/get-support/stories/7-myths-about-sun-protection.html',
    desc: 'Debunks the most common sun protection myths with evidence-based guidance from Cancer Council Victoria.',
  },
  {
    org: 'MD Anderson',
    title: 'Sunscreen myths debunked',
    url: 'https://www.mdanderson.org/cancerwise/sunscreen-myths-debunked.h00-159697545.html',
    desc: 'MD Anderson Cancer Center explains the science behind SPF and safe sun behaviour.',
  },
  {
    org: 'WHO',
    title: 'Ultraviolet radiation and health',
    url: 'https://www.who.int/news-room/fact-sheets/detail/ultraviolet-radiation',
    desc: 'World Health Organization fact sheet covering UV sources, health effects, and protective measures globally.',
  },
  {
    org: 'Cancer Council Australia',
    title: 'SunSmart sun protection guidelines',
    url: 'https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety',
    desc: 'Official SunSmart guidelines: when to protect, how to choose sunscreen, and the five-step slip-slop-slap-seek-slide approach.',
  },
  {
    org: 'ARPANSA',
    title: 'Understanding the UV Index',
    url: 'https://www.arpansa.gov.au/understanding-radiation/radiation-sources/more-radiation-sources/ultraviolet-radiation-sun',
    desc: 'How the UV Index is measured in Australia, what the numbers mean, and how to use UV alerts in daily life.',
  },
  {
    org: 'Skin Cancer Foundation',
    title: 'Ask the Expert: Can I get Vitamin D from the sun safely?',
    url: 'https://www.skincancer.org/blog/ask-the-expert-can-i-get-my-vitamin-d-and-still-protect-myself-from-skin-cancer/',
    desc: 'Dermatologists answer the Vitamin D vs sunscreen debate with scientific evidence.',
  },
])
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
.awareness-title { margin: 0; font-size: 1.8rem; }
.awareness-subtitle { margin: 8px 0 0; color: rgba(15, 23, 42, 0.75); max-width: 68ch; }

/* ── Jump nav ──────────────────────────────────────────────────────── */
.jump {
  border-radius: 18px;
  padding: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: #fff;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.04);
}
.jump-title { text-align: center; margin: 0 0 14px; }
.jump-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

.jump-card {
  border-radius: 16px;
  background: #facc15;
  color: #0f172a;
  padding: 18px;
  min-height: 150px;
  display: grid;
  align-content: space-between;
  transition: transform 160ms ease, box-shadow 160ms ease;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}
.jump-card:hover { transform: translateY(-4px); box-shadow: 0 18px 36px rgba(15, 23, 42, 0.14); }
.jump-number { font-weight: 900; opacity: 0.65; font-size: 0.85rem; }
.jump-text { font-size: 1.1rem; font-weight: 900; line-height: 1.15; }
.jump-btn {
  justify-self: start;
  border: 1px solid rgba(15, 23, 42, 0.35);
  border-radius: 999px;
  padding: 6px 14px;
  font-weight: 800;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.25);
}

/* ── Modal backdrop ────────────────────────────────────────────────── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 30, 0.55);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px 24px;
  overflow-y: auto;
}

.modal-box {
  position: relative;
  background: #fff;
  border-radius: 22px;
  width: 100%;
  max-width: 720px;
  box-shadow: 0 32px 80px rgba(10, 15, 30, 0.25);
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(15, 23, 42, 0.15);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  transition: background 150ms;
}
.modal-close:hover { background: #f1f5f9; }

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 24px 20px;
}
.modal-header--uv      { background: linear-gradient(135deg, #fef3c7, #fde68a); }
.modal-header--myth    { background: linear-gradient(135deg, #e0f2fe, #bae6fd); }
.modal-header--video   { background: linear-gradient(135deg, #fce7f3, #fbcfe8); }
.modal-header--article { background: linear-gradient(135deg, #dcfce7, #bbf7d0); }

.modal-icon { font-size: 2.4rem; line-height: 1; }
.modal-title { margin: 0; font-size: 1.4rem; }
.modal-subtitle { margin: 4px 0 0; font-size: 0.9rem; color: rgba(15, 23, 42, 0.65); }

.modal-body {
  padding: 20px 24px 28px;
  max-height: 70vh;
  overflow-y: auto;
}

.modal-intro {
  color: rgba(15, 23, 42, 0.7);
  line-height: 1.65;
  margin: 0 0 20px;
}

.modal-section-title {
  font-size: 1rem;
  font-weight: 800;
  margin: 22px 0 12px;
  color: #0f172a;
  border-bottom: 2px solid rgba(15, 23, 42, 0.07);
  padding-bottom: 6px;
}

/* ── UV scale ──────────────────────────────────────────────────────── */
.uv-scale { display: flex; flex-direction: column; gap: 6px; }
.uv-band {
  display: grid;
  grid-template-columns: 56px 110px 1fr;
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 10px 14px;
}
.uv-band-range { font-weight: 900; font-size: 0.95rem; }
.uv-band-label { font-weight: 800; font-size: 0.9rem; }
.uv-band-advice { font-size: 0.84rem; color: rgba(15, 23, 42, 0.75); }
.uv-band--low     { background: rgba(34, 197, 94, 0.12); }
.uv-band--mod     { background: rgba(234, 179, 8, 0.15); }
.uv-band--high    { background: rgba(249, 115, 22, 0.15); }
.uv-band--vhigh   { background: rgba(239, 68, 68, 0.12); }
.uv-band--extreme { background: rgba(139, 0, 0, 0.10); }

/* ── Info cards (UV modal) ─────────────────────────────────────────── */
.info-cards { display: flex; flex-direction: column; gap: 10px; }
.info-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(15, 23, 42, 0.03);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 12px 16px;
}
.info-card--warn { background: rgba(249, 115, 22, 0.06); border-color: rgba(249, 115, 22, 0.2); }
.info-card-icon { font-size: 1.5rem; flex-shrink: 0; }
.info-card strong { display: block; margin-bottom: 4px; font-size: 0.92rem; }
.info-card p { margin: 0; font-size: 0.88rem; line-height: 1.55; color: rgba(15, 23, 42, 0.75); }

.modal-list { padding-left: 20px; display: flex; flex-direction: column; gap: 8px; }
.modal-list li { font-size: 0.9rem; line-height: 1.55; color: rgba(15, 23, 42, 0.8); }

.modal-tip {
  margin-top: 18px;
  padding: 12px 16px;
  background: rgba(14, 165, 233, 0.07);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 12px;
  font-size: 0.88rem;
  line-height: 1.6;
}
.modal-tip a { color: #0369a1; font-weight: 700; }

/* ── Myth items (modal) ────────────────────────────────────────────── */
.myth-list { display: flex; flex-direction: column; gap: 16px; }
.myth-item {
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.09);
  overflow: hidden;
}
.myth-row, .fact-row, .do-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
}
.myth-row { background: #fef9ec; }
.fact-row { background: #f0fdf4; border-top: 1px solid rgba(15, 23, 42, 0.06); }
.do-row   { background: #f0f9ff; border-top: 1px solid rgba(15, 23, 42, 0.06); }
.myth-text, .fact-text, .do-text { margin: 0; font-size: 0.9rem; line-height: 1.55; }

.badge {
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.06em;
  margin-top: 2px;
}
.badge--myth { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
.badge--fact { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
.badge--do   { background: #e0f2fe; color: #075985; border: 1px solid #bae6fd; }

/* ── Video grid (modal) ────────────────────────────────────────────── */
.video-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }
.video-card {
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  overflow: hidden;
  text-decoration: none;
  color: #0f172a;
  background: #fff;
  transition: transform 150ms, box-shadow 150ms;
  display: flex;
  flex-direction: column;
}
.video-card:hover { transform: translateY(-3px); box-shadow: 0 14px 32px rgba(15, 23, 42, 0.1); }
.video-thumb { position: relative; aspect-ratio: 16/9; background: #0f172a; overflow: hidden; }
.video-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.video-play-btn {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,.3); font-size: 1.8rem; color: #fff; opacity: 0; transition: opacity 150ms;
}
.video-card:hover .video-play-btn { opacity: 1; }
.video-info { padding: 12px 14px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
.video-title { margin: 0; font-weight: 700; font-size: 0.92rem; line-height: 1.3; }
.video-desc  { margin: 0; font-size: 0.82rem; color: rgba(15,23,42,.6); line-height: 1.4; flex: 1; }
.video-cta   { font-size: 0.8rem; font-weight: 700; color: #0369a1; margin-top: 6px; }

/* ── Article list (modal) ──────────────────────────────────────────── */
.article-list { display: flex; flex-direction: column; gap: 10px; }
.article-card {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: #0f172a;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.09);
  border-radius: 14px;
  padding: 14px 16px;
  transition: background 150ms, box-shadow 150ms;
}
.article-card:hover { background: #f8fafc; box-shadow: 0 6px 20px rgba(15, 23, 42, 0.07); }
.article-org-badge {
  flex-shrink: 0;
  background: #e0f2fe;
  color: #075985;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 0.72rem;
  font-weight: 800;
  text-align: center;
  min-width: 80px;
  line-height: 1.3;
}
.article-body { flex: 1; }
.article-title { margin: 0 0 4px; font-weight: 700; font-size: 0.92rem; }
.article-desc  { margin: 0; font-size: 0.82rem; color: rgba(15,23,42,.6); line-height: 1.4; }
.article-arrow { font-size: 1.1rem; color: rgba(15,23,42,.3); flex-shrink: 0; }

/* ── Modal transition ──────────────────────────────────────────────── */
.modal-enter-active, .modal-leave-active { transition: opacity 220ms ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 220ms ease; }
.modal-enter-from .modal-box { transform: scale(0.95) translateY(12px); }
.modal-leave-to .modal-box   { transform: scale(0.95) translateY(12px); }

/* ── Detail sections (below fold) ─────────────────────────────────── */
.awareness-card {
  border-radius: 18px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.05);
  padding: 18px;
}
.card-head { margin-bottom: 14px; }
.card-title { margin: 0; font-size: 1.2rem; }
.card-caption { margin: 6px 0 0; color: rgba(15, 23, 42, 0.65); }

.control-row { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px; }
.ctrl-btn {
  padding: 8px 16px; border-radius: 999px; border: 1px solid rgba(15,23,42,.25);
  background: #fff; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 150ms; font-family: inherit;
}
.ctrl-btn:hover:not(:disabled) { background: rgba(14,165,233,.1); }
.ctrl-btn:disabled { opacity: .5; cursor: not-allowed; }
.ctrl-btn--primary { background: #0ea5e9; color: #fff; border-color: #0ea5e9; }
.ctrl-btn--primary:hover:not(:disabled) { background: #0284c7; }
.ctrl-or { color: rgba(15,23,42,.45); font-size: .85rem; }
.ctrl-input {
  padding: 8px 12px; border: 1px solid rgba(15,23,42,.2); border-radius: 10px;
  font-size: .9rem; outline: none; width: 140px; transition: border-color 150ms;
}
.ctrl-input:focus { border-color: #0ea5e9; }

.error-text  { color: #b91c1c; font-weight: 600; }
.status-text { color: rgba(15,23,42,.6); font-style: italic; }
.location-pill {
  display: inline-block; margin-top: 6px; padding: 6px 12px;
  border-radius: 999px; background: rgba(15,23,42,.06); font-size: .88rem;
}

.chart-wrapper { margin-top: 12px; position: relative; }
.chart-surface { width: 100%; }

.summary-grid { margin-top: 14px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.summary-item { border-radius: 14px; padding: 12px; border: 1px solid rgba(15,23,42,.08); background: rgba(15,23,42,.02); }
.summary-label { color: rgba(15,23,42,.6); font-weight: 600; font-size: .9rem; }
.summary-value { font-weight: 800; font-size: 1.25rem; margin-top: 4px; }

/* Myth section */
.qa { display: flex; flex-direction: column; gap: 10px; }
.qa-item { border-radius: 12px; border: 1px solid rgba(15,23,42,.1); overflow: hidden; }
.qa-item[open] { border-color: rgba(14,165,233,.35); }
.qa-q {
  display: flex; align-items: center; gap: 10px; padding: 13px 16px;
  font-weight: 700; font-size: .95rem; cursor: pointer; list-style: none;
  background: rgba(15,23,42,.02); transition: background 150ms;
}
.qa-q::-webkit-details-marker { display: none; }
.qa-q:hover { background: rgba(14,165,233,.06); }
.qa-item[open] .qa-q { background: rgba(14,165,233,.08); }
.qa-badge {
  flex-shrink: 0; padding: 2px 8px; border-radius: 999px;
  font-size: .68rem; font-weight: 900; letter-spacing: .05em;
  background: #fef3c7; color: #92400e; border: 1px solid #fde68a;
}
.qa-badge--fact { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
.qa-badge--do   { background: #e0f2fe; color: #075985; border-color: #bae6fd; }
.qa-a { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid rgba(15,23,42,.07); }
.qa-row { display: flex; align-items: flex-start; gap: 10px; }
.qa-row p { margin: 0; font-size: .9rem; line-height: 1.55; }

/* Source cards */
.source-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
.source-card {
  display: flex; flex-direction: column; border-radius: 14px;
  border: 1px solid rgba(15,23,42,.1); overflow: hidden; text-decoration: none; color: #0f172a;
  background: #fff; transition: transform 150ms, box-shadow 150ms;
}
.source-card:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(15,23,42,.1); }
.source-thumb { position: relative; aspect-ratio: 16/9; background: #0f172a; overflow: hidden; }
.source-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.source-play {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,.3); font-size: 1.8rem; color: #fff; opacity: 0; transition: opacity 150ms;
}
.source-card:hover .source-play { opacity: 1; }
.source-article-icon {
  aspect-ratio: 16/7; display: flex; align-items: center; justify-content: center;
  font-size: 2.4rem; background: linear-gradient(135deg, #e0f2fe, #f0fdf4);
}
.source-body { padding: 13px 14px; display: flex; flex-direction: column; gap: 5px; flex: 1; }
.source-tag {
  align-self: flex-start; padding: 2px 8px; border-radius: 999px;
  font-size: .7rem; font-weight: 800; letter-spacing: .04em;
}
.source-tag--video   { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
.source-tag--article { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
.source-title { margin: 0; font-weight: 700; font-size: .92rem; line-height: 1.3; }
.source-desc  { margin: 0; font-size: .82rem; color: rgba(15,23,42,.6); line-height: 1.4; flex: 1; }
.source-cta   { font-size: .8rem; font-weight: 700; color: #0369a1; margin-top: 4px; }

@media (max-width: 840px) {
  .jump-grid { grid-template-columns: repeat(2, 1fr); }
  .summary-grid { grid-template-columns: 1fr; }
  .uv-band { grid-template-columns: 48px 90px 1fr; }
}
@media (max-width: 480px) {
  .jump-grid { grid-template-columns: 1fr 1fr; }
  .modal-backdrop { padding: 16px 8px; }
  .modal-body { padding: 16px; }
  .video-grid { grid-template-columns: 1fr; }
}
</style>
