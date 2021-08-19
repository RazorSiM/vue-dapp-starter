<template>
  <button
    class="
      rounded-full
      font-bold
      bg-yellow-500
      text-yellow-200
      hover:(bg-yellow-200
      text-yellow-500)
      leading-none
      p-2
      transition
      focus:outline-none
      dark:(bg-indigo-200
      text-indigo-900)
      dark:hover:(bg-indigo-900
      text-indigo-200)
    "
    @click="toggleDark()"
  >
    <svg
      v-if="!isDark"
      xmlns="http://www.w3.org/2000/svg"
      class="h-16px w-16px"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  </button>
</template>
<script lang="ts" setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
