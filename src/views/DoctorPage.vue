<template>
  <main style="padding: 20px">
    <h1 id="doctor-header">Welcome to Doctors' Resources</h1>
    <p>
      This page provides guidance and mental health support materials for doctors working with young
      people.
    </p>
    <Rating aria-labelledby="doctor-header" />
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
