import { ref, computed, watch, type Ref } from 'vue'
import { useSnapshots } from './useSnapshots'
import type { Shape } from '@/types/shapes'

export function useSaveManager(projectId: Ref<number | null>, shapes: Ref<Shape[]>) {
  const { createSnapshot, error: snapshotError } = useSnapshots()
  
  const hasUnsavedChanges = ref(false)
  const isSaving = ref(false)
  const autoSaveEnabled = ref(true)
  const lastSaveType = ref<'manual' | 'auto'>('manual')
  
  let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null

  watch(shapes, () => {
    hasUnsavedChanges.value = true
    
    if (autoSaveEnabled.value && projectId.value && !isSaving.value) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
      
      autoSaveTimeout = setTimeout(async () => {
        if (hasUnsavedChanges.value && projectId.value && !isSaving.value) {
          await save('auto')
        }
      }, 2000)
    }
  }, { deep: true })

  const save = async (type: 'manual' | 'auto' = 'manual') => {
    if (!projectId.value || isSaving.value) {
      return
    }

    isSaving.value = true

    try {
      await createSnapshot(projectId.value, shapes.value)
      hasUnsavedChanges.value = false
      lastSaveType.value = type
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      isSaving.value = false
    }
  }

  const toggleAutoSave = () => {
    autoSaveEnabled.value = !autoSaveEnabled.value
    
    if (autoSaveEnabled.value && hasUnsavedChanges.value && projectId.value && !isSaving.value) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout)
      }
      autoSaveTimeout = setTimeout(async () => {
        if (hasUnsavedChanges.value && projectId.value && !isSaving.value) {
          await save('auto')
        }
      }, 2000)
    } else if (!autoSaveEnabled.value && autoSaveTimeout) {
      clearTimeout(autoSaveTimeout)
      autoSaveTimeout = null
    }
  }

  const markAsSaved = () => {
    hasUnsavedChanges.value = false
  }

  const statusClass = computed(() => {
    if (snapshotError.value) return 'error'
    if (isSaving.value) return 'saving'
    if (hasUnsavedChanges.value) return 'unsaved'
    return 'saved'
  })

  const statusText = computed(() => {
    if (snapshotError.value) return `Error: ${snapshotError.value}`
    if (isSaving.value) return 'Saving...'
    if (hasUnsavedChanges.value) {
      return autoSaveEnabled.value ? 'Auto-saving...' : 'Unsaved changes'
    }
    if (lastSaveType.value === 'auto') return 'Auto-saved'
    return 'Saved'
  })

  const showSaveButton = computed(() => {
    return hasUnsavedChanges.value && !autoSaveEnabled.value
  })

  return {
    // State
    hasUnsavedChanges,
    isSaving,
    autoSaveEnabled,
    lastSaveType,
    
    // Computed
    statusClass,
    statusText,
    showSaveButton,
    
    // Actions
    save,
    toggleAutoSave,
    markAsSaved
  }
}
