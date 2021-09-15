import { createRouter, createWebHistory } from "vue-router";

import About from "~/views/About.vue";
import Account from "~/views/Account.vue";
import Home from "~/views/Home.vue";
import { useWalletStore } from "~/stores/wallet";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      layout: "BaseLayout",
    },
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      layout: "EmptyLayout",
    },
  },
  {
    path: "/account",
    name: "Account",
    component: Account,
    meta: {
      layout: "BaseLayout",
      requiresWallet: true,
    },
  },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach(async (to, from, next) => {
  const walletStore = useWalletStore();

  /**
   * If the root requires a wallet to interact with the blockchain...
   */
  if (to.meta.requiresWallet === true) {
    console.log("require wallet true");
    /** try to get the provider - we need to check if window.ethereum is present
     * so we do not break the app throwing an error
     */
    if (window.ethereum) {
      await walletStore.setProvider();
    } else {
      next(from);
    }

    /**
     * ... and the wallet provider is not installed ...
     */
    if (walletStore.installed === false) {
      console.log("wallet not installed");
      /**  ... redirect the  user to the home page*/
      next("/");
    } else {
      console.log("wallet installed");
      /** if the wallet provider is installed but the account is not present */
      if (!walletStore.connected) {
        console.log("wallet not connected");
        /** try to get the account without firing up the permission modal */
        await walletStore.setConnected();
        if (walletStore.connected) {
          console.log("wallet connected");
          next();
        } else {
          console.log("not connected");
          next(from);
        }
      } else {
        next();
      }
    }
  } else {
    console.log("no require");
    next();
  }
});

export default router;
