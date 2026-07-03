<script setup lang="ts">
import DeckShell from './DeckShell.vue'

withDefaults(defineProps<{
  /** Slot manages its own height/scroll (multi-column screens). */
  containedMain?: boolean
  /** Content column width: feed (2xl), wide (4xl), or full-bleed. */
  width?: 'feed' | 'wide' | 'full'
}>(), {
  containedMain: false,
  width: 'feed',
})
</script>

<template>
  <DeckShell>
    <div v-if="containedMain" class="h-full min-h-0">
      <slot />
    </div>
    <div v-else class="h-full min-h-0 overflow-y-auto overscroll-contain">
      <div
        class="mx-auto w-full"
        :class="width === 'feed' ? 'max-w-2xl md:px-4 md:py-3' : width === 'wide' ? 'max-w-4xl md:px-4 md:py-3' : ''"
      >
        <slot />
      </div>
    </div>
  </DeckShell>
</template>
