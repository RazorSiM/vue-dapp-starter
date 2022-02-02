import { createRouter, createWebHistory } from "vue-router";
import { useWalletStore } from "~/stores/wallet";
import About from "~/views/AboutView.vue";
import Account from "~/views/AccountView.vue";
import Home from "~/views/HomeView.vue";

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
    console.info(
      `The route ${to.path} requires a wallet connected to the dapp...`
    );
    /** try to get the provider - we need to check if window.ethereum is present
     * so we do not break the app throwing an error
     */
    try {
      await walletStore.connectWallet();
      console.info(`... and you are connected! Enjoy your trip to ${to.path}`);
      next();
    } catch (error) {
      console.info(
        `... and you are not connected!Redirecting you to ${from.path}`
      );
      console.error(`Router error - ${error}`);
      next(from);
    }
  } else {
    try {
      await walletStore.connectWallet();
      next();
    } catch (error) {
      console.error(`Router error - ${error}`);
      next();
    }
  }
});

export default router;
