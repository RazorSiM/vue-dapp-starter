import type WalletConnectProvider from "@walletconnect/web3-provider";

const WalletConnectChunk = () => import("@walletconnect/web3-provider");
let alreadyEnabled = false;

const initWalletConnectProvider = async () => {
  const provider = (await WalletConnectChunk()).default;
  return new provider({
    infuraId: import.meta.env.VITE_INFURA_KEY,
  });
};

const enableWalletConnectProvider = async (provider: WalletConnectProvider) => {
  await provider.enable();
  if (!alreadyEnabled) {
    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      console.log(accounts);
      window.location.reload();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      console.log(chainId);
      window.location.reload();
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code: number, reason: string) => {
      console.log(code, reason);
      localStorage.clear();
      window.location.reload();
    });
  }

  alreadyEnabled = true;
};
const disconnectWalletConnectProvider = async (
  provider: WalletConnectProvider
) => {
  await provider.disconnect();
};

export {
  initWalletConnectProvider,
  enableWalletConnectProvider,
  disconnectWalletConnectProvider,
};
