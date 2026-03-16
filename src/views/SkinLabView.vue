<template>
  <main class="lab-shell" aria-label="Skin Lab">
    <header class="hero">
      <h1 class="hero-title">Skin Lab</h1>
      <p class="hero-subtitle">Choose a skin type to see how quickly UV can affect you and what protection level to use.</p>
    </header>

    <section class="card" aria-labelledby="tone-title">
      <div class="card-head">
        <h2 id="tone-title" class="card-title">Skin tone (Fitzpatrick scale)</h2>
        <p class="card-caption">This is a practical guide, not a diagnosis. Everyone needs protection when UV is 3 or above.</p>
      </div>

      <div class="swatches" role="radiogroup" aria-label="Select skin type">
        <button
          v-for="t in skinTones"
          :key="t.type"
          class="swatch"
          :class="{ 'swatch--active': selected === t.type }"
          :style="{ background: t.color }"
          :aria-pressed="selected === t.type"
          :aria-label="`Fitzpatrick Type ${t.type}`"
          @click="selected = t.type"
        >
          <span class="swatch-label">Type {{ t.type }}</span>
        </button>
      </div>

      <div v-if="active" class="panel" :style="{ borderLeftColor: active.color }">
        <div class="panel-top">
          <div class="panel-title">Fitzpatrick Type {{ active.type }} — {{ active.name }}</div>
          <div class="panel-badge" :class="`badge--${active.badgeKey}`">{{ active.sensitivity }}</div>
        </div>

        <div class="grid" aria-label="Skin sensitivity details">
          <div class="grid-item">
            <div class="grid-label">Burn tendency</div>
            <div class="grid-value">{{ active.burnTendency }}</div>
          </div>
          <div class="grid-item">
            <div class="grid-label">Tan tendency</div>
            <div class="grid-value">{{ active.tanTendency }}</div>
          </div>
          <div class="grid-item">
            <div class="grid-label">Suggested SPF</div>
            <div class="grid-value">{{ active.spf }}</div>
          </div>
          <div class="grid-item">
            <div class="grid-label">Extra note</div>
            <div class="grid-value">{{ active.note }}</div>
          </div>
        </div>

        <div class="tips" aria-label="Key tips">
          <div class="tips-title">Do this when UV is 3+</div>
          <ul class="tips-list">
            <li v-for="tip in active.tips" :key="tip">{{ tip }}</li>
          </ul>
        </div>
      </div>

      <div v-else class="placeholder">Select a skin type above to view your sensitivity guide.</div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'

const selected = ref(null)

const skinTones = [
  {
    type: 'I',
    name: 'Very fair',
    color: '#f6d1be',
    sensitivity: 'Very sensitive',
    badgeKey: 'high',
    burnTendency: 'Always burns easily',
    tanTendency: 'Never tans',
    spf: 'SPF50+',
    note: 'UV can cause redness quickly; avoid peak sun.',
    tips: ['Use SPF50+ daily in summer', 'Cover up (hat, sleeves)', 'Seek shade 10am–4pm'],
  },
  {
    type: 'II',
    name: 'Fair',
    color: '#f3c3a6',
    sensitivity: 'Sensitive',
    badgeKey: 'high',
    burnTendency: 'Usually burns',
    tanTendency: 'Tans minimally',
    spf: 'SPF50+',
    note: 'High risk in strong UV; protection is essential.',
    tips: ['SPF50+ on exposed skin', 'Reapply every 2 hours', 'Sunglasses and hat'],
  },
  {
    type: 'III',
    name: 'Light / medium',
    color: '#eab08f',
    sensitivity: 'Moderate',
    badgeKey: 'medium',
    burnTendency: 'Sometimes burns',
    tanTendency: 'Tans gradually',
    spf: 'SPF30–50+',
    note: 'Still at risk of long-term UV damage.',
    tips: ['Use sunscreen when UV 3+', 'Combine with clothing + shade', 'Check UV near midday'],
  },
  {
    type: 'IV',
    name: 'Olive / brown',
    color: '#d7926a',
    sensitivity: 'Lower (but not zero)',
    badgeKey: 'medium',
    burnTendency: 'Rarely burns',
    tanTendency: 'Tans easily',
    spf: 'SPF30–50+',
    note: 'Burn risk may be lower, but UV damage still accumulates.',
    tips: ['Protect during peak UV', 'Don’t rely on “not burning” as safety', 'Use sunglasses and hat'],
  },
  {
    type: 'V',
    name: 'Dark brown',
    color: '#b56c49',
    sensitivity: 'Lower (but present)',
    badgeKey: 'low',
    burnTendency: 'Very rarely burns',
    tanTendency: 'Tans very easily',
    spf: 'SPF30+',
    note: 'Skin cancer can still occur; early signs can be missed.',
    tips: ['Use sunscreen when UV 3+', 'Prioritise shade + clothing', 'Do regular skin checks'],
  },
  {
    type: 'VI',
    name: 'Deeply pigmented',
    color: '#7a3d22',
    sensitivity: 'Lowest (but present)',
    badgeKey: 'low',
    burnTendency: 'Almost never burns',
    tanTendency: 'Tans very easily',
    spf: 'SPF30+',
    note: 'UV still damages DNA; protection is still recommended.',
    tips: ['Use sunscreen and clothing', 'Don’t skip protection on high UV days', 'Seek advice for any new spots'],
  },
]

const active = computed(() => skinTones.find((t) => t.type === selected.value) || null)
</script>

<style scoped>
.lab-shell {
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
  background: linear-gradient(135deg, rgba(250, 204, 21, 0.18), rgba(14, 165, 233, 0.10));
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

.swatches {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.swatch {
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 14px;
  padding: 14px 10px;
  cursor: pointer;
  min-height: 72px;
  display: grid;
  place-items: center;
  font-weight: 900;
  color: rgba(15, 23, 42, 0.92);
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.swatch:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.12);
}

.swatch--active {
  outline: 3px solid rgba(14, 165, 233, 0.40);
}

.panel {
  margin-top: 14px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.10);
  border-left: 6px solid rgba(14, 165, 233, 0.6);
  padding: 14px;
  background: rgba(15, 23, 42, 0.02);
}

.panel-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-title {
  font-weight: 900;
}

.panel-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 900;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: rgba(255, 255, 255, 0.7);
}

.badge--high {
  color: #b91c1c;
}

.badge--medium {
  color: #a16207;
}

.badge--low {
  color: #0369a1;
}

.grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.grid-item {
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.7);
}

.grid-label {
  color: rgba(15, 23, 42, 0.6);
  font-weight: 800;
  font-size: 0.9rem;
}

.grid-value {
  margin-top: 4px;
  font-weight: 900;
}

.tips {
  margin-top: 12px;
}

.tips-title {
  font-weight: 900;
}

.tips-list {
  margin: 8px 0 0;
  padding-left: 18px;
  color: rgba(15, 23, 42, 0.85);
}

.placeholder {
  margin-top: 12px;
  padding: 12px;
  border-radius: 14px;
  border: 1px dashed rgba(15, 23, 42, 0.25);
  color: rgba(15, 23, 42, 0.7);
  background: rgba(15, 23, 42, 0.02);
}

@media (max-width: 860px) {
  .swatches {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
