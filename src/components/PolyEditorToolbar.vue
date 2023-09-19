<template>
  <div
    :aria-controls="editorId"
    aria-label="Text Formatting"
    class="toolbar"
    role="toolbar"
  >
    <!-- font family picker : START -->
    <div class="group listbox">
      <Listbox
        :modelValue="fontFamily()"
        @update:modelValue="
          (font) => handleFontFamilyChange(font.value as FontFamily)
        "
      >
        <ListboxButton
          v-slot="{ value }"
          :style="`font-family: ${fontFamily()};`"
          class="toolbar__button listbox__button"
          z-index="0"
        >
          <span>
            {{ value.name }}
          </span>
          <PolyIcon
            class="icon__chevron"
            name="chevron-down"
          />
        </ListboxButton>
        <ListboxOptions class="listbox__options">
          <ListboxOption
            v-for="font in fontFamilies"
            v-slot="{ active, selected }"
            as="template"
            :key="font.name"
            :style="`font-family: ${font.value};`"
            :value="font"
          >
            <li :class="clsx(['option', { active }])">
              <span>{{ font.name }}</span>
              <PolyIcon
                v-if="selected"
                class="icon__selected"
                name="check"
                aria-hidden="true"
              />
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </div>
    <!-- font family picker : END -->

    <!-- font size input : START -->
    <div class="group listbox">
      <Listbox
        :modelValue="fontSize()"
        @update:modelValue="
          (value) => handleFontSizeChange(parseInt(value.value) as FontSize)
        "
      >
        <ListboxButton
          class="toolbar__button listbox__button"
          v-slot="{ value }"
          z-index="-1"
        >
          <span>
            {{ value.name }}
          </span>
          <PolyIcon
            class="icon__chevron"
            name="chevron-down"
          />
        </ListboxButton>
        <ListboxOptions class="listbox__options">
          <ListboxOption
            v-for="fontSize in fontSizes"
            v-slot="{ active, selected }"
            as="template"
            :key="fontSize.name"
            :value="fontSize"
            :style="{
              'font-size': getFontSize(fontSize.value),
              'font-weight': getFontWeight(fontSize.value),
            }"
            :class="clsx(['option', { 'option--title': fontSize.value === 1 }])"
          >
            <li :class="clsx({ active })">
              <span>{{ fontSize.name }}</span>
              <PolyIcon
                v-if="selected"
                class="icon__selected"
                name="check"
                aria-hidden="true"
              />
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </div>
    <!-- font size input : START -->

    <div class="group text-color">
      <!-- text color picker : START -->
      <PolyColorPicker
        :modelValue="textColor()"
        @update:modelValue="handleTextColorChange"
        buttonClass="toolbar__button"
      >
        <PolyIcon
          slot="icon"
          name="text-color"
          aria-hidden="true"
        />
        <PolyPopupLabel>Text Color</PolyPopupLabel>
      </PolyColorPicker>
      <!-- text color picker : END -->

      <!-- text highlight color picker : START -->
      <PolyColorPicker
        :modelValue="textHighlight()"
        @update:modelValue="handleTextHighlightChange"
        buttonClass="toolbar__button"
        transparent
      >
        <PolyIcon
          slot="icon"
          name="text-highlight"
          aria-hidden="true"
        />
        <PolyPopupLabel>Text Highlight Color</PolyPopupLabel>
      </PolyColorPicker>
      <!-- text highlight color picker : END -->
    </div>

    <!-- font style options : START -->
    <div class="group characteristics">
      <button
        @click="editor?.chain().focus().toggleBold().run()"
        :aria-pressed="editor?.isActive('bold')"
        type="button"
        class="toolbar__button item bold popup"
        value="bold"
      >
        <PolyIcon
          name="text-bold"
          aria-hidden="true"
        />
        <PolyPopupLabel>Bold</PolyPopupLabel>
      </button>
      <button
        @click="editor?.chain().focus().toggleItalic().run()"
        :aria-pressed="editor?.isActive('italic')"
        type="button"
        class="toolbar__button item italic popup"
        value="italic"
      >
        <PolyIcon
          name="text-italic"
          aria-hidden="true"
        />
        <PolyPopupLabel>Italic</PolyPopupLabel>
      </button>
      <button
        @click="editor?.chain().focus().toggleStrike().run()"
        :aria-pressed="editor?.isActive('strike')"
        type="button"
        class="toolbar__button item strikethrough popup"
        value="strikethrough"
      >
        <PolyIcon
          name="text-strike"
          aria-hidden="true"
        />
        <PolyPopupLabel>Strikethrough</PolyPopupLabel>
      </button>
      <button
        @click="editor?.chain().focus().toggleUnderline().run()"
        :aria-pressed="editor?.isActive('underline')"
        type="button"
        class="toolbar__button item underline popup"
        value="underline"
      >
        <PolyIcon
          name="text-underline"
          aria-hidden="true"
        />
        <PolyPopupLabel>Underline</PolyPopupLabel>
      </button>
      <button
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :aria-pressed="editor?.isActive('blockquote')"
        type="button"
        class="toolbar__button item blockquote popup"
        value="blockquote"
      >
        <PolyIcon
          name="quote-left"
          aria-hidden="true"
        />
        <PolyPopupLabel>Blockquote</PolyPopupLabel>
      </button>
    </div>
    <!-- font style options : END -->

    <!-- html link : START -->
    <div class="group link">
      <Popover
        class="link__popover"
        v-slot="{ open }"
      >
        <PopoverButton
          :aria-pressed="editor?.isActive('link')"
          type="button"
          class="toolbar__button item link popup"
          value="link"
        >
          <PolyIcon
            v-if="!editor?.isActive('link')"
            name="link"
            aria-hidden="true"
          />
          <PolyIcon
            v-else
            name="link-remove"
            aria-hidden="true"
          />
          <PolyPopupLabel>
            <template v-if="editor?.isActive('link')">Unl</template>
            <template v-else>L</template>ink
          </PolyPopupLabel>
        </PopoverButton>

        <PopoverPanel
          v-slot="{ close }"
          class="link__popover--panel"
        >
          <label for="url">Enter your link:</label>
          <input
            class="link__popover--input"
            v-model="tempLink"
            type="url"
            name="url"
            id="url"
            placeholder="https://example.com"
            pattern="http(s)*://.*"
            size="30"
            required
          />
          <button
            role="button"
            type="button"
            class="link__popover--submit-button"
            @click="handleSetLink(close)"
          >
            Save Link
          </button>
        </PopoverPanel>
      </Popover>
    </div>
    <!-- html link : END -->

    <!-- text alignment group : START -->
    <div
      class="group alignment"
      role="radiogroup"
      aria-label="Text Alignment"
    >
      <button
        @click="editor?.chain().focus().setTextAlign('left').run()"
        :aria-checked="editor?.isActive({ textAlign: 'left' })"
        type="button"
        role="radio"
        class="toolbar__button item align-left popup"
      >
        <PolyIcon
          name="align-left"
          aria-hidden="true"
        />
        <PolyPopupLabel>Text Align Left</PolyPopupLabel>
      </button>
      <button
        @click="editor?.chain().focus().setTextAlign('center').run()"
        :aria-checked="editor?.isActive({ textAlign: 'center' })"
        type="button"
        role="radio"
        class="toolbar__button item align-center popup"
      >
        <PolyIcon
          name="align-center"
          aria-hidden="true"
        />
        <PolyPopupLabel>Text Align Center</PolyPopupLabel>
      </button>
      <button
        @click="editor?.chain().focus().setTextAlign('right').run()"
        :aria-checked="editor?.isActive({ textAlign: 'right' })"
        type="button"
        role="radio"
        class="toolbar__button item align-right popup"
      >
        <PolyIcon
          name="align-right"
          aria-hidden="true"
        />
        <PolyPopupLabel>Text Align Right</PolyPopupLabel>
      </button>
      <button
        @click="editor?.chain().focus().setTextAlign('justify').run()"
        :aria-checked="editor?.isActive({ textAlign: 'justify' })"
        type="button"
        role="radio"
        class="toolbar__button item align-justify popup"
      >
        <PolyIcon
          name="align-justify"
          aria-hidden="true"
        />
        <PolyPopupLabel>Text Align Justify</PolyPopupLabel>
      </button>
    </div>
    <!-- text alignment group : END -->
    <!-- list formatting options : START -->
    <div
      class="group lists"
      role="radiogroup"
      aria-label="List Formatting"
    >
      <button
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :aria-checked="editor?.isActive('orderedList')"
        type="button"
        role="radio"
        class="toolbar__button item list-ordered popup"
      >
        <PolyIcon
          name="list-ordered"
          aria-hidden="true"
        />
        <PolyPopupLabel>Ordered List</PolyPopupLabel>
      </button>
      <button
        @click="editor?.chain().focus().toggleBulletList().run()"
        :aria-checked="editor?.isActive('bulletList')"
        type="button"
        role="radio"
        class="toolbar__button item list-bullet popup"
      >
        <PolyIcon
          name="list-bullet"
          aria-hidden="true"
        />
        <PolyPopupLabel>Bullet List</PolyPopupLabel>
      </button>
    </div>
    <!-- list formatting options : END -->
    <!-- list indentation options :START -->
    <div
      class="group list-indentation"
      aria-label="List Indentation"
    >
      <button
        @click="editor?.chain().focus().sinkListItem('listItem').run()"
        :disabled="!editor?.can().sinkListItem('listItem')"
        type="button"
        class="toolbar__button item list-indent popup"
        value="indent"
      >
        <PolyIcon
          name="list-indent"
          aria-hidden="true"
        />
        <PolyPopupLabel>Indent List</PolyPopupLabel>
      </button>
      <button
        @click="editor?.chain().focus().liftListItem('listItem').run()"
        :disabled="!editor?.can().liftListItem('listItem')"
        type="button"
        class="toolbar__button item list-outdent popup"
      >
        <PolyIcon
          name="list-outdent"
          aria-hidden="true"
        />
        <PolyPopupLabel>Outdent List</PolyPopupLabel>
      </button>
    </div>
    <!-- list indentation options : END -->
    <!-- clear formatting : START -->
    <div class="group">
      <button
        @click="editor?.chain().focus().clearNodes().unsetAllMarks().run()"
        type="button"
        class="toolbar__button item clear popup"
        value="clear"
      >
        <PolyIcon
          name="format-clear"
          aria-hidden="true"
        />
        <PolyPopupLabel>Clear Formatting</PolyPopupLabel>
      </button>
    </div>
    <!-- clear formatting : END -->
  </div>
