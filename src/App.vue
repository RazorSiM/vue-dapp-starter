<template>
  <component :is="layout" class="font-nunito">
    <router-view />
  </component>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";

const route = useRoute();
const layout = $computed(() => {
  return route.meta.layout;
});
</script>
