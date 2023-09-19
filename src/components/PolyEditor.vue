<template>
  <div class="editor__wrapper">
    <PolyEditorToolbar :editorId="randId" />
    <EditorContent
      class="editor"
      :editor="editor"
      :id="randId"
    />
    <div class="editor__footer">
      <a
        class="logo__link"
        href="https://roll20.net"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          class="logo"
          src="../assets/logo.png"
          alt="Roll20"
      /></a>

      <div class="character-count">
        <span
          v-if="percentage >= 50"
          :style="{
            color:
              percentage >= 100
                ? 'var(--color-danger)'
                : percentage >= 50
                ? 'var(--color-accent)'
                : 'var(--color-text)',
          }"
          class="character-count__label"
          >{{ CHAR_LIMIT - characterCount }}</span
        >
        <svg
          class="character-count__indicator"
          height="32"
          width="32"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
        >
          <circle
            r="10"
            cx="10"
            cy="10"
            fill="var(--color-tertiary)"
          />
          <circle
            class="character-count__indicator--gauge"
            r="5"
            cx="10"
            cy="10"
            fill="transparent"
            :stroke="
              percentage >= 100
                ? 'var(--color-danger)'
                : percentage >= 50
                ? 'var(--color-accent)'
                : 'var(--color-text)'
            "
            stroke-width="10"
            :stroke-dasharray="`calc(${percentage} * ${Math.PI} / 10) ${
              Math.PI * 10
            }`"
            transform="rotate(-90) translate(-20)"
          />
          <circle
            r="6"
            cx="10"
            cy="10"
            fill="var(--color-background)"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Blockquote from '@tiptap/extension-blockquote'
import CharacterCount from '@tiptap/extension-character-count'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import TextTypography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent, type JSONContent } from '@tiptap/vue-3'
import { uid } from 'radash'
import { computed, onBeforeUnmount, provide, readonly, ref } from 'vue'

import PolyEditorToolbar from './PolyEditorToolbar.vue'

const CHAR_LIMIT = 500

const props = defineProps<{
  modelValue?: JSONContent
}>()
const emit = defineEmits(['update:modelValue'])
const randId = ref(uid(12))
const characterCount = ref(0)
const percentage = computed(() =>
  Math.min(
    Math.round((100 / CHAR_LIMIT) * characterCount.value * 100) / 100,
    100
  )
)

const editor = new Editor({
  extensions: [
    Blockquote,
    CharacterCount.configure({
      limit: CHAR_LIMIT,
    }),
    Color,
    FontFamily,
    Highlight.configure({
      multicolor: true,
    }),
    Link.configure({
      openOnClick: false,
    }),
    Mention,
    Placeholder.configure({
      placeholder: '[this space left intentionally blank]',
    }),
    Subscript,
    Superscript,
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5],
      },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TextStyle,
    TextTypography,
    Underline,
  ],
  content: props?.modelValue,
  onUpdate: ({ editor }) => {
    characterCount.value = editor?.storage.characterCount.characters()
    emit('update:modelValue', editor.getJSON())
  },
})

provide('editor', readonly(editor))
onBeforeUnmount(() => editor.destroy())
</script>

<style lang="scss">
@import '../styles/vars.scss';

.editor__wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: $size-sm;
}

.editor__footer {
  position: relative;

  display: flex;
  flex: 0 0 auto;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: 0.5rem;

  background-color: $color-background;
  border: solid 0.0625rem $color-tertiary;
  border-top: 0;
  border-radius: $radius-md;
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  .logo {
    aspect-ratio: 23/25;
    height: 2rem;

    &__link {
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        opacity: 0.5;
      }
    }
  }

  .character-count {
    display: flex;
    gap: 0.5rem;

    &__indicator--gauge {
      transition: stroke-dasharray $duration-250 $easing-linear;
    }
  }
}

.editor {
  position: relative;
  padding: 1rem;

  display: flex;
  flex: 1 1 auto;
  flex-direction: column;

  height: 24rem;
  overflow-y: auto;
  overflow-x: hidden;

  word-wrap: break-word;
  white-space: pre-wrap;

  border: solid 0.0625rem $color-tertiary;

  &:focus-within {
    border-color: $color-focus;
  }

  &::-webkit-scrollbar {
    background-color: transparent;
    border: none;
    width: 1rem;
    padding: 0.25rem;

    &-track {
      background-color: transparent;
    }
    &-thumb {
      border-radius: $radius-lg;
      box-shadow: inset 0 0 1rem 1rem $color-tertiary;
      border: solid 0.25rem transparent;
    }
  }

  .ProseMirror {
    p.is-editor-empty:first-child::before {
      pointer-events: none;
      content: attr(data-placeholder);

      float: left;

      height: 0;

      color: $color-tertiary;
    }

    & > :first-child {
      margin-top: 0;
    }

    & > :last-child {
      margin-bottom: 0;
    }

    h1,
    h2,
    h3 {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      padding-bottom: 0.3em;
      line-height: 1.15;
    }

    h1 {
      font-size: $font-size-h2;
      border-bottom: solid 0.0625rem $color-tertiary;
    }

    h2 {
      font-size: $font-size-h3;
    }

    h3 {
      font-size: $font-size-h4;
    }

    p,
    blockquote,
    ul,
    ol,
    dl,
    table,
    pre,
    details {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    ul ul,
    ul ol,
    ol ol,
    ol ul {
      display: inline-flex;
      margin-top: 0;
      margin-bottom: 0;
    }

    ul {
      list-style-type: disc;
      & ul {
        list-style-type: circle;
        & ul {
          list-style-type: square;
          & ul {
            list-style-type: disc;
          }
        }
      }
    }

    ol {
      counter-reset: item;
      margin: 0;
      padding: 0;
      list-style-type: none;
      li {
        counter-increment: item;
        &::marker {
          content: counter(item, decimal) '. ';
        }
      }
    }

    ol,
    ul {
      display: flex;
      flex-direction: column;
      margin-bottom: 1rem;
      padding-left: 2rem;
    }

    li {
      display: list-item;
    }

    ul[data-type='taskList'] {
      padding-left: 0;
      list-style-type: none;
      li {
        display: inline-flex;
        & + li {
          margin-top: 0.5rem;
        }
      }
      label {
        display: inline-flex;
        gap: 0.5rem;
        align-items: center;
      }

      label + div {
        display: flex;
        align-items: center;
      }

      p {
        margin: 0;
      }
    }

    strong {
      font-weight: bold;
    }

    em {
      font-style: italic;
    }

    u {
      text-decoration: underline;
    }

    s {
      text-decoration: line-through;
    }

    blockquote {
      display: flex;
      flex-direction: column;
      padding-left: 0.5rem;
      border-left: solid 0.25rem $color-tertiary;
      & > :last-child {
        margin-bottom: 0;
      }
    }

    hr {
      height: 0.25em;
      margin: 2rem 0;
      padding: 0;
      background-color: $color-tertiary;
    }
  }
}
</style>
