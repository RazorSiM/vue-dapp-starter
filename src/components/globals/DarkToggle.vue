<template>
  <button
    class="rounded-full font-bold bg-yellow-500 text-yellow-200 hover:(bg-yellow-200 text-yellow-500) leading-none transition focus:outline-none dark:(bg-indigo-200 text-indigo-900) dark:hover:(bg-indigo-900 text-indigo-200) h-7 w-7 flex items-center justify-center"
    @click="toggleDark()"
  >
    <IconPixelarticonsHeart v-if="!isDark" />

    <IconPixelarticonsSun v-else />
  </button>
</template>
<script lang="ts" setup>
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
