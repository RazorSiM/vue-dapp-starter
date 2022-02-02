<template>
  <div class="flex items-center justify-between px-5 py-3">
    <div class="flex items-center justify-start space-x-5">
      <DarkToggle />
      <router-link
        :class="route.name === 'Home' ? activeClasses : inactiveClasses"
        :to="{ name: 'Home' }"
        >Home</router-link
      >
      <router-link v-slot="{ navigate }" custom :to="{ name: 'Account' }">
        <button
          class="focus:outline-none disabled:(cursor-not-allowed text-gray-300) dark:disabled:(text-gray-800)"
          :class="route.name === 'Account' ? activeClasses : inactiveClasses"
          :disabled="!walletStore.connected"
          @click="navigate"
        >
          Account
        </button>
      </router-link>
    </div>

    <div class="justify-self-end flex items-center space-x-2">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useWalletStore } from "~/stores/wallet";

const walletStore = useWalletStore();
const route = useRoute();
const activeClasses = `font-bold dark:(text-white)`;
const inactiveClasses = `text-gray-500 dark:(text-gray-300)`;
</script>
