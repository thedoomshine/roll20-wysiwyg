<template>
  <PolyEditor
    :modelValue="content"
    @update:modelValue="setContentSource"
  />

  <div class="output__wrapper">
    <p>code output:</p>
    <Codemirror
      v-model="code"
      :extensions="extensions"
      :autofocus="false"
      :indent-with-tab="true"
      :tab-size="2"
      :disabled="true"
      :line-wrapping="true"
    />
  </div>
</template>

<script setup lang="ts">
import { json } from '@codemirror/lang-json'
import { type JSONContent } from '@tiptap/vue-3'
import { basicSetup } from 'codemirror'
import { computed, ref } from 'vue'
import { Codemirror } from 'vue-codemirror'

import PolyEditor from './components/PolyEditor.vue'

const content = ref({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      attrs: {
        textAlign: 'left',
      },
    },
  ],
} as JSONContent)

const code = computed(() => JSON.stringify(content.value, null, 2))
const extensions = [json(), basicSetup]

const setContentSource = (newContent: JSONContent) => {
  content.value = newContent
}
</script>

<style lang="scss">
@import './styles//vars.scss';

.app {
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.output__wrapper {
  font-family: $font-mono;
  max-width: $size-sm;
  width: 100%;

  p {
    font-size: $font-size-sm;
    margin-bottom: 0.5rem;
  }
}
</style>
