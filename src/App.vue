<template>
  <component :is="layout" class="font-nunito">
    <router-view />
  </component>
</template>

<script lang="ts" setup>
const route = useRoute();
let layout = $computed(() => {
  return route.meta.layout;
});
</script>
