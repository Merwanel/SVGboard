<script setup lang="ts">
import { ref } from 'vue'
import type { AnimationType } from '@/types/shapes'

const props = defineProps<{
  selectedShapeId: number | null
}>()

const emit = defineEmits<{
  applyAnimation: [shapeId: number, type: AnimationType, duration: number, loop: boolean]
}>()

const animationType = ref<AnimationType>('rotate')
const duration = ref(2)
const loop = ref(true)

const applyAnimation = () => {
  if (props.selectedShapeId === null) return
  emit('applyAnimation', props.selectedShapeId, animationType.value, duration.value, loop.value)
}
</script>

<template>
  <div class="animation-panel">
    <h3>Animation</h3>
    
    <div v-if="selectedShapeId === null" class="no-selection">
      Select a shape to add animation
    </div>
    
    <div v-else class="controls">
      <div class="control-group">
        <label for="animation-type">Type</label>
        <select id="animation-type" v-model="animationType">
          <option value="rotate">Rotate</option>
          <option value="scale">Scale</option>
          <option value="fade">Fade</option>
        </select>
      </div>
      
      <div class="control-group">
        <label for="duration">Duration ({{ duration }}s)</label>
        <input 
          id="duration"
          type="range" 
          v-model.number="duration"
          min="0.5"
          max="10"
          step="0.5"
        />
      </div>
      
      <div class="control-group">
        <label>
          <input type="checkbox" v-model="loop" />
          Loop
        </label>
      </div>
      
      <button class="apply-btn" @click="applyAnimation">
        Apply Animation
      </button>
    </div>
  </div>
</template>

<style scoped>
.animation-panel {
  padding: 1rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

h3 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.no-selection {
  padding: 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.control-group label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.875rem;
}

input[type="range"] {
  width: 100%;
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}

.apply-btn {
  padding: 0.75rem;
  background: var(--action-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.apply-btn:hover {
  background: var(--action-color-hover);
}
</style>
