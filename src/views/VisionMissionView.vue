<template>
  <section class="vision-mission-page">
    <div class="content-shell">
      <header class="page-hero">
        <h1>Vision & Mission</h1>
        <p>Our purpose and long-term direction for wildlife-safe cat ownership in suburban Victoria.</p>
      </header>

      <section class="card">
        <h2>Mission</h2>
        <p>
          To make the hidden wildlife impact of roaming pet cats visible, empowering suburban Victorian cat owners to
          take meaningful action through data-driven tools.
        </p>
        <p>
          We connect everyday pet ownership to real ecological data via interactive maps and live impact dashboards,
          helping owners in suburban Victoria understand how their cats interact with locally threatened native species
          and giving them the tools to change their behaviour.
        </p>
      </section>

      <section class="card">
        <h2>Vision</h2>
        <p>A suburban Victoria where every cat owner understands their pet's ecological footprint, and chooses to protect it.</p>
        <p>
          We envision a future where data-driven tools close the gap between pet love and wildlife conservation where
          no threatened Victorian species is silently lost because its neighborhood cats go unmonitored.
        </p>
      </section>
    </div>
  </section>
</template>

<style scoped>
.vision-mission-page {
  min-height: calc(100dvh - 90px);
  background: linear-gradient(180deg, #edf3ed 0%, #f8faf7 100%);
  padding: 14px;
}

.content-shell {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  border-radius: 16px;
  border: 1px solid #cbd6cc;
  background: #f6f7f5;
  box-shadow: 0 10px 28px rgba(26, 64, 45, 0.12);
  overflow: hidden;
}

.page-hero {
  background: linear-gradient(90deg, #133d2b 0%, #1b4a32 70%, #245b3a 100%);
  color: #eff6f0;
  padding: 16px 14px;
}

.page-hero h1 {
  font-size: 1.55rem;
  font-weight: 800;
  line-height: 1.1;
}

.page-hero p {
  margin-top: 8px;
  color: #d9e8dd;
  font-size: 0.95rem;
}

.card {
  margin: 14px;
  border-radius: 14px;
  border: 1px solid #d4ddd5;
  background: #ffffff;
  padding: 14px;
}

.card h2 {
  color: #1d4332;
  font-size: 1.2rem;
  font-weight: 800;
}

.card p {
  margin-top: 10px;
  color: #41554b;
  line-height: 1.65;
}

@media (max-width: 760px) {
  .vision-mission-page {
    padding: 8px;
  }
}
</style>
