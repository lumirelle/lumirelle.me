<script setup lang="ts">
const props = defineProps<{
  text?: string
  slice?: [number, number]
}>()

const { copy: _copy, copied } = useClipboard()
const el = ref<HTMLElement | null>(null)

function copy(): void {
  _copy(props.text ?? (el.value?.textContent || '').trim().slice(...(props.slice || [0])))
}
</script>

<template>
  <div ref="el" class="items-center gap-1">
    <slot />
    <button
      title="Copy"

      ml2 inline text-sm op30 transition hover:op100
      :class="copied ? 'i-carbon-checkmark text-green' : 'i-carbon-copy'"
      @click="copy()"
    />
  </div>
</template>
