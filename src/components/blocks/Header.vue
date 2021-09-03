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
      <router-link v-slot="{ navigate }" custom :to="{ name: 'Account' }">
        <button
          class="
            focus:outline-none
            disabled:(cursor-not-allowed
            text-gray-300)
            dark:disabled:(text-gray-800)
          "
          :class="route.name === 'Account' ? activeClasses : inactiveClasses"
          :disabled="!walletStore.connected || !walletStore.installed"
          @click="navigate"
        >
          Account
        </button>
      </router-link>
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
import { useWalletStore } from "/@/stores/wallet";
import { onMounted } from "vue";

const walletStore = useWalletStore();
onMounted(async () => {
  await walletStore.setProvider();
  if (walletStore.installed) {
    await walletStore.setConnected();
  }
});

const route = useRoute();
const activeClasses = `font-bold dark:(text-white)`;
const inactiveClasses = `text-gray-500 dark:(text-gray-300)`;
</script>
