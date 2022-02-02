import {
  getAccounts,
  getChainId,
  getProvider,
  requestAccounts
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

export {
  getProvider,
  watchAsset,
  getAccounts,
  requestAccounts,
  getChainId,
  walletType,
};
