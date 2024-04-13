<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script setup>
const url = ref('https://gitee.com/lemon_plus/txing_admin_vue3');

function goto() {
  window.open(url.value)
}
</script>
