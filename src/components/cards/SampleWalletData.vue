<template>
  <div
    class="
      border border-white
      rounded-xl
      border-opacity-30
      p-4
      mt-4
      max-w-[400px]
      break-words
    "
  >
    <input
      v-model="walletAddress"
      type="text"
      class="
        py-1
        pl-2
        bg-gray-900
        text-white
        rounded-lg
        w-full
        border-2 border-gray-800
        text-opacity-40
        transition
        focus:(outline-none
        bg-gray-800
        border-gray-900
        text-opacity-100)
      "
      placeholder="input a wallet address here"
    />
    <div v-if="status === 'RUNNING'" class="mt-6">...LOADING...</div>
    <div v-if="status === 'ERROR'" class="mt-6">ERROR FETCHING DATA</div>
    <div v-if="status === 'SUCCESS'" class="flex flex-col space-y-3 mt-6">
      <p>Network: {{ network.name }}</p>
      <p>Eth Balance: {{ ethBalance }}</p>
      <p>Latest Block: {{ latestBlockTimestamp }}</p>
      <p>ENS: {{ ensAddress }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useEthereum } from "~/composables/useEthereum";

let walletAddress = ref("");

const {
  status,
  network,
  ethBalance,
  latestBlockTimestamp,
  ensAddress,
  refetchNetwork,
  refetchEthBalance,
  refetchLatestBlockTimestamp,
  refetchEnsAddress,
} = useEthereum(walletAddress);

onMounted(async () => {
  if (!latestBlockTimestamp.value) {
    await refetchNetwork();
    await refetchEthBalance();
    await refetchLatestBlockTimestamp();
    await refetchEnsAddress();
  }
});
</script>
