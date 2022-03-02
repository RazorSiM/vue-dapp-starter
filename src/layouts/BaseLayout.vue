<template>
  <div
    class="min-h-screen bg-gray-50 w-full transition text-gray-900 duration-100 dark:(bg-gray-900 text-gray-50) p-4"
  >
    <Header>
      <WalletConnectButton @open-wallet-modal="showWalletModal = true" />
      <WalletDisconnectButton v-if="walletStore.connected" />
    </Header>

    <div class="container mx-auto p-10">
      <slot />
    </div>
    <transition
      enter-active-class="duration-300 ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="transform opacity-0"
    >
      <WalletModal
        v-if="showWalletModal"
        @close-wallet-modal="showWalletModal = false"
      />
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useWalletStore } from "~/stores/wallet";
const walletStore = useWalletStore();

let showWalletModal = $ref(false);
</script>
