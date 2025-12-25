<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'

// Load game data when authenticated
const { loggedIn } = useUserSession()
const gameStore = useGameStore()
const npcStore = useNPCStore()
const universeStore = useUniverseStore()

// Initialize game data on mount
onMounted(async () => {
  if (loggedIn.value) {
    await Promise.all([
      gameStore.loadGame(),
      npcStore.loadNPCs(),
      universeStore.loadUniverse()
    ])
  }
})

// Watch for login state changes
watch(loggedIn, async (isLoggedIn) => {
  if (isLoggedIn) {
    await Promise.all([
      gameStore.loadGame(),
      npcStore.loadNPCs(),
      universeStore.loadUniverse()
    ])
  }
})

// Auto-save game periodically
let saveInterval: NodeJS.Timeout | null = null

onMounted(() => {
  if (loggedIn.value) {
    // Auto-save every 30 seconds
    saveInterval = setInterval(() => {
      if (!gameStore.isSyncing) {
        gameStore.saveGame()
      }
    }, 30000)
  }
})

onUnmounted(() => {
  if (saveInterval) {
    clearInterval(saveInterval)
  }
})

// Save before page unload
if (import.meta.client) {
  window.addEventListener('beforeunload', () => {
    if (loggedIn.value) {
      gameStore.saveGame()
    }
  })
}
</script>

<style>
@import '~/assets/css/main.css';
</style>