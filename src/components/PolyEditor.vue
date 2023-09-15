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
    </div>
  </div>
</template>

<script lang="ts" setup>
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
import { debounce, uid } from 'radash'
import { onBeforeUnmount, provide, readonly, ref } from 'vue'

import PolyEditorToolbar from './PolyEditorToolbar.vue'

const props = defineProps<{
  content?: JSONContent
  setContentSource: (content: JSONContent) => void
}>()

const editor = new Editor({
  extensions: [
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
  content: props?.content,
  onUpdate: ({ editor }) => {
    debounce({ delay: 500 }, () => {
      props.setContentSource(editor.getJSON())
    })
  },
})

onBeforeUnmount(() => editor.destroy())

const randId = ref(uid(12))

provide('editor', readonly(editor))
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
  justify-content: flex-end;

  width: 100%;
  padding: 0.5rem;

  background-color: $color-black;
  border: solid 0.0625rem $color-grey;
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
}

.editor {
  position: relative;

  display: flex;
  flex: 1 1 auto;
  flex-direction: column;

  min-height: $size-xs;

  word-wrap: break-word;
  white-space: pre-wrap;

  border: solid 0.0625rem $color-grey;

  &:focus-within {
    border-color: $color-silver;
  }

  .ProseMirror {
    height: 100%;
    padding: 1rem;
    p.is-editor-empty:first-child::before {
      pointer-events: none;
      content: attr(data-placeholder);

      float: left;

      height: 0;

      color: $color-grey;
    }

    & > :first-child {
      margin-top: 0 !important;
    }

    & > :last-child {
      margin-bottom: 0 !important;
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
      border-bottom: solid 0.0625rem $color-grey;
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

      input[type='checkbox'] {
        transform: translateY(-0.075em);

        display: grid;
        place-content: center;

        width: 1.75em;
        height: 1.75em;

        color: currentColor;

        appearance: initial;
        border: solid 0.0625rem $color-grey;
        border-radius: $radius-md;

        &::before {
          content: '';

          transform: scale(0);

          width: 1.25em;
          height: 1.25em;

          background-color: $color-yellow;
          clip-path: polygon(
            28% 38%,
            41% 53%,
            75% 24%,
            86% 38%,
            40% 78%,
            15% 50%
          );
        }

        &:checked::before {
          transform: scale(1);
        }

        &:focus-visible {
          outline: solid 0.0625rem $color-yellow;
        }
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
      border-left: solid 0.25rem $color-grey;
      & > :last-child {
        margin-bottom: 0;
      }
    }

    hr {
      height: 0.25em;
      margin: 2rem 0;
      padding: 0;
      background-color: $color-grey;
    }
  }
}
</style>
