<template>
  <main style="padding: 20px">
    <h1 id="teen-header">Welcome to Teens' Resources</h1>
    <p>
      This page provides helpful tips and guidance to support teenagers’ mental health and
      wellbeing.
    </p>
    <Rating aria-labelledby="teen-header" />
  </main>
</template>

<script setup>
import Rating from '../components/Rating.vue'
</script>

<style scoped>
main {
  outline: none;
}
</style>
