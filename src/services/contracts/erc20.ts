import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { Erc20, Erc20__factory } from "~/types/chain";
import { IWalletConnectors, walletConnectors } from "../wallets";

import { ContractTransaction } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import { initContractInstance } from "~/services/contracts";

const initERC20Contract = async (
  signer: boolean,
  address: string,
  walletConnector: keyof IWalletConnectors
): Promise<Erc20> => {
  try {
    return await initContractInstance(
      Erc20__factory,
      address,
      signer,
      walletConnector
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to connect to the ERC20 Contract");
    }
  }
};

const erc20Allowance = async (
  tokenAddress: string,
  contractAddress: string,
  digits: number,
  walletConnectors: keyof IWalletConnectors
) => {
  const contract = await initERC20Contract(
    false,
    tokenAddress,
    walletConnectors
  );
  try {
    return formatUnits(
      await contract.allowance(contractAddress, contractAddress),
      digits
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error while retrieving the erc20 allowance");
    }
  }
};
/**
 *
 * @param tokenAddress Contract address of the ERC20 token
 * @param contractAddress Contract address to approve the spending for
 * @param amount Amount to approve
 * @param digits ERC20 token digits
 * @returns A ContractTransaction
 */
const erc20Approval = async (
  tokenAddress: string,
  contractAddress: string,
  amount: BigNumberish,
  digits: number,
  walletConnectors: keyof IWalletConnectors
): Promise<ContractTransaction> => {
  const contract = await initERC20Contract(
    true,
    tokenAddress,
    walletConnectors
  );
  try {
    return contract.approve(contractAddress, formatUnits(amount, digits));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error while approving the spending amount");
    }
  }
};

/**
 *
 * @param tokenAddress Contract address of the ERC20 token
 * @returns Symbol of the token as a string
 */
const erc20Symbol = async (
  tokenAddress: string,
  walletConnectors: keyof IWalletConnectors
): Promise<string> => {
  const contract = await initERC20Contract(
    false,
    tokenAddress,
    walletConnectors
  );
  try {
    return await contract.symbol();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error while retrieving the erc20 symbol");
    }
  }
};

/**
 *
 * @param walletAddress Wallet address as a string
 * @param tokenAddress Contract address of the ERC20 token
 * @returns The balance as a BigNumber. You need to know the token digits to be able to format it
 */
const erc20Balance = async (
  walletAddress: string,
  tokenAddress: string,
  walletConnectors: keyof IWalletConnectors
): Promise<BigNumber> => {
  const contract = await initERC20Contract(
    false,
    tokenAddress,
    walletConnectors
  );
  try {
    return await contract.balanceOf(walletAddress);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error while retrieving the erc20 balance");
    }
  }
};

const erc20EstimateTransfer = async (
  toWalletAddress: string,
  tokenAddress: string,
  quantity: BigNumberish,
  walletConnectors: keyof IWalletConnectors
): Promise<BigNumber> => {
  const contract = await initERC20Contract(
    true,
    tokenAddress,
    walletConnectors
  );
  try {
    return await contract.estimateGas.transfer(toWalletAddress, quantity);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error while transfering the erc20 token");
    }
  }
};

export {
  erc20Allowance,
  erc20Approval,
  erc20Balance,
  erc20Symbol,
  formatUnits,
  erc20EstimateTransfer,
};
