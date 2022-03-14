import {
  getAccounts,
  getChainId,
  getProvider,
  requestAccounts,
} from "~/services/wallets/injected";

const walletType = "metamask";
const watchAsset = async (
  type = "ERC20",
  address: string,
  symbol: string,
  decimals: number
) => {
  try {
    const metamask = await getProvider(true);
    if (metamask.request) {
      await metamask.request({
        method: "wallet_watchAsset",
        params: {
          //@ts-expect-error type error
          type: type,
          options: {
            address: address,
            symbol: symbol,
            decimals: decimals,
            image: "https://potion.fi/favicon.png",
          },
        },
      });
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error initializing adding the custom token");
    }
  }
};

const getEncryptionPublicKey = async () => {
  const provider = await getProvider(true);

  try {
    const accounts = await getAccounts(true);
    return await provider.request?.({
      method: "eth_getEncryptionPublicKey",
      params: [accounts[0]],
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unable to get the encryption public key");
    }
  }
};

const decryptWithMetamask = async (string: string) => {
  const provider = await getProvider(true);

  try {
    const accounts = await getAccounts(true);
    return await provider.request?.({
      method: "eth_decrypt",
      params: [string, accounts[0]],
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Unable to get the encryption public key");
    }
  }
};

export {
  getProvider,
  watchAsset,
  getAccounts,
  requestAccounts,
  getChainId,
  walletType,
  getEncryptionPublicKey,
  decryptWithMetamask,
};
