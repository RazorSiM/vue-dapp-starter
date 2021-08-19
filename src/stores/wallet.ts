import {
  getAccounts,
  getProvider,
  requestAccounts,
} from "/@/services/wallets/metamask";
import { getEthBalance, lookupAddress } from "/@/services/contracts";

import { defineStore } from "pinia";

export const useWalletStore = defineStore({
  id: "wallet",
  state: () => ({
    connected: false,
    address: "",
    ens: "",
    walletType: "",
    ethBalance: "",
  }),
  getters: {
    getConnected: (state) => state.connected,
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
        if (provider.isMetaMask) {
          this.walletType = "Metamask";
        } else {
          this.walletType = "Unknown";
        }
      } catch (error) {
        this.walletType = "";
        throw new Error(error);
      }
    },
    async setConnected(): Promise<void> {
      try {
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
        throw new Error(error);
      }
    },
    async requestAccounts(): Promise<void> {
      try {
        const accounts = await requestAccounts();
        this.address = accounts[0];
        this.ens = await lookupAddress(accounts[0]);
        this.connected = true;
        this.walletType = "Metamask";
        this.ethBalance = await getEthBalance(this.address);
      } catch (error) {
        throw new Error(error);
      }
    },
  },
});
