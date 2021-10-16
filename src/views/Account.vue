<template>
  <div>Network: {{ walletStore.getChainName }}</div>
  <div>Block: {{ Block }}</div>
  <div>Wallet: {{ walletStore.getAddress }}</div>
  <div v-if="walletStore.getEns !== ''">ENS: {{ walletStore.getEns }}</div>
  <div>Balance: {{ walletStore.getEthBalance }} ETH</div>
  <div
    class="
      mt-3
      rounded
      border border-white border-opacity-10
      flex flex-col
      gap-4
      p-4
    "
  >
    <p>This is a way to estimate the gas in wei for an erc20 transaction</p>
    <input
      v-model="TokenAddress"
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
        border-2 border-gray-800)
        dark:focus:(outline-none
        bg-gray-800
        border-gray-900
        text-opacity-100)
      "
      type="text"
      placeholder="token address"
    />
    <input
      v-model="DestionationWallet"
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
        border-2 border-gray-800)
        dark:focus:(outline-none
        bg-gray-800
        border-gray-900
        text-opacity-100)
      "
      type="text"
      placeholder="wallet address"
    />
    <input
      v-model="QuantityToTransfer"
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
        border-2 border-gray-800)
        dark:focus:(outline-none
        bg-gray-800
        border-gray-900
        text-opacity-100)
      "
      type="text"
      placeholder="quantity"
    />
    <button
      class="rounded-lg px-2 py-0.5 bg-yellow-300 text-gray-800 font-bold"
      @click="
        handleErc20EstimateTransfer(
          DestionationWallet,
          TokenAddress,
          QuantityToTransfer
        )
      "
    >
      Estimate
    </button>
    <div>Gas Estimation: {{ Estimation }}</div>
  </div>
</template>
<script lang="ts" setup>
import { useWalletStore } from "~/stores/wallet";
import { onMounted } from "vue";
import { getBlock } from "~/services/contracts";
import { erc20EstimateTransfer } from "~/services/contracts/erc20";
import { BigNumberish } from "ethers";
const walletStore = useWalletStore();
let Block = $ref(0);
let DestionationWallet = $ref("0x22ba12b2af77Ba70d41d71384d6a3d57F82C6Ce2");
let TokenAddress = $ref("0x7e6eda50d1c833be936492bf42c1bf376239e9e2");

let QuantityToTransfer = $ref("1");
let Estimation: BigNumberish = $ref();
const handleErc20EstimateTransfer = async (
  destionationWallet: string,
  tokenAddress: string,
  quantity: string
) => {
  Estimation = await erc20EstimateTransfer(
    destionationWallet,
    tokenAddress,
    quantity
  );
};

onMounted(async () => {
  const response = await getBlock("latest");
  Block = response.number;
});
</script>
