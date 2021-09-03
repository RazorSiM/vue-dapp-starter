<template>
  <div>Network: {{ walletStore.getChainName }}</div>
  <div>Block: {{ Block }}</div>
  <div>Wallet: {{ walletStore.getAddress }}</div>
  <div v-if="walletStore.getEns !== ''">ENS: {{ walletStore.getEns }}</div>
  <div>Balance: {{ walletStore.getEthBalance }} ETH</div>
</template>
<script lang="ts" setup>
import { useWalletStore } from "/@/stores/wallet";
import { onMounted } from "vue";
import { getBlock } from "/@/services/contracts";

const walletStore = useWalletStore();
let Block = $ref(0);
onMounted(async () => {
  const response = await getBlock("latest");
  Block = response.number;
});
</script>
