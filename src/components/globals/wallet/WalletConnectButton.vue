<template>
  <button
    class="outline-none focus:outline-none font-semibold hover:(bg-secondary shadow-md) transition-colors rounded-full p-2 leading-none font-medium flex flex-col items-center"
    @click="handleOpenModal()"
  >
    {{ buttonText }}
  </button>
</template>
<script setup lang="ts">
import { useWalletStore } from "~/stores/wallet";
const emits = defineEmits(["openWalletModal", "logoutWallet"]);
const handleOpenModal = () => {
  emits("openWalletModal");
};
const walletStore = useWalletStore();
let buttonText = $computed(() => {
  if (walletStore.connected && walletStore.address) {
    return walletStore.ens !== "" ? walletStore.ens : walletStore.shortAddress;
  } else {
    return "Connect to Wallet";
  }
});
</script>
