import { ExternalProvider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";

const walletType = "injected";

/**
 *
 * @returns Return window.ethereum or throw an error
 */
const getProvider = async (
  mustBeMetamask = false
): Promise<ExternalProvider> => {
  try {
    const provider = (await detectEthereumProvider({
      mustBeMetaMask: mustBeMetamask,
    })) as ExternalProvider;
    if (provider !== null) {
      return provider;
    }
    throw new Error("Error getting your Wallet");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting your Wallet");
    }
  }
};

/**
 *
 * @returns Array of accounts. For now, it will return always an array with the account selected in metamask. In the future, will return an array of accounts
 */
const getAccounts = async (mustBeMetamask: boolean): Promise<string[]> => {
  try {
    const provider = await getProvider(mustBeMetamask);
    return await provider.request?.({
      method: "eth_accounts",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error trying to get your accounts[s]");
    }
  }
};

const getChainId = async (): Promise<string> => {
  try {
    const provider = await getProvider();
    return await provider.request?.({ method: "eth_chainId" });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting the chain id");
    }
  }
};

/**
 *
 * @returns return an array of accounts[the one selected] if the app has the permission to access the wallet. If not, will fire up the permission request and then return the array of accounts
 */
const requestAccounts = async (): Promise<string[]> => {
  try {
    const provider = await getProvider();
    return await provider.request?.({
      method: "eth_requestAccounts",
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error during the dApp approval");
    }
  }
};

export { getProvider, getAccounts, requestAccounts, getChainId, walletType };