</template>

<script lang="ts" setup>
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Popover,
  PopoverButton,
  PopoverPanel,
  RadioGroup,
  RadioGroupLabel,
  RadioGroupOption,
} from '@headlessui/vue'
import { type Editor } from '@tiptap/vue-3'
import { useDark } from '@vueuse/core'
import clsx from 'clsx'
import { type Ref, inject, ref } from 'vue'

import {
  type ColorObj,
  type FontFamily,
  type FontSize,
  colors,
  fontFamilies,
  fontSizes,
} from '~/constants'

import PolyColorPicker from './PolyColorPicker.vue'
import PolyIcon from './PolyIcon.vue'
import PolyPopupLabel from './PolyPopupLabel.vue'

defineProps<{
  editorId: string
}>()

const isDark = useDark()

const editor = inject<Editor>('editor')
const tempLink = ref('')

const getFontSize = (size: number) =>
  size > 0 ? `var(--font-size-h${size + 1}` : '1rem'
const getFontWeight = (size: number) => (size > 0 ? '800' : 'normal')

const handleFontSizeChange = (level: FontSize) => {
  return level === 0
    ? editor?.chain().focus().toggleNode('heading', 'paragraph').run()
    : editor?.chain().focus().toggleHeading({ level }).run()
}

const handleFontFamilyChange = (font: FontFamily) => {
  return editor?.chain().focus().setFontFamily(font).run()
}

