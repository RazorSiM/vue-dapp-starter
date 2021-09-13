<template>
  <button
    class="
      outline-none
      focus:outline-none
      bg-orange-400
      text-white
      font-bold
      shadow-md
      hover:(bg-orange-500
      shadow-lg)
      transition-colors
      rounded-full
      p-2
      leading-none
      font-medium
    "
    @click="walletStore.requestAccounts()"
  >
    {{ buttonText }}
  </button>
</template>
<script setup lang="ts">
import { useWalletStore } from "/@/stores/wallet";

const walletStore = useWalletStore();
let buttonText = $computed(() => {
  if (walletStore.installed === false) {
    return "Install Metamask";
  } else if (walletStore.getAddress !== "") {
    return walletStore.getEns
      ? walletStore.getEns
      : walletStore.getShortAddress;
  } else {
    return "Connect to Metamask";
  }
});
</script>
