<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  totalDuration: number
}>()

const timeMarkers = computed(() => {
  const markers = []
  for (let i = 0; i <= props.totalDuration; i++) {
    markers.push(i)
  }
  return markers
})
</script>

<template>
  <div class="time-markers">
    <div 
      v-for="marker in timeMarkers" 
      :key="marker"
      class="time-marker"
      :style="{ left: `${(marker / totalDuration) * 100}%` }"
    >
      {{ marker }}s
    </div>
  </div>
</template>

<style scoped>
.time-markers {
  position: relative;
  height: 20px;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.time-marker {
  position: absolute;
  top: 0;
  font-size: 0.625rem;
  color: var(--text-secondary);
  transform: translateX(-50%);
}
</style>
