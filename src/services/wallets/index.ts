import { httpEndpoint as frameHttpEndpoint } from "~/services/wallets/frame";
/**
 * TODO: integrate at least walletConnect and develop the wallet selection logic
 * I need to wait for walletConnect to release a library compatible with rollup/vite
 */
import { getAccounts, getProvider } from "~/services/wallets/injected";

import {
  JsonRpcProvider,
  JsonRpcSigner,
  Web3Provider,
} from "@ethersproject/providers";

const initJsonRpcProvider = (endpoint: string) => {
  try {
    return new JsonRpcProvider(endpoint);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error getting the RPC Provider: ${error.message}`);
    } else {
      throw new Error("Error getting the RPC Provider");
    }
  }
};
const initJsonRpcSigner = async (endpoint: string) => {
  try {
    const provider = initJsonRpcProvider(endpoint);
    return provider.getSigner();
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
/**
 *
 * @returns Inits the Web3Provider by passing an ExternalProvider object or returns an error
 */
async function initWeb3Provider(mustBeMetamask = false) {
  try {
    /**
     * Check if the provider is connected and we have permissions to access the accounts
     */
    const provider = await getProvider(mustBeMetamask);
    if (provider) {
      const accounts = await provider.request?.({ method: "eth_accounts" });
      if (accounts.length > 0) {
        return new Web3Provider(provider);
      } else {
        const requestedAccounts = await provider.request?.({
          method: "eth_requestAccounts",
        });
        if (requestedAccounts.length > 0) {
          return new Web3Provider(provider);
        } else {
          throw new Error("Error getting your account");
        }
      }
    } else {
      throw new Error("Error getting the provider");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error getting the Web3 Provider: ${error.message}`);
    } else {
      throw new Error("Error initializing the provider");
    }
  }
}
async function initWeb3Signer(mustBeMetaMask = false): Promise<JsonRpcSigner> {
  try {
    const provider = await initWeb3Provider(mustBeMetaMask);

    return provider.getSigner();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error getting the Web3 Signer: ${error.message}`);
    } else {
      throw new Error("Error initializing the provider");
    }
  }
}

type CallbackJsonRpcSigner = (
  ...args: any[]
) => Promise<JsonRpcSigner> | JsonRpcSigner;
export interface IWalletConnectors {
  metamask: [CallbackJsonRpcSigner, true];
  injected: [CallbackJsonRpcSigner, false];
  frame: [CallbackJsonRpcSigner, string];
}

const walletConnectors: IWalletConnectors = {
  metamask: [initWeb3Signer, true],
  injected: [initWeb3Signer, false],
  frame: [initJsonRpcSigner, frameHttpEndpoint],
};

export { walletConnectors };
