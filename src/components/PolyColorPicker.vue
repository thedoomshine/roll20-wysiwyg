<template>
  <Popover
    v-slot="{ open }"
    class="color-picker"
  >
    <PopoverButton as="template">
      <button
        :style="{ '--color': modelValue.value }"
        :class="clsx(buttonClass, 'popover__button')"
        :tabindex="tabindex"
        ref="popoverButton"
        type="button"
        role="button"
      >
        <slot />
      </button>
    </PopoverButton>

    <template v-if="open">
      <PopoverPanel
        v-slot="{ close }"
        :key="randId"
        :style="{ '--active-color': modelValue.value }"
        class="color-picker__popover-panel"
        static
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
            :key="randId + color.name"
            :id="randId + color.name"
            :value="color"
            as="template"
          >
            <button
              @click="handleClick(color, close)"
              @keydown.right.stop="handleFocusNextItem"
              @keydown.left.stop="handleFocusPrevItem"
              @keydown.home.stop="handleFocusFirstItem"
              @keydown.end.stop="handleFocusLastItem"
              @keydown.esc.stop="handleEscape(close)"
              @vue:mounted="() => getAllItems()[0].focus()"
              :style="{ 'background-color': color.value }"
              :class="
                clsx('swatch', {
                  focused: active,
                  active: checked,
                  transparent: color.value === 'transparent',
                })
              "
              :aria-checked="checked"
              role="radio"
              type="button"
              tabindex="-1"
            >
              <span class="sr-only">{{ color.name }}</span>
            </button>
          </RadioGroupOption>
        </RadioGroup>
      </PopoverPanel>
    </template>
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
import { first, last, uid } from 'radash'
import { type Ref, type VNodeRef, computed, nextTick, ref, watch } from 'vue'

import { COLORS, type ColorObj, colors } from '~/constants'

type CloseFn = (ref?: Ref | HTMLElement) => void

const randId = uid(12)
const popoverButton = ref<VNodeRef | null>(null)
const isOpen = ref(false)

const props = withDefaults(
  defineProps<{
    buttonClass?: string
    transparent?: boolean
    tabindex?: number | string
    modelValue?: {
      name: string
      value: string
    }
  }>(),
  {
    tabindex: 0,
    transparent: false,
  }
)

const emit = defineEmits(['update:modelValue'])

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

const getAllItems = () =>
  Array.from(document.querySelectorAll('.swatch')) as HTMLButtonElement[]

const getCurrentItemIndex = (element: HTMLButtonElement) =>
  getAllItems().indexOf(element)

const handleFocusNextItem = (event: KeyboardEvent) => {
  const target = event.target as HTMLButtonElement
  if (!target) return
  const allItems = getAllItems()
  const currentIndex = getCurrentItemIndex(target)
  allItems[currentIndex < allItems.length - 1 ? currentIndex + 1 : 0].focus()
}

const handleFocusPrevItem = (event: KeyboardEvent) => {
  const target = event.target as HTMLButtonElement
  if (!target) return
  const allItems = getAllItems()
  const currentIndex = getCurrentItemIndex(target)
  allItems[currentIndex > 0 ? currentIndex - 1 : allItems.length - 1].focus()
}

const handleFocusFirstItem = () => {
  first(getAllItems())?.focus()
}

const handleFocusLastItem = () => {
  last(getAllItems())?.focus()
}

const handleEscape = (closeFn: CloseFn) => {
  closeFn(popoverButton)
}

const handleClick = (color: ColorObj, closeFn: CloseFn) => {
  emit('update:modelValue', color)
  nextTick(() => {
    closeFn(popoverButton)
  })
}

watch(isOpen, (isNowOpen) => {
  console.log(isNowOpen)
})
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
