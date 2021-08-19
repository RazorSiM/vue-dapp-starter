import { ExternalProvider } from "@ethersproject/providers";
import detectEthereumProvider from "@metamask/detect-provider";

/**
 *
 * @returns Return window.ethereum or throw an error
 */
const getProvider = async (): Promise<ExternalProvider> => {
  try {
    const provider = (await detectEthereumProvider({
      mustBeMetaMask: true,
    })) as ExternalProvider;
    if (provider !== null) {
      return provider;
    } else {
      throw "There's a problem with your wallet";
    }
  } catch (error) {
    throw new Error(error);
  }
};

/**
 *
 * @returns Array of accounts. For now, it will return always an array with the account selected in metamask. In the future, will return an array of accounts
 */
const getAccounts = async (): Promise<string[]> => {
  try {
    const provider = await getProvider();
    return await provider.request?.({
      method: "eth_accounts",
    });
  } catch (error) {
    throw new Error(error);
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
    throw new Error(error);
  }
};

export { getProvider, getAccounts, requestAccounts };
