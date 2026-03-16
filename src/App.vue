<script setup>
import { useRouter } from 'vue-router'
import isAuthenticated, { clearAuthentication } from '@/authenticate'

const router = useRouter()

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
      <a class="navbar-brand">Sun Safety Awareness</a>
      <nav class="nav-links">
        <router-link to="/Home" class="nav-link">Home</router-link>
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

header {
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.navbar-brand {
  font-weight: 700;
  position: relative;
  padding-left: 40px;
  display: inline-block;
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
  background:
    conic-gradient(from 140deg, #60a5fa, #818cf8, #22d3ee, #60a5fa);
  box-shadow:
    0 8px 16px rgba(59, 130, 246, 0.35),
    0 0 14px rgba(56, 189, 248, 0.3);
}

.navbar-brand::after {
  content: 'UV alert · sun-safe decisions';
  display: block;
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.6);
  margin-top: 2px;
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
}

.nav-link:hover,
button.nav-link:hover {
  color: #007bff;
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
