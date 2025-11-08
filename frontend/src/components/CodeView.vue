<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Shape } from '@/types/shapes'

const props = defineProps<{
  shapes: Shape[]
}>()

const copied = ref(false)
const isExpanded = ref(false)

const svgCode = computed(() => {
  let code = '<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">\n'
  
  props.shapes.forEach(shape => {
    if (shape.type === 'rectangle') {
      code += `  <rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${shape.fill}" />\n`
    } else if (shape.type === 'circle') {
      code += `  <circle cx="${shape.x}" cy="${shape.y}" r="${shape.radius}" fill="${shape.fill}" />\n`
    } else if (shape.type === 'line') {
      code += `  <line x1="${shape.x}" y1="${shape.y}" x2="${shape.x2}" y2="${shape.y2}" stroke="${shape.fill}" stroke-width="3" />\n`
    } else if (shape.type === 'ellipse') {
      code += `  <ellipse cx="${shape.x}" cy="${shape.y}" rx="${shape.radiusX}" ry="${shape.radiusY}" fill="${shape.fill}" />\n`
    }
  })
  
  code += '</svg>'
  return code
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(svgCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="code-view">
    <div class="header">
      <h3>SVG Code</h3>
      <div class="header-buttons">
        <button class="expand-btn" @click="isExpanded = !isExpanded" :title="isExpanded ? 'Collapse' : 'Expand'">
          {{ isExpanded ? '←' : '→' }}
        </button>
        <button class="copy-btn" @click="copyToClipboard">
          {{ copied ? '✓ Copied!' : 'Copy' }}
        </button>
      </div>
    </div>
    <div class="code-container" :class="{ expanded: isExpanded }">
      <highlightjs language='xml' :code="svgCode" class="code" />
    </div>
  </div>
</template>

<style scoped>
.code-view {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

h3 {
  font-size: 1rem;
  color: #333;
}

.header-buttons {
  display: flex;
  gap: 0.5rem;
}

.expand-btn {
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;
}

.expand-btn:hover {
  background: #5a6268;
}

.copy-btn {
  background: var(--action-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s ease;
}

.copy-btn:hover {
  background: var(--action-color-hover);
}

.code-container {
  flex: 1;
  overflow: auto;
  position: relative;
}

.code-container.expanded {
  overflow: visible;
}

.code {
  background: #282c34;
  color: #abb2bf;
  padding: 1rem;
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 4px;
  white-space: pre;
}

.code-container.expanded .code {
  position: absolute;
  left: 0;
  top: 0;
  width: max-content;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

code {
  color: #61afef;
}
</style>
