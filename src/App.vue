<script setup>
import { useRouter, useRoute } from 'vue-router'
import isAuthenticated, { clearAuthentication } from '@/authenticate'

const router = useRouter()
const route = useRoute()

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
      class="navbar"
      role="navigation"
      aria-label="Main navigation"
    >
      <a class="navbar-brand">Sun Safety Awareness</a>

      <nav class="nav-links">
        <router-link to="/Home" class="nav-link" :class="{ 'nav-link--active': route.path === '/Home' || route.path === '/home' }">
          <span class="nav-link-inner">Home</span>
        </router-link>
        <router-link to="/Awareness" class="nav-link" :class="{ 'nav-link--active': route.path === '/Awareness' }">
          <span class="nav-link-inner">UV Awareness</span>
        </router-link>
        <button class="nav-link nav-link--logout" type="button" @click="logout">
          <span class="nav-link-inner">Logout</span>
        </button>
      </nav>
    </header>

    <!-- Router View with page transition -->
    <main class="page-wrap">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
:global(html),
:global(body),
:global(#app) {
  min-height: 100%;
  background:
    radial-gradient(900px 520px at 12% -10%, rgba(255, 176, 120, 0.45), transparent 60%),
    radial-gradient(900px 520px at 88% 0%, rgba(120, 210, 255, 0.5), transparent 60%),
    radial-gradient(1100px 600px at 50% 105%, rgba(186, 162, 255, 0.4), transparent 60%),
    linear-gradient(180deg, #fff2df 0%, #f0f7ff 45%, #f3f1ff 100%) !important;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
}

/* ── Navbar ──────────────────────────────────────────────────────────── */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  font-weight: 700;
  font-size: 1rem;
  position: relative;
  padding-left: 40px;
  display: inline-block;
  line-height: 1.5;
}

.navbar-brand::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 28px;
  height: 28px;
  transform: translateY(-50%);
  border-radius: 7px;
  background: conic-gradient(from 140deg, #60a5fa, #818cf8, #22d3ee, #60a5fa);
  box-shadow:
    0 8px 16px rgba(59, 130, 246, 0.35),
    0 0 14px rgba(56, 189, 248, 0.3);
}

.navbar-brand::after {
  content: 'UV alert · sun-safe decisions';
  display: block;
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.55);
  margin-top: 1px;
}

/* ── Nav links ───────────────────────────────────────────────────────── */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: rgba(15, 23, 42, 0.65);
  font-weight: 600;
  font-size: 0.92rem;
  padding: 6px 14px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.2s ease, background 0.2s ease;
}

/* Underline indicator */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 60%;
  height: 2px;
  border-radius: 999px;
  background: #0ea5e9;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.nav-link:hover {
  color: rgba(15, 23, 42, 0.9);
  background: rgba(15, 23, 42, 0.05);
}

/* Active state */
.nav-link--active {
  color: #0369a1 !important;
  background: rgba(14, 165, 233, 0.10) !important;
  font-weight: 700;
}

.nav-link--active::after {
  transform: translateX(-50%) scaleX(1);
}

/* Logout button subtle style */
.nav-link--logout {
  color: rgba(15, 23, 42, 0.50);
}

.nav-link--logout:hover {
  color: #b91c1c;
  background: rgba(239, 68, 68, 0.07);
}

.nav-link-inner {
  position: relative;
  z-index: 1;
}

/* ── Page transition ─────────────────────────────────────────────────── */
.page-wrap {
  margin-top: 0;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 768px) {
  .navbar {
    padding: 10px 16px;
    gap: 10px;
  }
  .nav-links {
    gap: 2px;
  }
  .nav-link {
    padding: 5px 10px;
    font-size: 0.86rem;
  }
}
</style>
