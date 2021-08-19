<template>
  <slot />
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  component: {
    name: "EmptyLayout",
  },
});
</script>
