<template>
  <Popover class="color-picker">
    <PopoverButton
      :style="{ '--color': modelValue.value }"
      :class="clsx(buttonClass, 'popover__button')"
    >
      <slot />
    </PopoverButton>

    <PopoverPanel
      class="color-picker__popover-panel"
      :style="{ '--active-color': modelValue.value }"
    >
      <div
        :class="[
          'swatch--active',
          {
            transparent: modelValue.value === 'transparent',
          },
        ]"
        :style="{
          color: activeTextColor,
        }"
        aria-hidden="true"
        z-index="-1"
      >
        {{ modelValue.value }}
      </div>

      <RadioGroup
        class="swatch__wrapper"
        :modelValue="modelValue"
      >
        <RadioGroupLabel class="swatch__label sr-only"
          >Color Options</RadioGroupLabel
        >
        <RadioGroupOption
          v-for="color in allColors"
          v-slot="{ active, checked }"
          as="template"
          :key="randId + color.name"
          :value="color"
          :id="randId + color.name"
        >
          <button
            @click="(color) => $emit('update:modelValue', color)"
            :style="{ 'background-color': color.value }"
            :class="
              clsx('swatch', {
                focused: active,
                active: checked,
                transparent: color.value === 'transparent',
              })
            "
            :aria-checked="checked"
            type="button"
            role="radio"
          >
            <span class="sr-only">{{ color.name }}</span>
          </button>
        </RadioGroupOption>
      </RadioGroup>
    </PopoverPanel>
  </Popover>
</template>

<script setup lang="ts">
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
} from '@headlessui/vue'
import clsx from 'clsx'
import { meetsContrastGuidelines } from 'polished'
import { uid } from 'radash'
import { computed } from 'vue'

import { COLORS, colors } from '~/constants'

defineEmits(['update:modelValue'])

const randId = uid(12)

const props = withDefaults(
  defineProps<{
    buttonClass?: string
    transparent?: boolean
    modelValue?: {
      name: string
      value: string
    }
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

const modelValue = computed(() => props.modelValue ?? allColors.value[0])

const activeTextColor = computed(() =>
  meetsContrastGuidelines(COLORS.black, modelValue.value.value).AAA
    ? 'var(--color-black)'
    : 'var(--color-white)'
)
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
    background-color: $color-primary;
    border: solid 0.0625rem $color-tertiary;
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
      border-bottom-color: $color-tertiary;
      border-width: 12px;
      margin-left: -12px;
      margin-bottom: -2px;
    }
  }

  &__text-input {
    margin: 0 0.5rem 0.5rem;
    max-width: 100%;
  }

  .swatch--active {
    background-color: var(--active-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;

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
    border: solid 0.0625rem $color-tertiary;
    border-radius: $radius-sm;
    aspect-ratio: 1/1;
    width: 100%;
    min-width: 2.25rem;

    transition-timing-function: $easing-ease-in;
    transition-duration: $duration-150;
    transition-property: transform;

    &.active {
      outline: solid 0.125rem $color-complementary;
      outline-offset: 0.0625rem;
    }

    &:focus,
    &.focused {
      outline: solid 0.125rem $color-focus;
    }

    &:hover,
    &:focus,
    &.focused {
      transform: scale(1.075);
    }
  }

  .swatch,
  .swatch--active {
    &.transparent {
      background-image: conic-gradient(
        $color-silver 0 25%,
        $color-white 0 50%,
        $color-silver 0 75%,
        $color-white 0
      );

      background-position: 0 0;
      color: $color-black !important;
      text-shadow:
        0 0 0 $color-white,
        0 0 2rem $color-black;
    }
  }

  .swatch {
    &.transparent {
      background-size: cover;
    }
  }

  .swatch--active {
    &.transparent {
      background-size: 2.125em 2.125em;
    }
  }
}
</style>
