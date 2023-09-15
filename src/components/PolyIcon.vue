<template>
  <component
    :is="icon"
    :class="clsx('icon', classes)"
    :role="role"
    :style="style"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
  />
</template>

<script setup lang="ts">
import clsx from 'clsx'
import { type CSSProperties, defineAsyncComponent } from 'vue'

type PolyIconType = {
  classes?: string
  style?: Record<string, CSSProperties | string>
  role?: string
  name: string
}

const props = withDefaults(defineProps<PolyIconType>(), {
  role: 'img',
})

const icon = defineAsyncComponent(
  async () => await import(`../assets/icons/${props.name}.svg?svg`)
)
</script>

<style lang="scss">
.icon {
  display: flex;
  align-items: center;
  justify-content: center;

  aspect-ratio: 1 / 1;
  width: 1em;
  height: 1em;

  fill: currentcolor;
  stroke: currentcolor;
  stroke-width: 0;
}
</style>
