<template>
  <div
    class="
      flex
      rounded-full
      items-center
      justify-between
      px-5
      py-3
      bg-gray-100
      shadow-lg
      dark:(bg-gray-700)
    "
  >
    <div class="flex items-center justify-start space-x-5">
      <router-link
        :class="route.name === 'Home' ? activeClasses : inactiveClasses"
        :to="{ name: 'Home' }"
        >Home</router-link
      >
      <router-link
        :class="route.name === 'Account' ? activeClasses : inactiveClasses"
        :to="{ name: 'Account' }"
        >Account</router-link
      >
    </div>

    <div class="justify-self-end flex items-center space-x-5">
      <dark-toggle />
      <metamask-connect />
    </div>
  </div>
</template>
<script lang="ts" setup>
import DarkToggle from "/@/components/globals/DarkToggle.vue";
import MetamaskConnect from "/@/components/globals/MetamaskConnect.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const activeClasses = `font-bold dark:(text-white)`;
const inactiveClasses = `text-gray-500 dark:(text-gray-300)`;
</script>
