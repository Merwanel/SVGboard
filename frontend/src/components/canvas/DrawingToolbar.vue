<script setup lang="ts">
import { ref } from 'vue'
import WhiteboardCanvas from './WhiteboardCanvas.vue'
import type { Shape, Tool } from '@/types/shapes'

defineProps<{
  shapes: Shape[]
}>()

const isCollapsed = ref(false)
const selectedTool = ref<Tool>('select')
const strokeColor = ref('#000000')
const fillColor = ref('#42b983')
const noFill = ref(true)

const emit = defineEmits<{
  shapesUpdated: [shapes: Shape[]]
  shapeSelected: [shapeId: number | null]
}>()

const selectTool = (tool: Tool) => {
  selectedTool.value = tool
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleShapesUpdated = (shapes: Shape[]) => {
  emit('shapesUpdated', shapes)
}

const handleShapeSelected = (shapeId: number | null) => {
  emit('shapeSelected', shapeId)
}
</script>

<template>
  <div class="toolbar-container">
    <div class="toolbar" :class="{ collapsed: isCollapsed }">
      <button class="collapse-btn" @click="toggleCollapse">
        {{ isCollapsed ? '▼' : '▲' }}
      </button>
      <div class="tools" v-show="!isCollapsed">
        <button 
          class="tool-btn"
          :class="{ active: selectedTool === 'select' }"
          @click="selectTool('select')"
          title="Select"
        >
          ↖
        </button>
        <button 
          class="tool-btn"
          :class="{ active: selectedTool === 'rectangle' }"
          @click="selectTool('rectangle')"
          title="Rectangle"
        >
          ▭
        </button>
        <button 
          class="tool-btn"
          :class="{ active: selectedTool === 'circle' }"
          @click="selectTool('circle')"
          title="Circle"
        >
          ○
        </button>
        <button 
          class="tool-btn"
          :class="{ active: selectedTool === 'line' }"
          @click="selectTool('line')"
          title="Line"
        >
          ╱
        </button>
        <button 
          class="tool-btn"
          :class="{ active: selectedTool === 'ellipse' }"
          @click="selectTool('ellipse')"
          title="Ellipse"
        >
          ⬭
        </button>
        <div class="color-picker-wrapper">
          <label for="stroke-color" class="color-label">Stroke</label>
          <input 
            id="stroke-color"
            type="color" 
            v-model="strokeColor"
            class="color-picker"
            title="Stroke color"
          />
        </div>
        <div class="color-picker-wrapper">
          <label for="fill-color" class="color-label">Fill</label>
          <input 
            id="fill-color"
            type="color" 
            v-model="fillColor"
            class="color-picker"
            :disabled="noFill"
            title="Fill color"
          />
          <label class="no-fill-label">
            <input type="checkbox" v-model="noFill" />
            None
          </label>
        </div>
      </div>
    </div>
    <WhiteboardCanvas 
      :selected-tool="selectedTool"
      :stroke-color="strokeColor"
      :fill-color="noFill ? 'none' : fillColor"
      :initial-shapes="shapes"
      @shapes-updated="handleShapesUpdated"
      @shape-selected="handleShapeSelected"
    />
  </div>
</template>

<style scoped>
.toolbar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.toolbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.toolbar.collapsed {
  padding: 0.25rem;
}

.collapse-btn {
  background: var(--action-color);
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s ease;
}

.collapse-btn:hover {
  background: var(--action-color-hover);
}

.tools {
  display: flex;
  gap: 0.5rem;
}

.tool-btn {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  border-radius: 4px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  border-color: var(--action-color);
  background: var(--bg-secondary);
}

.tool-btn.active {
  background: var(--action-color);
  color: white;
  border-color: var(--action-color);
}

.color-picker-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.color-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.color-picker {
  width: 48px;
  height: 48px;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
  background: none;
}

.color-picker:hover {
  border-color: var(--action-color);
}

.color-picker:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-fill-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}
</style>