const handleTextColorChange = (color: ColorObj) => {
  return editor?.chain().focus().setColor(color.value).run()
}

const handleTextHighlightChange = (color: ColorObj) => {
  return editor?.chain().focus().setHighlight({ color: color.value }).run()
}

const handleSetLink = (fn: (ref?: Ref | HTMLElement) => void) => {
  if (!tempLink.value) {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
    return fn()
  }
  tempLink.value = ''
  editor?.chain().focus().setLink({ href: tempLink.value }).run()
  return fn()
}

const fontFamily = () =>
  fontFamilies.find(
    (font) => font.value === editor?.getAttributes('textStyle').fontFamily
  ) || fontFamilies[0]

const fontSize = () =>
  fontSizes.find(
    (fontSize) => fontSize.value === editor?.getAttributes('heading').level
  ) || fontSizes[0]

const textColor = () =>
  colors.find(
    (color) => editor?.isActive('textStyle', { color: color.value })
  ) || (isDark.value ? colors[0] : colors[4])

const textHighlight = () =>
  colors.find(
    (color) => editor?.isActive('highlight', { color: color.value })
  ) || { name: 'transparent', value: 'transparent' }
</script>

<style lang="scss">
@import '../styles/vars.scss';

.toolbar {
  display: flex;
  flex-flow: row wrap;
  border: solid 0.0625rem $color-tertiary;
  border-bottom-color: transparent;
  border-radius: $radius-sm;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0.5rem;
  background-color: $color-secondary;
  gap: 0.75rem;

  &:focus-within {
    border-color: $color-focus;
  }

  .group {
    display: flex;
    gap: 0.25rem;
    flex: 0 0 auto;
  }

  .toolbar__button {
    border: solid 0.0625rem $color-primary;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: $radius-sm;
    text-align: center;
    background: $color-background;
    position: relative;
    line-height: $line-height-element;

    &[aria-pressed='true'],
    &[role='radio'][aria-checked='true'] {
      color: $color-accent;
      background-color: $color-secondary;
      border-color: $color-primary;
    }

    &:hover {
      background-color: $color-secondary;
    }

    &:disabled,
    &[aria-disabled='true'] {
      color: $color-tertiary;
      background-color: $color-secondary;
      cursor: not-allowed;
    }

    &:focus {
      border-color: $color-focus;
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

      &:hover {
        &::after {
          background: linear-gradient(
            to left,
            $color-secondary 66%,
            transparent
          );
        }
      }

      &:focus {
        border: solid 0.0625rem $color-focus;
      }

      &::after {
        background: linear-gradient(to left, $color-primary 66%, transparent);
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
      background-color: $color-background;
      z-index: $z-index-dropdown;
      border: solid 0.0625rem $color-secondary;
      border-radius: $radius-md;
      max-height: 24rem;
      overflow-x: hidden;
      overflow-y: auto;
      top: calc(100% + 0.25rem);
      display: grid;
      grid-auto-rows: minmax(3rem, 1fr);

      &::-webkit-scrollbar {
        background-color: transparent;
        border: none;
        width: 1rem;
        padding: 0.125rem;

        &-track {
          background-color: transparent;
          /* border: solid 0.125rem transparent; */
        }
        &-thumb {
          border-radius: $radius-lg;
          box-shadow: inset 0 0 1rem 1rem $color-tertiary;
          border: solid 0.25rem transparent;
        }
      }

      &:focus-within {
        border-color: $color-focus;
      }

      .option {
        display: flex;
        align-items: center;
        position: relative;
        padding: 0.5rem 1rem;
        border: solid 0.0625rem transparent;
        border-top-color: $color-tertiary;
        cursor: pointer;
        white-space: nowrap;
        line-height: $line-height-element;
        width: 100%;

        &:last-of-type {
          border-bottom-width: 0;
        }

        &:first-of-type {
          border-top-width: 0;
        }

        .icon__selected {
          color: $color-focus;
          position: absolute;
          height: 1rem;
          width: 1rem;
          right: 0.25rem;
        }

        &::after {
          aspect-ratio: 1/1;
          display: flex;
          flex: 0 0 auto;
          content: '';
          height: 100%;
          width: 1rem;
        }

        span {
          align-items: center;
          justify-content: flex-start;
          display: flex;
          width: 100%;
        }

        &--title span {
          border-bottom: solid 0.0625rem var(--color-tertiary);
        }

        &.active {
          background-color: $color-secondary;
          border-top-color: $color-accent;
          border-bottom-color: $color-accent;
        }

        &:hover {
          background-color: $color-secondary;
          outline: 0;
        }
      }
    }
  }

  .link__popover {
    display: flex;
    justify-content: center;
    position: relative;

    &--panel {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      border: solid 0.0625rem $color-tertiary;
      padding: 0.5rem;
      border-radius: $radius-sm;
      position: absolute;
      background-color: $color-background;
      color: $color-text;
      z-index: $z-index-popover;
      font-size: $font-size-sm;
      white-space: nowrap;
      top: calc(100% + 0.75rem);
      gap: 0.5rem;

      &::after,
      &::before {
        bottom: 100%;
        left: 50%;
        border: solid transparent;
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }

      &::after {
        border-bottom-color: $color-background;
        border-width: 10px;
        margin-left: -10px;
      }

      &::before {
        border-bottom-color: $color-tertiary;
        border-width: 12px;
        margin-left: -12px;
      }
    }

    &--input {
      &::placeholder {
        color: $color-tertiary;
      }
    }

    &--submit-button {
      border: solid 0.0625rem $color-accent;
      color: $color-primary;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: $radius-sm;
      text-align: center;
      background: $color-accent;
      position: relative;
      line-height: $line-height-element;
      margin-top: 0.5rem;
      margin-right: 0;
      margin-left: auto;
    }
  }
}
</style>
