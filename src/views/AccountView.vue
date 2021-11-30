<template>
  <CardContainer class="flex flex-col gap-4">
    <div>Network: {{ walletStore.getChainName }}</div>
    <div>Block: {{ Block }}</div>
    <div>Wallet: {{ walletStore.getAddress }}</div>
    <div v-if="walletStore.getEns !== ''">ENS: {{ walletStore.getEns }}</div>
    <div>Balance: {{ walletStore.getEthBalance }} ETH</div>
  </CardContainer>
  <CardContainer class="flex flex-col gap-4">
    <h2>Transfer ETH</h2>
    <InputField v-model="addressTo" placeholder="TO" />
    <InputField v-model="ethToTransfer" type="number" min="0.00001" />
    <p>Transaction:</p>
    <pre class="text-xs font-mono max-h-[200px] overflow-y-auto">{{ tx }}</pre>
    <p>Receipt:</p>
    <pre class="text-xs font-mono max-h-[200px] overflow-y-auto">{{
      receipt
    }}</pre>
    <button
      class="bg-red-500 rounded-lg px-2 py-1.5 font-bold"
      @click="handleTransferEth()"
    >
      Send ETH
    </button>
  </CardContainer>
  <CardContainer class="flex flex-col gap-4">
    <p>This returns the unit of gas for a simple erc20 transaction</p>
    <InputField v-model="TokenAddress" placeholder="token address" />
    <InputField v-model="DestionationWallet" placeholder="wallet address" />
    <InputField v-model="QuantityToTransfer" placeholder="quantity" />
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
  </CardContainer>
</template>
<script lang="ts" setup>
import { useWalletStore } from "~/stores/wallet";
import { onMounted } from "vue";
import { getBlock } from "~/services/contracts";
import { erc20EstimateTransfer } from "~/services/contracts/erc20";
import type { BigNumberish } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { getSignerOrProvider, initDefaultProvider } from "~/services/contracts";
const addressTo = ref("");
const ethToTransfer = ref(0.0001);
const tx = ref();
const receipt = ref();
const handleTransferEth = async () => {
  const signer = await getSignerOrProvider(true);
  //@ts-expect-error some problems with typings - if you find a solution, please provide it!
  tx.value = await signer.sendTransaction({
    to: addressTo.value,
    value: parseEther(unref(ethToTransfer.value.toString())),
  });
  receipt.value = await tx.value.wait();
};
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
  const provider = await initDefaultProvider();
  provider.on("block", (block) => {
    Block = block;
    walletStore.getBalance();
  });
});
</script>
