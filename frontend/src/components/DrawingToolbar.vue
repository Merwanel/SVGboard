<script setup lang="ts">
import { ref } from 'vue'
import WhiteboardCanvas from './WhiteboardCanvas.vue'
import type { Shape, ShapeType } from '@/types/shapes'

defineProps<{
  shapes: Shape[]
}>()

const isCollapsed = ref(false)
const selectedTool = ref<ShapeType | null>(null)

const emit = defineEmits<{
  shapesUpdated: [shapes: Shape[]]
}>()

const selectTool = (tool: ShapeType) => {
  selectedTool.value = selectedTool.value === tool ? null : tool
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleShapesUpdated = (shapes: Shape[]) => {
  emit('shapesUpdated', shapes)
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
      </div>
    </div>
    <WhiteboardCanvas 
      :selected-tool="selectedTool"
      :initial-shapes="shapes"
      @shapes-updated="handleShapesUpdated"
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
</style>
