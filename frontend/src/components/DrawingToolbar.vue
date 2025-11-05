<script setup lang="ts">
import { ref } from 'vue'

const isCollapsed = ref(false)

const emit = defineEmits<{
  toolSelected: [tool: 'rectangle' | 'circle' | 'line' | null]
}>()

const selectedTool = ref<'rectangle' | 'circle' | 'line' | null>(null)

const selectTool = (tool: 'rectangle' | 'circle' | 'line') => {
  selectedTool.value = selectedTool.value === tool ? null : tool
  emit('toolSelected', selectedTool.value)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
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
    </div>
  </div>
</template>

<style scoped>
.toolbar {
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  padding: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  transition: all 0.3s ease;
}

.toolbar.collapsed {
  padding: 0.25rem;
}

.collapse-btn {
  background: #42b983;
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
  background: #35a372;
}

.tools {
  display: flex;
  gap: 0.5rem;
}

.tool-btn {
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  width: 48px;
  height: 48px;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  border-color: #42b983;
  background: #f0f9f5;
}

.tool-btn.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}
</style>
