<template>
  <div
    class="toolbar"
    role="toolbar"
    aria-label="Text Formatting"
    :aria-controls="editorId"
  >
    <div class="listbox group">
      <Listbox v-model="selectedFont">
        <ListboxButton
          class="listbox__button"
          :style="`font-family: ${selectedFont.value};`"
        >
          <span>
            {{ selectedFont.name }}
          </span>
          <PolyIcon
            class="icon__chevron"
            name="chevron-down"
          />
        </ListboxButton>
        <ListboxOptions class="listbox__options">
          <ListboxOption
            v-for="font in fonts"
            :key="font.name"
            :value="font"
            :style="`font-family: ${font.value};`"
          >
            <PolyIcon
              class="icon__selected"
              v-if="font.name === selectedFont.name"
              name="check"
              aria-hidden="true"
            />
            {{ font.name }}
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </div>
    <div class="group characteristics">
      <button
        type="button"
        class="item bold popup"
        aria-pressed="false"
        value="bold"
        tabindex="0"
      >
        <PolyIcon
          name="text-bold"
          aria-hidden="true"
        />
        <span class="popup-label">Bold</span>
      </button>
      <button
        type="button"
        class="item italic popup"
        aria-pressed="false"
        value="italic"
        tabindex="-1"
      >
        <PolyIcon
          name="text-italic"
          aria-hidden="true"
        />
        <span class="popup-label">Italic</span>
      </button>
      <button
        type="button"
        class="item strikethrough popup"
        aria-pressed="false"
        value="strikethrough"
        tabindex="-1"
      >
        <PolyIcon
          name="text-strike"
          aria-hidden="true"
        />
        <span class="popup-label">Strikethrough</span>
      </button>
      <button
        type="button"
        class="item underline popup"
        aria-pressed="false"
        value="underline"
        tabindex="-1"
      >
        <PolyIcon
          name="text-underline"
          aria-hidden="true"
        />
        <span class="popup-label">Underline</span>
      </button>
    </div>
    <div
      class="group"
      role="radiogroup"
      aria-label="Text Alignment"
    >
      <button
        type="button"
        role="radio"
        class="item align-left popup"
        aria-checked="true"
        tabindex="-1"
      >
        <PolyIcon
          name="align-left"
          aria-hidden="true"
        />
        <span class="popup-label">Text Align Left</span>
      </button>
      <button
        type="button"
        role="radio"
        class="item align-center popup"
        aria-checked="false"
        tabindex="-1"
      >
        <PolyIcon
          name="align-center"
          aria-hidden="true"
        />
        <span class="popup-label">Text Align Center</span>
      </button>
      <button
        type="button"
        role="radio"
        class="item align-right popup"
        aria-checked="false"
        tabindex="-1"
      >
        <PolyIcon
          name="align-right"
          aria-hidden="true"
        />
        <span class="popup-label">Text Align Right</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { type Editor } from '@tiptap/vue-3'
import { ref } from 'vue'

import PolyIcon from './PolyIcon.vue'

const FONT_SIZES = {
  'Normal text': 0,
  'Heading 1': 1,
  'Heading 2': 2,
  'Heading 3': 3,
} as const

type ValueOf<T> = T[keyof T]
type FontSize = ValueOf<typeof FONT_SIZES>

const WEB_FONTS = {
  ['Default']: 'Montserrat, sans-serif',
  ['Times New Roman']: '"Times New Roman", "Times", serif',
  Georgia: '"Georgia", serif',
  Palatino: '"Palatino", serif',
  Baskerville: '"Baskerville", serif',
  Helvetica: '"Helvetica", sans-serif',
  Arial: '"Arial", sans-serif',
  'Arial Black': '"Arial Black", sans-serif',
  Verdana: '"Verdana", sans-serif',
  Tahoma: '"Tahoma", sans-serif',
  'Trebuchet MS': '"Trebuchet MS", sans-serif',
  Impact: '"Impact", sans-serif',
  ['Andalé Mono']: '"Andalé Mono", monospace',
  Courier: '"Courier", monospace',
  Lucida: '"Lucida", monospace',
  Monaco: '"Monaco", monospace',
  'Bradley Hand': '"Bradley Hand", cursive',
  ['Brush Script MT']: '"Brush Script MT", cursive',
  Luminari: '"Luminari", fantasy',
  ['Comic Sans']: '"Comic Sans MS", "Comic Sans", cursive',
} as const

