<template>
  <button
    class="p-3 border rounded-lg capitalize transition"
    :class="{
      'border-red-500': selectionError,
      'dark:(border-white/10) border-black/10': !selectionError,
    }"
    @click="connectToProvider()"
  >
    {{ props.connector }}
  </button>
</template>
<script lang="ts" setup>
import { IWalletConnectors } from "~/services/wallets";
import { useWalletStore } from "~/stores/wallet";
interface Props {
  connector: keyof IWalletConnectors;
}
const emits = defineEmits(["connectedToProvider"]);
const props = withDefaults(defineProps<Props>(), {
  connector: "metamask",
});
const walletStore = useWalletStore();
let selectionError = $ref(false);
const connectToProvider = async () => {
  walletStore.setWalletConnector(props.connector);
  try {
    await walletStore.connectWallet();
    emits("connectedToProvider");
  } catch (error) {
    selectionError = true;
    console.error(error);
  }
};
</script>
