import { httpEndpoint as frameHttpEndpoint } from "~/services/wallets/frame";
import { getProvider } from "~/services/wallets/injected";
import {
  enableWalletConnectProvider,
  initWalletConnectProvider,
} from "~/services/wallets/walletConnect";

import {
  JsonRpcProvider,
  JsonRpcSigner,
  Web3Provider,
} from "@ethersproject/providers";

const network = import.meta.env.VITE_PROVIDER_NETWORK;

const initJsonRpcSigner = (endpoint: string) => {
  try {
    return new JsonRpcProvider(endpoint).getSigner();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Cannot initialize the signer/provider at url ${endpoint}: ${error.message}`
      );
    } else {
      throw new Error(
        `Cannot initialize the signer/provider at url ${endpoint}`
      );
    }
  }
};

async function walletConnectWeb3Signer(): Promise<JsonRpcSigner> {
  try {
    const walletConnectProvider = await initWalletConnectProvider();
    await enableWalletConnectProvider(walletConnectProvider);
    const web3Provider = new Web3Provider(walletConnectProvider);
    return web3Provider.getSigner();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error getting the Web3 Provider: ${error.message}`);
    } else {
      throw new Error("Error initializing the provider");
    }
  }
}
/**
 *
 * @returns Inits the Web3Provider by passing an ExternalProvider object or returns an error
 */
async function initWeb3Signer(mustBeMetamask = false) {
  try {
    /**
     * Check if the provider is connected and we have permissions to access the accounts
     */
    const provider = await getProvider(mustBeMetamask);
    if (provider) {
      const accounts = await provider.request?.({ method: "eth_accounts" });
      if (accounts.length > 0) {
        return new Web3Provider(provider).getSigner();
      } else {
        const requestedAccounts = await provider.request?.({
          method: "eth_requestAccounts",
        });
        if (requestedAccounts.length > 0) {
          return new Web3Provider(provider).getSigner();
        } else {
          throw new Error("Error getting your account");
        }
      }
    } else {
      throw new Error("Error getting the signer");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error getting the Web3 Signer: ${error.message}`);
    } else {
      throw new Error(`Error getting the Web3 Signer`);
    }
  }
}

export type WalletType =
  | ""
  | "metamask"
  | "injected"
  | "frame"
  | "walletConnect";

async function getWalletSigner(walletType: WalletType): Promise<JsonRpcSigner> {
  if (walletType === "metamask") {
    return initWeb3Signer(true);
  }
  if (walletType === "injected") {
    return initWeb3Signer(false);
  }
  if (walletType === "frame") {
    return initJsonRpcSigner(frameHttpEndpoint);
  }
  if (walletType === "walletConnect") {
    return walletConnectWeb3Signer();
  }
  throw new Error("Wallet type not found");
}

export { getWalletSigner };
