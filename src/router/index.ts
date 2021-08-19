import { createRouter, createWebHistory } from "vue-router";

import About from "/@/views/About.vue";
import Account from "/@/views/Account.vue";
import Home from "/@/views/Home.vue";
import { useWalletStore } from "/@/stores/wallet";

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
  if (to.meta.requiresWallet === true && !walletStore.connected) {
    await walletStore.setConnected();
    if (walletStore.connected) {
      next();
    } else {
      next(from);
    }
  } else {
    await walletStore.setConnected();
    next();
  }
});

export default router;
