<script setup lang="ts">
import { ref } from 'vue'
import CodeView from './CodeView.vue'
import type { Shape } from '@/types/shapes'

const props = defineProps<{
  shapes: Shape[]
}>()

const isCollapsed = ref(false)
const activeView = ref<'code' | 'history' | 'browser'>('code')

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const setView = (view: 'code' | 'history' | 'browser') => {
  activeView.value = view
}
</script>

<template>
  <div class="left-panel" :class="{ collapsed: isCollapsed }">
    <div class="panel-content">
      <div class="tabs">
        <button 
          class="tab"
          :class="{ active: activeView === 'code' }"
          @click="setView('code')"
        >
          Code
        </button>
        <button 
          class="tab"
          :class="{ active: activeView === 'history' }"
          @click="setView('history')"
        >
          History
        </button>
        <button 
          class="tab"
          :class="{ active: activeView === 'browser' }"
          @click="setView('browser')"
        >
          Browser
        </button>
      </div>
      <div class="view-content">
        <CodeView v-if="activeView === 'code'" :shapes="shapes" />
        <div v-else-if="activeView === 'history'" class="placeholder">
          <p>History view</p>
        </div>
        <div v-else class="placeholder">
          <p>browser</p>
        </div>
      </div>
    </div>
    <button class="collapse-btn" @click="toggleCollapse">
      {{ isCollapsed ? '→' : '←' }}
    </button>
  </div>
</template>

<style scoped>
.left-panel {
  position: relative;
  width: 400px;
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  transition: width 0.3s ease;
  overflow: hidden;
}

.left-panel.collapsed {
  width: 50px;
}

.panel-content {
  padding: 1rem;
  opacity: 1;
  transition: opacity 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.left-panel.collapsed .panel-content {
  opacity: 0;
  pointer-events: none;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #ddd;
}

.tab {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
}

.tab:hover {
  color: #42b983;
}

.tab.active {
  color: #42b983;
  border-bottom-color: #42b983;
  font-weight: 600;
}

.view-content {
  flex: 1;
  overflow: auto;
}

.placeholder {
  padding: 2rem;
  text-align: center;
  color: #999;
}

.collapse-btn {
  position: absolute;
  top: 1rem;
  right: 0.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.collapse-btn:hover {
  background: #35a372;
}
</style>
