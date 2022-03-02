import { getWalletSigner, WalletType } from "~/services/wallets";

import { isAddress } from "@ethersproject/address";
import {
  BaseProvider,
  Block,
  BlockTag,
  getDefaultProvider,
  Network,
  WebSocketProvider
} from "@ethersproject/providers";
import { formatUnits } from "@ethersproject/units";

const network = import.meta.env.VITE_PROVIDER_NETWORK;

const providerOptions = {
  alchemy: import.meta.env.VITE_ALCHEMY_KEY,
  etherscan: import.meta.env.VITE_ETHERSCAN_KEY,
  infura: import.meta.env.VITE_INFURA_KEY,
};

const initDefaultProvider = async (
  websocket = false
): Promise<BaseProvider> => {
  try {
    if (websocket) {
      if (network === "localhost") {
        return new WebSocketProvider(`ws://localhost:8545`);
      } else {
        return new WebSocketProvider(
          `wss://eth-${network}.alchemyapi.io/v2/${providerOptions.alchemy}`
        );
      }
    }
    if (network === "localhost") {
      return await getDefaultProvider("http://localhost:8545", providerOptions);
    }
    return await getDefaultProvider(network, providerOptions);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Cannot initialize the DefaultProvider: ${error.message}`
      );
    } else {
      throw new Error("Error getting the default provider");
    }
  }
};

async function getSignerAddress(walletConnector: WalletType) {
  const signer = await getWalletSigner(walletConnector);
  try {
    return await signer.getAddress();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Cannot get the signer address for ${walletConnector}: ${error.message}`
      );
    } else {
      throw new Error(`Cannot get the signer address for ${walletConnector}`);
    }
  }
}

async function getSignerNetwork(walletConnector: WalletType) {
  const signer = await getWalletSigner(walletConnector);
  try {
    return await signer.getChainId();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Cannot get the signer network: ${error.message}`);
    } else {
      throw new Error("Cannot get the signer network");
    }
  }
}
async function getSignerBalance(walletConnector: WalletType) {
  const signer = await getWalletSigner(walletConnector);
  try {
    return formatUnits(await signer.getBalance());
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Cannot get the signer balance: ${error.message}`);
    } else {
      throw new Error("Cannot get the signer balance");
    }
  }
}

async function getSignerData(walletConnector: WalletType) {
  const signer = await getWalletSigner(walletConnector);
  try {
    const address = await signer.getAddress();
    const chainId = await signer.getChainId();
    const ethBalance = formatUnits(await signer.getBalance());
    const txCount = await signer.getTransactionCount();
    const ens = await lookupAddress(address);
    return { address, chainId, ethBalance, txCount, ens };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Cannot get the signer data: ${error.message}`);
    } else {
      throw new Error("Cannot get the signer data");
    }
  }
}

const initContractInstance = async (
  contractFactory: any,
  contractAddress: string,
  needSigner = false,
  walletConnector: WalletType,
  errorMessage = "Failed to create the contract instance"
) => {
  let provider = null;
  if (needSigner === true) {
    provider = await getWalletSigner(walletConnector);
  } else {
    provider = await initDefaultProvider();
  }
  try {
    return await contractFactory.connect(contractAddress, provider);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${errorMessage}: ${error.message}`);
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
      throw new Error(`Cannot get the Network: ${error.message}`);
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
      throw new Error(
        `Cannot get the ENS name for ${walletAddress}: ${error.message}`
      );
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
      throw new Error(`Cannot get the block: ${error.message}`);
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
      throw new Error(
        `Cannot get the balance for ${walletAddress}: ${error.message}`
      );
    } else {
      throw new Error("Error getting the Eth balance");
    }
  }
}

export {
  getBlock,
  getLatestBlockTimestamp,
  getEthBalance,
  lookupAddress,
  getNetwork,
  initDefaultProvider,
  initContractInstance,
  getSignerAddress,
  getSignerNetwork,
  getSignerData,
  getSignerBalance,
  getWalletSigner,
};
