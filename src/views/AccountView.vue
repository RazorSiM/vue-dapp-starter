<template>
  <CardContainer class="flex flex-col gap-4">
    <div>Network: {{ walletStore.chainName }}</div>
    <div>Block: {{ Block }}</div>
    <div>Wallet: {{ walletStore.address }}</div>
    <div v-if="walletStore.ens !== ''">ENS: {{ walletStore.ens }}</div>
    <div>Balance: {{ walletStore.ethBalance }} ETH</div>
  </CardContainer>
  <CardContainer class="flex flex-col gap-4">
    <h2>Transfer ETH</h2>
    <InputText v-model="addressTo" placeholder="TO" />
    <InputNumber
      v-model="ethToTransfer"
      label="Amount in ETH"
      :min="0.001"
      :step="0.001"
      :to-fixed="3"
    />
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
    <InputText v-model="TokenAddress" placeholder="token address" />
    <InputText v-model="DestinationWallet" placeholder="wallet address" />
    <InputText v-model="QuantityToTransfer" placeholder="quantity" />
    <button
      class="rounded-lg px-2 py-0.5 bg-yellow-300 text-gray-800 font-bold"
      @click="
        handleErc20EstimateTransfer(
          DestinationWallet,
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
import type {
  TransactionReceipt,
  TransactionResponse,
} from "@ethersproject/providers";
import { useWalletStore } from "~/stores/wallet";
import { onMounted } from "vue";
import { getBlock } from "~/services/contracts";
import { erc20EstimateTransfer } from "~/services/contracts/erc20";
import type { BigNumberish } from "@ethersproject/bignumber";
import { parseEther } from "@ethersproject/units";
import { getWalletSigner, initDefaultProvider } from "~/services/contracts";
import { WalletType } from "~/services/wallets";

let addressTo = $ref("");
let ethToTransfer = $ref("0");
let tx = $ref<TransactionResponse>();
let receipt = $ref<TransactionReceipt>();
const walletStore = useWalletStore();

const handleTransferEth = async () => {
  if (walletStore.walletConnector) {
    const signer = await getWalletSigner(walletStore.walletConnector);
    tx = await signer.sendTransaction({
      to: addressTo,
      value: parseEther(unref(ethToTransfer)),
    });
    receipt = await tx.wait();
  }
};
let Block = $ref(0);
let DestinationWallet = $ref("0x22ba12b2af77Ba70d41d71384d6a3d57F82C6Ce2");
let TokenAddress = $ref("0x7e6eda50d1c833be936492bf42c1bf376239e9e2");

let QuantityToTransfer = $ref("1");
let Estimation: BigNumberish = $ref();
const handleErc20EstimateTransfer = async (
  DestinationWallet: string,
  tokenAddress: string,
  quantity: string
) => {
  Estimation = await erc20EstimateTransfer(
    DestinationWallet,
    tokenAddress,
    quantity,
    walletStore.walletConnector as WalletType
  );
};

onMounted(async () => {
  const response = await getBlock("latest");
  Block = response.number;
  const provider = await initDefaultProvider(true);
  provider.on("block", async (block) => {
    Block = block;
    await walletStore.getEthBalance();
  });
});
</script>
