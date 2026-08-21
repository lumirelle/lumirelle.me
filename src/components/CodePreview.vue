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
    sandbox: 'allow-scripts allow-same-origin',
  },
)

const frame = ref<HTMLIFrameElement | null>(null)
const srcdoc = ref('')

onMounted(() => {
  const bytes = Uint8Array.from(globalThis.atob(props.code), c => c.charCodeAt(0))
  const html = new TextDecoder().decode(bytes)
  srcdoc.value = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    body{margin:0;font-family:system-ui,sans-serif;padding:12px;${props.headStyle}}
  </style></head><body>${html}</body></html>`
})

function onLoad(): void {
  const doc = frame.value?.contentDocument
  if (!doc)
    return

  const parent = window.parent.document.documentElement
  const apply = () => {
    const dark = parent.classList.contains('dark')
    doc.documentElement.style.background = dark ? '#050505' : '#fff'
    doc.body.style.color = dark ? '#e0e0e0' : '#111'
  }

  apply()

  new MutationObserver(apply).observe(parent, {
    attributes: true,
    attributeFilter: ['class'],
  })

  const h = doc.body.scrollHeight
  if (h)
    frame.value!.style.height = `${h + 24}px`
}
</script>

<template>
  <iframe
    ref="frame"
    title="HTML preview"
    :srcdoc="srcdoc"
    :sandbox="sandbox"
    class="border border-base rounded-lg w-full"
    @load="onLoad"
  />
</template>
