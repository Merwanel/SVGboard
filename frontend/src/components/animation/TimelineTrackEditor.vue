<script setup lang="ts">
import type { AnimationTrack, AnimationType } from '@/types/shapes'

defineProps<{
  track: AnimationTrack
}>()

const emit = defineEmits<{
  updateType: [type: AnimationType]
  updateValues: [key: string, value: number]
  remove: []
}>()
</script>

<template>
  <div class="track-editor">
    <h4>Edit {{ track.type.charAt(0).toUpperCase() + track.type.slice(1) }}</h4>
    
    <div class="editor-field">
      <label>Type</label>
      <select 
        :value="track.type" 
        @change="emit('updateType', ($event.target as HTMLSelectElement).value as AnimationType)"
      >
        <option value="rotate">Rotate</option>
        <option value="scale">Scale</option>
        <option value="fade">Fade</option>
        <option value="translate">Translate</option>
      </select>
    </div>

    <div v-if="track.type === 'rotate'" class="editor-values">
      <div class="editor-field">
        <label>From</label>
        <input 
          type="number" 
          :value="track.values.from"
          @input="emit('updateValues', 'from', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="unit">degrees</span>
      </div>
      <div class="editor-field">
        <label>To</label>
        <input 
          type="number" 
          :value="track.values.to"
          @input="emit('updateValues', 'to', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="unit">degrees</span>
      </div>
    </div>

    <div v-if="track.type === 'scale'" class="editor-values">
      <div class="editor-field">
        <label>From</label>
        <input 
          type="number" 
          step="0.1"
          :value="track.values.from"
          @input="emit('updateValues', 'from', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="unit">×</span>
      </div>
      <div class="editor-field">
        <label>To</label>
        <input 
          type="number" 
          step="0.1"
          :value="track.values.to"
          @input="emit('updateValues', 'to', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="unit">×</span>
      </div>
    </div>

    <div v-if="track.type === 'fade'" class="editor-values">
      <div class="editor-field">
        <label>From</label>
        <input 
          type="number" 
          step="0.1"
          min="0"
          max="1"
          :value="track.values.from"
          @input="emit('updateValues', 'from', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="unit">opacity</span>
      </div>
      <div class="editor-field">
        <label>To</label>
        <input 
          type="number" 
          step="0.1"
          min="0"
          max="1"
          :value="track.values.to"
          @input="emit('updateValues', 'to', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="unit">opacity</span>
      </div>
    </div>

    <div v-if="track.type === 'translate'" class="editor-values">
      <div class="editor-field">
        <label>X</label>
        <input 
          type="number" 
          :value="track.values.x"
          @input="emit('updateValues', 'x', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="unit">px</span>
      </div>
      <div class="editor-field">
        <label>Y</label>
        <input 
          type="number" 
          :value="track.values.y"
          @input="emit('updateValues', 'y', Number(($event.target as HTMLInputElement).value))"
        />
        <span class="unit">px</span>
      </div>
    </div>

    <button class="remove-track-btn-editor" @click="emit('remove')">
      Remove Track
    </button>
  </div>
</template>

<style scoped>
.track-editor {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.track-editor h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: var(--text-primary);
  font-weight: 600;
}

.editor-field {
  margin-bottom: 0.75rem;
}

.editor-field label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.editor-field select,
.editor-field input {
  width: 100%;
  padding: 0.4rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.75rem;
}

.editor-field input[type="number"] {
  width: calc(100% - 40px);
  display: inline-block;
}

.editor-field .unit {
  display: inline-block;
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
  width: 35px;
}

.editor-values {
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.remove-track-btn-editor {
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 0, 0, 0.1);
  color: #ff4444;
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background 0.2s ease;
}

.remove-track-btn-editor:hover {
  background: rgba(255, 0, 0, 0.2);
}
</style>
