<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  totalDuration: number
}>()

const emit = defineEmits<{
  updateDuration: [duration: number]
  addTrack: []
}>()

const localDuration = ref(props.totalDuration)

watch(() => props.totalDuration, (val) => {
  localDuration.value = val
})

const handleDurationChange = () => {
  emit('updateDuration', localDuration.value)
}
</script>

<template>
  <div class="timeline-controls">
    <label>
      Total Duration:
      <input 
        type="number" 
        v-model.number="localDuration"
        @change="handleDurationChange"
        min="1"
        max="30"
        step="1"
      />s
    </label>
    <button class="add-track-btn" @click="emit('addTrack')">+ Add Track</button>
  </div>
</template>

<style scoped>
.timeline-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.timeline-controls label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timeline-controls input[type="number"] {
  width: 60px;
  padding: 0.25rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.add-track-btn {
  padding: 0.5rem 1rem;
  background: var(--action-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.add-track-btn:hover {
  background: var(--action-color-hover);
}
</style>
