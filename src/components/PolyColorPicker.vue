<template>
  <Popover class="color-picker">
    <PopoverButton
      :style="{ '--color': selectedColor.value }"
      :class="clsx(buttonClass, 'popover__button')"
    >
      <slot />
    </PopoverButton>

    <PopoverPanel
      class="color-picker__popover-panel"
      :style="{ '--active-color': selectedColor.value }"
    >
      <div
        class="swatch__active"
        :style="{ color: activeTextColor }"
      >
        {{ selectedColor.value }}
      </div>
      <div
        class="swatch__wrapper"
        role="radiogroup"
      >
        <button
          v-for="(color, index) in allColors"
          :key="color.name"
          :style="{ 'background-color': color.value }"
          :class="
            clsx([
              color.value === selectedColor.value && 'active',
              'swatch',
              color.value === 'transparent' && 'transparent',
            ])
          "
          :aria-checked="color.value === selectedColor.value"
          :tabindex="index < 1 ? 0 : -1"
          type="button"
          role="radio"
        >
          <span class="sr-only">{{ color.name }}</span>
        </button>
      </div>

      <input
        type="text"
        name="active-color"
        class="color-picker__text-input"
        :value="tempColor"
        @input="handleInput"
        @onKeyDown.enter="handleInputSubmit"
      />
    </PopoverPanel>
  </Popover>
</template>

<script setup lang="ts">
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import clsx from 'clsx'
import { meetsContrastGuidelines } from 'polished'
import { computed, ref } from 'vue'

import { COLORS, colors } from '~/constants'

const props = withDefaults(
  defineProps<{
    buttonClass?: string
    transparent?: boolean
  }>(),
  {
    transparent: false,
  }
)

const allColors = computed(() => {
  const c = [...colors]
  if (!props.transparent) {
    c.pop()
  }
  return c
})
const selectedColor = ref(allColors.value[0])
const tempColor = ref(selectedColor.value.value)

const activeTextColor = computed(() =>
  meetsContrastGuidelines(selectedColor.value.value, COLORS.white).AAA
    ? 'var(--color-white)'
    : 'var(--color-black)'
)

const handleInput = (event: Event) => {
  const el = event.target as HTMLInputElement
  tempColor.value = el.value
}

const handleInputSubmit = () => {
  selectedColor.value = tempColor.value
}
</script>

<style lang="scss">
@import '~/styles/vars.scss';

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.color-picker {
  display: flex;
  justify-content: center;
  position: relative;

  &__popover-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: $color-black;
    border: 1px solid $color-grey;
    text-transform: uppercase;
    position: absolute;
    z-index: $z-index-popover;
    top: 3rem;
    border-radius: $radius-sm;

    &::after,
    &::before {
      top: -24px;
      left: 50%;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
    }

    &::after {
      top: -20px;
      border-bottom-color: var(--active-color);
      border-width: 10px;
      margin-left: -10px;
    }

    &::before {
      top: -24px;
      border-bottom-color: $color-grey;
      border-width: 12px;
      margin-left: -12px;
      margin-bottom: -2px;
    }
  }

  &__text-input {
    margin: 0 0.5rem 0.5rem;
    max-width: 100%;
  }

  .swatch__active {
    background-color: var(--active-color);
    display: flex;
    align-items: center;
    justify-content: center;

    aspect-ratio: 2 / 1;
    width: 100%;

    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
  }

  .swatch__wrapper {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    padding: 0.5rem;
    width: 100%;
  }

  .swatch {
    border: 1px solid $color-grey;
    border-radius: $radius-sm;
    aspect-ratio: 1/1;
    width: 100%;
    min-width: 2.25rem;

    transition-timing-function: $easing-ease-in;
    transition-duration: $duration-150;
    transition-property: transform;

    &.transparent {
      background-image: conic-gradient(
        $color-white 0 25%,
        $color-silver 0 50%,
        $color-white 0 75%,
        $color-silver 0
      );

      background-size: 1rem 1rem;
      background-position: center;
    }

    &.active {
      outline: solid 0.125rem $color-yellow;
      outline-offset: 0.0625rem;
    }

    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
