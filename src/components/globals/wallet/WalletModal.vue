<template>
  <div
    class="w-screen h-screen backdrop-filter backdrop-blur-xl bg-black/10 fixed top-0 left-0 flex justify-center items-center"
  >
    <div
      class="w-full sm:(max-w-sm) lg:(max-w-3xl) border border-2 dark:(bg-gray-800 border-gray-900) bg-gray-300 border-gray-500 rounded-xl p-4"
    >
      <div class="flex justify-end">
        <button @click="handleCloseModal()">
          <IconPixelarticonsCloseBox
            class="transition transform hover:(scale-110)"
          />
        </button>
      </div>
      <div class="flex flex-wrap gap-4">
        <WalletProviderButton
          v-for="connector in connectors"
          :key="connector"
          :connector="connector"
          @connected-to-provider="emits('closeWalletModal')"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { IWalletConnectors } from "~/services/wallets";
const emits = defineEmits(["closeWalletModal"]);
const handleCloseModal = () => {
  emits("closeWalletModal");
};
const connectors: Array<keyof IWalletConnectors> = [
  "metamask",
  "frame",
  "injected",
];
</script>
