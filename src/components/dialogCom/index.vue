<template>
  <div id="dialog" :class="show ? show : ''">
    <div id="main">
      <p>{{ title ? title : '' }}</p>
      <div id="center">
        <slot name="center" />
      </div>
      <div id="bottom">
        <slot name="bottom" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dailogCom',
  props: {
    title: {
      type: String,
    },
    show: {
      type: Boolean,
    },
  },
};
</script>

<style scoped>
@import './style.css';
</style>