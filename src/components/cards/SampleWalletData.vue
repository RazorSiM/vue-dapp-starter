<template>
  <div
    class="
      rounded-xl
      border-opacity-30
      p-4
      mt-4
      max-w-[400px]
      break-words
      bg-light-500
      shadow-md
      dark:(bg-gray-800)
    "
  >
    <h1 class="mb-3">Wallet Info Card</h1>
    <input
      v-model="walletAddress"
      type="text"
      class="
        py-1
        pl-2
        rounded-lg
        w-full
        text-opacity-40
        transition
        bg-light-900
        focus:(outline-none
        bg-light-700
        border-light-900
        text-opacity-100)
        dark:(
        bg-gray-900
        text-white
        )
        dark:focus:(outline-none
        ring-2 ring-gray-900
        bg-gray-700
        text-opacity-100)
      "
      placeholder="input a wallet address here"
    />
    <div v-if="status === 'RUNNING'" class="mt-6">...LOADING...</div>
    <div v-if="status === 'ERROR'" class="mt-6">ERROR FETCHING DATA</div>
    <div v-if="status === 'SUCCESS'" class="flex flex-col space-y-3 mt-6">
      <p>ENS Avatar or Blockie:</p>
      <img
        v-if="image"
        class="h-20 w-20 rounded-full"
        :src="image"
        alt="ENS Avatar"
      />
      <img
        v-if="!image && blockie"
        class="h-20 w-20 rounded-full"
        :src="blockie"
        alt="Blockie Avatar"
      />
      <p>
        Network:
        <span class="font-bold text-teal-400">{{ network?.name }}</span>
      </p>
      <p>
        Eth Balance:
        <span class="font-bold text-teal-400">{{ ethBalance }}</span>
      </p>
      <p>
        Latest Block:<span class="font-bold text-teal-400">{{
          latestBlockTimestamp
        }}</span>
      </p>
      <p>
        ENS: <span class="font-bold text-teal-400">{{ ensAddress }}</span>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useWalletInfo } from "~/composables/useWalletInfo";
import { useEnsAvatar } from "~/composables/useEnsAvatar";
import makeBlockie from "ethereum-blockies-base64";
let blockie = $ref<string>();
let walletAddress = ref("");

const {
  status,
  network,
  ethBalance,
  latestBlockTimestamp,
  ensAddress,
  getNetwork,
  getLatestBlockTimestamp,
} = useWalletInfo(walletAddress);
const { image } = useEnsAvatar(walletAddress);

debouncedWatch(
  walletAddress,
  () => {
    blockie = makeBlockie(unref(walletAddress));
  },
  { debounce: 1000 }
);
onMounted(async () => {
  await getNetwork();
  await getLatestBlockTimestamp();
});
</script>
