<template>
  <div :class="[colors[type], sizes[size], 'rounded shadow-sm']" />
</template>

<script setup lang="ts">
  interface Props {
    type: 'metal' | 'crystal' | 'deuterium' | 'darkMatter' | 'energy'
    size?: 'sm' | 'md' | 'lg'
  }

  const props = withDefaults(defineProps<Props>(), {
    size: 'md'
  })

  const colors = {
    metal: 'bg-gradient-to-br from-slate-400 to-slate-600',
    crystal: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    deuterium: 'bg-gradient-to-br from-green-400 to-emerald-600',
    darkMatter: 'bg-gradient-to-br from-purple-600 to-indigo-900',
    energy: 'bg-gradient-to-br from-yellow-400 to-orange-500'
  }

  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
</script>
