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
        :modelValue="attributes.fontFamily"
        @update:modelValue="
          (font) => handleFontFamilyChange(font.value as FontFamily)
        "
      >
        <ListboxButton
          v-slot="{ value }"
          :style="`font-family: ${attributes.fontFamily.value};`"
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
            <li :class="clsx({ active })">
              {{ font.name }}
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
        :modelValue="attributes.fontSize"
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
          >
            <li :class="clsx({ active })">
              {{ fontSize.name }}
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
        :modelValue="attributes.textColor"
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
        :modelValue="attributes.textHighlight"
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
        :aria-pressed="attributes.bold"
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
        :aria-pressed="attributes.italic"
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
        :aria-pressed="attributes.strikethrough"
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
        :aria-pressed="attributes.underline"
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
    </div>
    <!-- font style options : END -->

    <!-- text alignment group : START -->
    <div
      class="group alignment"
      role="radiogroup"
      aria-label="Text Alignment"
    >
      <button
        @click="editor?.chain().focus().setTextAlign('left').run()"
        :aria-checked="attributes.textAlign === 'left'"
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
        :aria-checked="attributes.textAlign === 'center'"
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
        :aria-checked="attributes.textAlign === 'right'"
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
        :aria-checked="attributes.textAlign === 'justify'"
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
        :aria-checked="attributes.list === 'orderedList'"
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
        :aria-checked="attributes.list === 'bulletList'"
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
        :disabled="!attributes.canSink"
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
        :disabled="!attributes.canLift"
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
} from '@headlessui/vue'
import { type EditorEvents } from '@tiptap/core'
import { type Editor } from '@tiptap/vue-3'
import { useDark } from '@vueuse/core'
import clsx from 'clsx'
import { inject, reactive } from 'vue'

import {
  type ColorObj,
  type FontFamily,
  type FontFamilyObj,
  type FontSize,
  type FontSizeObj,
  colors,
  fontFamilies,
  fontSizes,
} from '~/constants'

import PolyColorPicker from './PolyColorPicker.vue'
import PolyIcon from './PolyIcon.vue'
import PolyPopupLabel from './PolyPopupLabel.vue'

const isDark = useDark()

const editor = inject<Editor>('editor')
const attributes = reactive<{
  fontFamily: FontFamilyObj
  fontSize: FontSizeObj
  textColor: ColorObj
  textHighlight: ColorObj
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  textAlign: 'left' | 'center' | 'right' | 'justify'
  list: 'orderedList' | 'bulletList' | undefined
  canSink: boolean
  canLift: boolean
}>({
  fontFamily: fontFamilies[0],
  fontSize: fontSizes[0],
  textColor: isDark.value ? colors[0] : colors[4],
  textHighlight: { name: 'transparent', value: 'transparent' },
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
  textAlign: 'left',
  list: undefined,
  canSink: false,
  canLift: false,
})

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

const updateAttributes = ({ editor }: EditorEvents['transaction']) => {
  attributes.fontFamily =
    fontFamilies.find(
      (font) => font.value === editor.getAttributes('textStyle').fontFamily
    ) || fontFamilies[0]

  attributes.fontSize =
    fontSizes.find(
      (fontSize) => fontSize.value === editor.getAttributes('heading').level
    ) || fontSizes[0]

  attributes.textColor =
    colors.find((color) =>
      editor.isActive('textStyle', { color: color.value })
    ) || (isDark.value ? colors[0] : colors[4])

  attributes.textHighlight = colors.find((color) =>
    editor.isActive('highlight', { color: color.value })
  ) || { name: 'transparent', value: 'transparent' }

  attributes.bold = editor.isActive('bold')
  attributes.italic = editor.isActive('italic')
  attributes.strikethrough = editor.isActive('strike')
  attributes.underline = editor.isActive('underline')
  attributes.textAlign = editor.isActive({ textAlign: 'center' })
    ? 'center'
    : editor.isActive({ textAlign: 'right' })
    ? 'right'
    : 'left'
  attributes.list = editor.isActive('orderedList')
    ? 'orderedList'
    : editor.isActive('bulletList')
    ? 'bulletList'
    : undefined
  attributes.canLift = editor.can().liftListItem('listItem')
  attributes.canSink = editor.can().sinkListItem('listItem')

  return editor
}

editor?.on('selectionUpdate', updateAttributes)
editor?.on('transaction', updateAttributes)

defineProps<{
  editorId: string
}>()
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
    border: 1px solid $color-primary;
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
    [role='radio'][aria-checked='true'] {
      border-color: $color-primary;
      background-color: $color-secondary;
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

  .spinbutton {
    display: flex;
    gap: 0.25rem;
    padding-top: 0;
    padding-bottom: 0;

    button {
      background-color: $color-secondary;
      font-size: 0.5em;

      &:hover {
        background-color: $color-tertiary;
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
        border: solid 1px $color-focus;
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
      border: solid 1px $color-secondary;
      border-radius: $radius-md;
      max-height: 24rem;
      overflow-x: hidden;
      overflow-y: auto;
      top: calc(100% + 0.25rem);

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

      li {
        align-items: center;
        display: flex;
        position: relative;
        padding: 0.5rem 1rem;
        cursor: pointer;
        white-space: nowrap;
        line-height: $line-height-element;
        width: 100%;

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

        &.active {
          background-color: $color-secondary;
          outline: solid 1px $color-accent;
        }

        &:hover {
          background-color: $color-secondary;
          outline: 0;
        }
      }
    }
  }
}
</style>
