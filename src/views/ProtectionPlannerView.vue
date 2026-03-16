<template>
  <main class="planner-shell" aria-label="Protection Planner">
    <header class="hero">
      <h1 class="hero-title">Protection Planner</h1>
      <p class="hero-subtitle">Simple sunscreen + clothing guidance you can act on quickly.</p>
    </header>

    <section class="card" aria-labelledby="sunscreen-title">
      <div class="card-head">
        <h2 id="sunscreen-title" class="card-title">Sunscreen planner</h2>
        <p class="card-caption">Use this when UV is 3 or above.</p>
      </div>

      <div class="grid" aria-label="Sunscreen guidance">
        <div class="box">
          <div class="label">Recommended SPF</div>
          <div class="value">SPF50 / SPF50+</div>
          <div class="detail">Broad spectrum, water resistant for sport/swimming.</div>
        </div>
        <div class="box">
          <div class="label">How much (adult body)</div>
          <div class="value">7 teaspoons</div>
          <div class="detail">1 tsp per arm/leg, 1 front, 1 back, 1 face/neck.</div>
        </div>
        <div class="box">
          <div class="label">Reapply</div>
          <div class="value">Every 2 hours</div>
          <div class="detail">Reapply after swimming, sweating, or towel drying.</div>
        </div>
      </div>

      <div class="note">Tip: apply 20 minutes before going outside.</div>
    </section>

    <section class="card" aria-labelledby="clothing-title">
      <div class="card-head">
        <h2 id="clothing-title" class="card-title">Clothing guide</h2>
        <p class="card-caption">Build a “cover + shade” habit for peak UV hours.</p>
      </div>

      <div class="table" role="table" aria-label="Clothing recommendations">
        <div class="row head" role="row">
          <div role="columnheader">Protection</div>
          <div role="columnheader">What to wear/do</div>
        </div>
        <div class="row" role="row">
          <div role="cell" class="k">Hat</div>
          <div role="cell" class="v">Broad-brim or legionnaire hat.</div>
        </div>
        <div class="row" role="row">
          <div role="cell" class="k">Top</div>
          <div role="cell" class="v">Long sleeves, tighter weave fabric; consider UPF-rated clothing.</div>
        </div>
        <div class="row" role="row">
          <div role="cell" class="k">Sunglasses</div>
          <div role="cell" class="v">Look for UV400 / AS/NZS compliant lenses.</div>
        </div>
        <div class="row" role="row">
          <div role="cell" class="k">Shade</div>
          <div role="cell" class="v">Prioritise shade between 10am–4pm.</div>
        </div>
      </div>
    </section>

    <section class="card" aria-labelledby="quick-title">
      <div class="card-head">
        <h2 id="quick-title" class="card-title">Quick checklist</h2>
        <p class="card-caption">If UV is high, do at least 3 of these.</p>
      </div>

      <div class="check-grid" aria-label="Protection checklist">
        <label v-for="c in checklist" :key="c" class="check">
          <input v-model="checked" type="checkbox" :value="c" />
          <span>{{ c }}</span>
        </label>
      </div>

      <div v-if="checked.length" class="score">You selected <strong>{{ checked.length }}</strong> items.</div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

const checklist = [
  'Apply sunscreen to exposed skin',
  'Wear a hat',
  'Wear sunglasses',
  'Use long sleeves / UPF clothing',
  'Seek shade during peak hours',
  'Bring water and take breaks',
]

const checked = ref([])
</script>

<style scoped>
.planner-shell {
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
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.14), rgba(14, 165, 233, 0.10));
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

.grid {
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

.note {
  margin-top: 12px;
  color: rgba(15, 23, 42, 0.75);
  font-weight: 700;
}

.table {
  display: grid;
  gap: 8px;
}

.row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.7);
}

.row.head {
  background: rgba(15, 23, 42, 0.04);
  font-weight: 900;
}

.k {
  font-weight: 900;
}

.v {
  color: rgba(15, 23, 42, 0.8);
}

.check-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.check {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(15, 23, 42, 0.02);
  font-weight: 800;
}

.score {
  margin-top: 12px;
  color: rgba(15, 23, 42, 0.8);
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .row {
    grid-template-columns: 1fr;
  }
  .check-grid {
    grid-template-columns: 1fr;
  }
}
</style>
