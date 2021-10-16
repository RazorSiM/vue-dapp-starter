<template>
  <Avatar v-if="walletStore.getConnected" />
  <button
    :class="buttonColor"
    class="
      outline-none
      focus:outline-none
      font-semibold
      hover:(bg-secondary
      shadow-md)
      transition-colors
      rounded-full
      p-2
      leading-none
      font-medium
      flex flex-col
      items-center
    "
    @click="handleButton()"
  >
    <template v-if="walletStore.getEns !== ''">
      <span> {{ buttonText }}</span>
      <span class="text-xs font-light text-fmuted font-plex">{{
        walletStore.getShortAddress
      }}</span>
    </template>
    <span v-else class="text-sm font-semibold text-fmuted font-plex">{{
      buttonText
    }}</span>
  </button>
</template>
<script setup lang="ts">
import { useWalletStore } from "~/stores/wallet";
const walletStore = useWalletStore();
let buttonText = $computed(() => {
  if (walletStore.installed === false) {
    return "Install Metamask";
  } else if (walletStore.getAddress !== "") {
    return walletStore.getEns !== ""
      ? walletStore.getEns
      : walletStore.getShortAddress;
  } else {
    return "Connect to Metamask";
  }
});
let buttonColor = $computed(() => {
  if (buttonText === "Install Metamask") {
    return "bg-secondary text-foreground shadow";
  } else if (buttonText === "Connect to Metamask") {
    return "bg-primary text-base00 shadow";
  }
  return "bg-transparent text-foreground";
});

const handleButton = async () => {
  if (buttonText === "Install Metamask") {
    window.open("https://metamask.io/", "_blank");
  } else {
    await walletStore.requestAccounts();
  }
};
</script>
