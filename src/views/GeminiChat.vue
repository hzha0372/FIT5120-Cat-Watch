<template>
  <div style="max-width: 700px; margin: 40px auto; text-align: center">
    <h2>💬 Gemini AI Chat</h2>

    <textarea
      v-model="userInput"
      placeholder="Ask Gemini anything..."
      rows="4"
      style="width: 100%; padding: 8px; margin-top: 16px"
    ></textarea>

    <button @click="askGemini" :disabled="loading" style="margin-top: 12px; padding: 8px 20px">
      {{ loading ? 'Thinking...' : 'Ask Gemini' }}
    </button>

    <div
      v-if="response"
      style="
        margin-top: 20px;
        text-align: left;
        background: #f9f9f9;
        padding: 12px;
        border-radius: 8px;
      "
    >
      <h4>🤖 Gemini's Response:</h4>
      <p>{{ response }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { generateText } from '@/services/gemini'

const userInput = ref('')
const response = ref('')
const loading = ref(false)

const askGemini = async () => {
  if (!userInput.value.trim()) return alert('Please enter a question.')
  loading.value = true
  response.value = await generateText(userInput.value)
  loading.value = false
}
</script>
