<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    code?: string
    headStyle?: string
    sandbox?: string
  }>(),
  {
    code: '',
    headStyle: '',
    sandbox: 'allow-scripts',
  },
)

const slots = useSlots()
const hasSlot = computed(() => !!slots.default)
const container = ref<HTMLElement | null>(null)
const frame = ref<HTMLIFrameElement | null>(null)
const srcdoc = ref('')

onMounted(() => {
  const body = props.code || (hasSlot.value ? container.value?.innerHTML ?? '' : '')
  srcdoc.value = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;font-family:system-ui,sans-serif;padding:8px}${props.headStyle}</style></head><body>${body}</body></html>`
})

function resize(): void {
  const h = frame.value?.contentDocument?.body.scrollHeight
  if (h)
    frame.value!.style.height = `${h + 16}px`
}
</script>

<template>
  <div v-if="hasSlot" ref="container" class="hidden">
    <slot />
  </div>
  <iframe
    ref="frame"
    title="HTML preview"
    :srcdoc="srcdoc"
    :sandbox="sandbox"
    class="rounded-lg border-none w-full"
    @load="resize"
  />
</template>
