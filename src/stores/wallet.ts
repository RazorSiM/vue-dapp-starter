import {
  getSignerBalance,
  getSignerData,
  lookupAddress,
} from "~/services/contracts";

import { IWalletConnectors } from "~/services/wallets";
import { RemovableRef } from "@vueuse/core";
import { defineStore } from "pinia";
import { getAvatarImageUrl } from "~/helpers/ensAvatar";

export const useWalletStore = defineStore({
  id: "wallet",
  state: () => ({
    walletConnector: useStorage("walletConnector", "") as RemovableRef<
      keyof IWalletConnectors | ""
    >,
    address: "",
    chainId: 0 as null | number,
    ethBalance: "",
    txCount: 0,
    connected: false,
    ens: "",
    avatar: "",
  }),
  getters: {
    chainName(state) {
      switch (state.chainId) {
        case null:
          return "Unknown";
        case 1337:
          return "Ganache";
        case 0x1:
          return "Mainnet";
        case 0x3:
          return "Ropsten";
        case 0x4:
          return "Rinkeby";
        case 0x5:
          return "Goerli";
        case 0x2a:
          return "Kovan";
      }
    },
    lowerCaseAddress(state): string {
      return state.address.toLowerCase();
    },
    shortAddress(state): string {
      return state.address !== ""
        ? state.address.substring(0, 6) + "...." + state.address.substring(38)
        : "";
    },
    ensOrAddress(state): string {
      if (state.ens !== "") {
        return state.ens;
      }
      if (this.lowerCaseAddress !== "") {
        return this.lowerCaseAddress;
      }
      return "";
    },
    ensOrShortAddress(state): string {
      if (state.ens !== "") {
        return state.ens;
      }
      if (this.shortAddress !== "") {
        return this.shortAddress;
      }
      return "";
    },
  },
  actions: {
    setWalletConnector(connector: keyof IWalletConnectors) {
      this.walletConnector = connector;
    },
    disconnectWallet() {
      this.walletConnector = "";
      this.connected = false;
      this.address = "";
      this.chainId = null;
      this.ethBalance = "";
      this.txCount = 0;
      this.connected = false;
      this.ens = "";
      this.avatar = "";
    },
    async getEthBalance() {
      if (this.walletConnector !== "") {
        try {
          this.ethBalance = await getSignerBalance(this.walletConnector);
        } catch (error) {
          this.connected = false;
          throw new Error(`Cannot get the balance:  ${error}`);
        }
      }
    },
    async connectWallet() {
      if (this.walletConnector !== "") {
        try {
          const { address, chainId, ethBalance, txCount } = await getSignerData(
            this.walletConnector
          );
          this.address = address;
          this.chainId = chainId;
          this.ethBalance = ethBalance;
          this.txCount = txCount;
          this.ens = await lookupAddress(this.address);
          this.connected = true;
        } catch (error) {
          this.connected = false;
          throw new Error(`Cannot connect to ${this.walletConnector}`);
        }
      }
    },
  },
});