type WebFont = ValueOf<typeof WEB_FONTS>

const fonts = Object.entries(WEB_FONTS).map(([key, value]) => ({
  name: key,
  value,
}))

const selectedFont = ref(fonts[1])

defineProps<{
  editor?: Editor
  editorId: string
}>()
</script>

<style lang="scss" scoped>
@import '../styles/vars.scss';

.toolbar {
  display: flex;
  flex-flow: row wrap;
  border: 0.0625rem solid transparent;
  border-radius: $radius-sm;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0.5rem;
  background-color: $color-charcoal;
  gap: 0.5rem;

  &:focus-within {
    border-color: $color-white;
  }

  .group {
    padding: 0.25em;
    display: flex;
    gap: 0.25rem;
  }

  button {
    border: 1px solid $color-black;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: $radius-sm;
    text-align: center;
    background: $color-black;
    position: relative;
    line-height: $line-height-element;

    &:hover {
      .popup-label {
        text-align: center;
        top: -2.5em;
      }
    }

    .popup-label {
      display: block;
      border: 1px solid $color-grey;
      padding: 0.25rem 0.5rem;
      border-radius: $radius-sm;
      position: absolute;
      top: -30000em;
      background-color: $color-black;
      color: $color-white;
      z-index: $z-index-popover;
      font-size: $font-size-sm;
      white-space: nowrap;

      &::after,
      &::before {
        top: 100%;
        left: 50%;
        border: solid transparent;
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }

      &::after {
        border-top-color: $color-black;
        border-width: 10px;
        margin-left: -10px;
      }

      &::before {
        border-top-color: $color-grey;
        border-width: 12px;
        margin-left: -12px;
      }
    }

    &[aria-pressed='true'],
    [role='radio'][aria-checked='true'] {
      border-color: #555;
      font-weight: bold;
      background-color: #f4f4f4;
    }

    &[aria-disabled='true'] {
      color: #889;
      cursor: not-allowed;

      &:focus {
        border-color: #005a9c;
      }
    }

    &::-moz-focus-inner {
      border: 0;
    }

    &[aria-haspopup] {
      span {
        float: right;
        &::after {
          content: url('../images/pulldown-icon.svg');
        }
      }

      &:focus {
        span::after {
          content: url('../images/pulldown-icon-focus.svg');
        }
      }
    }
  }

  .listbox {
    position: relative;
    &__button {
      height: 100%;
      text-align: left;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      padding: 0;

      span {
        width: 10rem;
        overflow-x: hidden;
        overflow-y: visible;
        white-space: nowrap;
        text-overflow: clip;
        padding: 0.5rem;
        padding-right: 1.5rem;
      }

      .icon__chevron {
        right: 0.5rem;
        z-index: 1;
      }

      &[aria-expanded='true'] {
        .icon__chevron {
          transform: rotate(180deg);
        }
      }

      &::after {
        background: linear-gradient(to left, $color-black 66%, transparent);
        content: ' ';
        width: 3rem;
        height: 100%;
        right: 0;
        z-index: $z-index-base;
      }

      &::after,
      .icon__chevron {
        position: absolute;
      }
    }

    &__options {
      position: absolute;
      background-color: $color-black;
      z-index: $z-index-dropdown;
      border: solid 1px $color-charcoal;
      border-radius: $radius-md;
      max-height: 24rem;
      overflow-x: hidden;
      overflow-y: auto;
      top: 100%;

      li {
        align-items: center;
        display: flex;
        position: relative;
        padding: 0.5rem;
        cursor: pointer;
        white-space: nowrap;
        line-height: $line-height-element;

        .icon__selected {
          position: absolute;
          left: 0.5rem;
        }

        &::before {
          aspect-ratio: 1/1;
          display: flex;
          content: '';
          height: 100%;
          width: 1.25em;
        }

        &:hover {
          background-color: $color-charcoal;
        }
      }
    }
  }
}
</style>
