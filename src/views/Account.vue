<template>
  <div>Wallet: {{ walletStore.getAddress }}</div>
  <div v-if="walletStore.getEns !== ''">ENS: {{ walletStore.getEns }}</div>
  <div>Balance: {{ walletStore.getEthBalance }}</div>
</template>
<script lang="ts" setup>
import { useWalletStore } from "/@/stores/wallet";
const walletStore = useWalletStore();
</script>
