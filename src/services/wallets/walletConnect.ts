import type WalletConnectProvider from "@walletconnect/web3-provider";

const WalletConnectChunk = () => import("@walletconnect/web3-provider");
// let alreadyEnabled = false;

const walletConnectEndpoints = (network: string) => {
  if (network === "localhost") {
    return ["http://localhost:8545"];
  }
  return [
    `https://eth-${network}.alchemyapi.io/v2/${
      import.meta.env.VITE_ALCHEMY_KEY
    }`,
    `https://eth-${network}.alchemyapi.io/v2/${
      import.meta.env.VITE_ETHERSCAN_KEY
    }`,
    `https://${network}.infura.io/v3/${import.meta.env.VITE_INFURA_KEY}`,
  ];
};

const initWalletConnectProvider = async (network: string) => {
  const rpcObject: { [key: number]: string } = {};
  const endpoints = walletConnectEndpoints(network);
  console.log(endpoints);
  endpoints.forEach((endpoint, index) => {
    rpcObject[index] = endpoint;
  });
  console.log(rpcObject);
  const provider = (await WalletConnectChunk()).default;
  return new provider({
    infuraId: import.meta.env.VITE_INFURA_KEY,
  });
};

const enableWalletConnectProvider = async (provider: WalletConnectProvider) => {
  await provider.enable();
};
const disconnectWalletConnectProvider = async (
  provider: WalletConnectProvider
) => {
  await provider.disconnect();
};

export {
  initWalletConnectProvider,
  walletConnectEndpoints,
  enableWalletConnectProvider,
  disconnectWalletConnectProvider,
};
