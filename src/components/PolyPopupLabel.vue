<template>
  <span class="popup-label"><slot /></span>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
@import '~/styles/vars.scss';

button:has(.popup-label):hover {
  .popup-label {
    top: -2.5em;
  }
}
.popup-label {
  display: block;
  border: solid 0.0625rem $color-tertiary;
  padding: 0.25rem 0.5rem;
  border-radius: $radius-sm;
  position: absolute;
  top: -30000em;
  background-color: $color-background;
  color: $color-text;
  z-index: $z-index-popover;
  font-size: $font-size-sm;
  white-space: nowrap;
  text-align: center;

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
    border-top-color: $color-background;
    border-width: 10px;
    margin-left: -10px;
  }

  &::before {
    border-top-color: $color-tertiary;
    border-width: 12px;
    margin-left: -12px;
  }
}
</style>
