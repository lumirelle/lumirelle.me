<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text?: string
    preset?: 'purple' | 'amber' | 'blue' | 'green' | 'red'
  }>(),
  {
    preset: 'blue',
  },
)

const bgColor = computed(() => {
  switch (props.preset) {
    case 'purple': {
      return 'bg-purple'
    }
    case 'amber': {
      return 'bg-amber'
    }
    case 'blue': {
      return 'bg-blue'
    }
    case 'green': {
      return 'bg-green'
    }
    case 'red': {
      return 'bg-red'
    }
    default: {
      return 'bg-transparent'
    }
  }
})

const textColor = computed(() => {
  switch (props.preset) {
    case 'purple':
    case 'amber':
    case 'blue':
    case 'green':
    case 'red': {
      return 'text-white'
    }
    default: {
      return 'text-inherit'
    }
  }
})
</script>

<template>
  <span

    text-sm font-medium mx-1 px-2 py-0.5 rounded-md inline-block
    :class="[bgColor, textColor]"
  >{{ text }}</span>
</template>
