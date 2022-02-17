import type WalletConnectProvider from "@walletconnect/web3-provider";

const walletconnectChunk = () => import("@walletconnect/web3-provider");
let alreadyEnabled = false;

const initWalletConnectProvider = async (endpoint: string) => {
  const provider = (await walletconnectChunk()).default;
  return new provider({
    rpc: { 1: endpoint },
  });
};

const enableWalleConnectProvider = async (provider: WalletConnectProvider) => {
  await provider.enable();
  if (!alreadyEnabled) {
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts);
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log(chainId);
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code: number, reason: string) => {
      console.log(code, reason);
    });
  }

  alreadyEnabled = true;
};
const disconnectWalleConnectProvider = async (
  provider: WalletConnectProvider
) => {
  await provider.disconnect();
};

export {
  initWalletConnectProvider,
  enableWalleConnectProvider,
  disconnectWalleConnectProvider,
};
