<template>
  <button
    class="flex items-center transition transform hover:(scale-110)"
    @click="handleDisconnect()"
  >
    <IconPixelarticonsLogout />
  </button>
</template>
/
<script lang="ts" setup>
import { useWalletStore } from "~/stores/wallet";
const router = useRouter();
const walletStore = useWalletStore();
const handleDisconnect = () => {
  walletStore.disconnectWallet();
  router.push("/");
};
</script>
