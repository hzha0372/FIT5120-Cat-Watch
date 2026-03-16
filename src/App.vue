<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import isAuthenticated, { clearAuthentication } from '@/authenticate'

const router = useRouter()
const logoFailed = ref(false)

const logout = async () => {
  clearAuthentication()
  await router.replace('/Login')
}
</script>

<template>
  <div>
    <!-- Navbar -->
    <header
      v-if="isAuthenticated"
      class="navbar bg-light px-3"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="brand">
        <img
          v-if="!logoFailed"
          class="brand-logo"
          src="/sunsafety-logo.png"
          alt="Sun Safety logo"
          @error="logoFailed = true"
        />
        <div class="brand-text">
          <div class="brand-title">Sun Safety Awareness</div>
          <div class="brand-tagline">Feel the Sun, Not the Burn</div>
        </div>
      </div>
      <nav class="nav-links">
        <router-link to="/Home" class="nav-link">Home</router-link>
        <router-link to="/Awareness" class="nav-link">Awareness</router-link>
        <button class="nav-link" type="button" @click="logout">Logout</button>
      </nav>
    </header>

    <!-- Router View -->
    <main style="margin-top: 20px">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.brand-title {
  font-weight: 900;
}

.brand-tagline {
  font-size: 0.9rem;
  color: rgba(15, 23, 42, 0.7);
}

.nav-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.nav-link {
  text-decoration: none;
  color: #000;
  font-weight: 500;
  transition: transform 160ms ease, color 160ms ease;
}

.nav-link:hover,
button.nav-link:hover {
  color: #007bff;
  transform: translateY(-1px);
}

button.nav-link {
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  padding: 0;
}

@media (max-width: 768px) {
  .nav-links {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
