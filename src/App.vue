<template>
  <PolyEditor
    :content="content"
    :setContentSource="setContentSource"
  />
</template>

<script setup lang="ts">
import { type JSONContent } from '@tiptap/vue-3'
import { ref } from 'vue'

import PolyEditor from './components/PolyEditor.vue'

const content = ref({})

const setContentSource = (newContent: JSONContent) => {
  content.value = newContent
}
</script>

<style lang="scss">
.app {
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}
</style>
