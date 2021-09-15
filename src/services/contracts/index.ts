import {
  Block,
  BlockTag,
  Network,
  Web3Provider,
} from "@ethersproject/providers";

import { formatUnits } from "@ethersproject/units";
import { getProvider } from "~/services/wallets/metamask";

/**
 *
 * @returns Inits the Web3Provider by passing an ExternalProvider object or returns an error
 */
async function initWeb3Provider(): Promise<Web3Provider> {
  try {
    const provider = await getProvider();
    return new Web3Provider(provider);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error initializing the provider");
    }
  }
}

/**
 *
 * @returns Returns a Network object
 */
async function getNetwork(): Promise<Network> {
  try {
    const provider = await initWeb3Provider();
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
    const provider = await initWeb3Provider();
    const network = await getNetwork();
    if (network.chainId !== 1) {
      return "";
    } else {
      const ENS = provider.lookupAddress(walletAddress);
      if (ENS !== null) {
        return ENS;
      } else {
        return "";
      }
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
    const provider = await initWeb3Provider();
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
    const provider = await initWeb3Provider();
    const response = await provider.getBalance(walletAddress);
    return formatUnits(response);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error getting the Eth balance");
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
};
