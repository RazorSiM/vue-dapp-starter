import {
  getAccounts,
  getChainId,
  getProvider,
  requestAccounts,
} from "~/services/wallets/metamask";
import { getEthBalance, lookupAddress } from "~/services/contracts";

import { defineStore } from "pinia";

export const useWalletStore = defineStore({
  id: "wallet",
  state: () => ({
    connected: false,
    installed: false,
    chainId: "",
    address: "",
    ens: "",
    walletType: "",
    ethBalance: "",
  }),
  getters: {
    getConnected: (state) => state.connected,
    getChainName: (state) => {
      switch (state.chainId) {
        case "":
          return "Unknown";
        case "0x1":
          return "Mainnet";
        case "0x3":
          return "Ropsten";
        case "0x4":
          return "Rinkeby";
        case "0x5":
          return "Goerli";
        case "0x2a":
          return "Kovan";
      }
    },
    getAddress: (state) => state.address,
    getShortAddress: (state) => state.address.substring(0, 7) + "...",
    getEns: (state) => state.ens,
    getEthBalance: (state) => parseFloat(state.ethBalance).toFixed(3),
    getWalletType: (state) => state.walletType,
  },
  actions: {
    async setProvider(): Promise<void> {
      try {
        const provider = await getProvider();
        this.installed = true;
        if (provider.isMetaMask) {
          this.walletType = "Metamask";
        } else {
          this.walletType = "Unknown";
        }
      } catch (error) {
        this.walletType = "";
        this.installed = false;
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error setting the provider");
        }
      }
    },
    async setChainId(): Promise<void> {
      try {
        this.chainId = await getChainId();
      } catch (error) {
        this.chainId = "";
      }
    },
    async setConnected(): Promise<void> {
      try {
        await this.setChainId();
        const accounts = await getAccounts();
        if (accounts.length > 0) {
          this.address = accounts[0];
          this.ens = await lookupAddress(accounts[0]);
          this.connected = true;
          this.walletType = "Metamask";
          this.ethBalance = await getEthBalance(this.address);
        } else {
          this.address = "";
          this.connected = false;
          this.walletType = "";
          this.ethBalance = "";
        }
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error checking the connection");
        }
      }
    },
    async requestAccounts(): Promise<void> {
      try {
        await this.setChainId();
        const accounts = await requestAccounts();
        this.address = accounts[0];
        this.ens = await lookupAddress(accounts[0]);
        this.connected = true;
        this.walletType = "Metamask";
        this.ethBalance = await getEthBalance(this.address);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error("Error approving the dApp");
        }
      }
    },
  },
});
