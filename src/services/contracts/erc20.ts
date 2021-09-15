import { BigNumber, BigNumberish } from "@ethersproject/bignumber";

import { ContractTransaction } from "@ethersproject/contracts";
import { Erc20__factory } from "~/types/chain";
import { formatUnits } from "@ethersproject/units";
import { initWeb3Provider } from "~/services/contracts";

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
  digits: number
): Promise<ContractTransaction> => {
  try {
    const provider = await initWeb3Provider();
    const ERC20 = Erc20__factory.connect(tokenAddress, provider.getSigner());
    return ERC20.approve(contractAddress, formatUnits(amount, digits));
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
const erc20Symbol = async (tokenAddress: string): Promise<string> => {
  try {
    const provider = await initWeb3Provider();
    const ERC20 = Erc20__factory.connect(tokenAddress, provider);
    return await ERC20.symbol();
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
  tokenAddress: string
): Promise<BigNumber> => {
  try {
    const provider = await initWeb3Provider();
    const ERC20 = Erc20__factory.connect(tokenAddress, provider);
    return await ERC20.balanceOf(walletAddress);
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
  quantity: BigNumberish
): Promise<BigNumber> => {
  try {
    const provider = await initWeb3Provider();
    const ERC20 = Erc20__factory.connect(tokenAddress, provider);
    return await ERC20.estimateGas.transfer(toWalletAddress, quantity);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Error while transfering the erc20 token");
    }
  }
};

export {
  erc20Approval,
  erc20Balance,
  erc20Symbol,
  formatUnits,
  erc20EstimateTransfer,
};
