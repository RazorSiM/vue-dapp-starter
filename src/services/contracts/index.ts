import {
  Block,
  BlockTag,
  Network,
  Web3Provider,
  getDefaultProvider,
} from "@ethersproject/providers";

import { formatUnits } from "@ethersproject/units";
import { getProvider as getMetamaskProvider } from "~/services/wallets/metamask";
import { isAddress } from "@ethersproject/address";

const network = import.meta.env.VITE_PROVIDER_NETWORK;
const providerOptions = {
  alchemy: import.meta.env.VITE_ALCHEMY_KEY,
  etherscan: import.meta.env.VITE_ETHERSCAN_KEY,
  infura: import.meta.env.VITE_INFURA_KEY,
};

const initDefaultProvider = async () => {
  try {
    return await getDefaultProvider(network, providerOptions);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting the default provider");
    }
  }
};

/**
 *
 * @returns Inits the Web3Provider by passing an ExternalProvider object or returns an error
 */
async function initWeb3Provider(): Promise<Web3Provider> {
  try {
    const provider = await getMetamaskProvider();
    return new Web3Provider(provider);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error initializing the provider");
    }
  }
}

async function getSignerOrProvider(signer: boolean) {
  if (signer) {
    const provider = await initWeb3Provider();
    return provider.getSigner();
  }
  return await initDefaultProvider();
}

const initContractInstance = async (
  contractFactory: any,
  contractAddress: string,
  signer = false,
  errorMessage = "Failed to create the contract instance"
) => {
  const provider = await getSignerOrProvider(signer);
  try {
    return await contractFactory.connect(
      contractAddress,
      provider
      // provider.getSigner()
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(errorMessage);
    }
  }
};

/**
 *
 * @returns Returns a Network object
 */
async function getNetwork(): Promise<Network> {
  try {
    const provider = await initDefaultProvider();
    return await provider.getNetwork();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting the network");
    }
  }
}

/**
 *
 * @param walletAddress Wallet address as string
 * @returns Returns an ENS domain associated to the wallet or an empty string
 */
async function lookupAddress(walletAddress: string): Promise<string> {
  try {
    if (isAddress(walletAddress)) {
      const provider = await initDefaultProvider();
      const network = await getNetwork();
      if (network.chainId !== 1) {
        return "";
      } else {
        const ENS = await provider.lookupAddress(walletAddress);
        if (ENS !== null) {
          return ENS;
        } else {
          return "";
        }
      }
    } else {
      return "";
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting the ENS name");
    }
  }
}

/**
 *
 * @param block BlockTag interface, ex: 'latest'
 * @returns a Block
 */
async function getBlock(block: BlockTag): Promise<Block> {
  try {
    const provider = await initDefaultProvider();
    return await provider.getBlock(block);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting the block");
    }
  }
}

/**
 *
 * @returns The latest block timestamp
 */
async function getLatestBlockTimestamp(): Promise<number> {
  return (await getBlock("latest")).timestamp;
}

/**
 *
 * @param walletAddress Wallet address as a string
 * @returns The ETH balance in eth - ex: 1.337
 */
async function getEthBalance(walletAddress: string): Promise<string> {
  try {
    if (isAddress(walletAddress) || walletAddress.endsWith(".eth")) {
      const provider = await initDefaultProvider();
      const response = await provider.getBalance(walletAddress);
      return formatUnits(response);
    } else {
      return "Not a wallet address";
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting the Eth balance");
    }
  }
}

async function getAvatarUri(ensOrAddress: string): Promise<string> {
  try {
    const provider = await initDefaultProvider();
    let ensName = "";
    if (isAddress(ensOrAddress)) {
      ensName = await lookupAddress(ensOrAddress);
    } else {
      ensName = ensOrAddress;
    }
    const resolver = await provider.getResolver(ensName);
    if (resolver) {
      const avatarUri = await resolver.getText("avatar");
      if (avatarUri && avatarUri.length > 0) {
        return avatarUri;
      }
    }
    return "";
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting the avatar uri");
    }
  }
}

export {
  initWeb3Provider,
  getBlock,
  getLatestBlockTimestamp,
  getEthBalance,
  lookupAddress,
  getNetwork,
  getAvatarUri,
  getSignerOrProvider,
  initDefaultProvider,
  initContractInstance,
};
