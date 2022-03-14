import { useWalletStore } from "~/stores/wallet";

export function useWalletEvents() {
  const walletStore = useWalletStore();
  const actionSubscription = () => {
    walletStore.$onAction(
      ({
        name, // name of the action
        store, // store instance, same as `someStore`
        args, // array of parameters passed to the action
        after, // hook after the action returns or resolves
        onError, // hook if the action throws or rejects
      }) => {
        after(async (result) => {
          if (name === "connectWallet") {
            if (
              store.walletConnector === "metamask" ||
              store.walletConnector === "injected"
            ) {
              //@ts-expect-error window.ethereum may not be defined
              window.ethereum.on("accountsChanged", (accounts) => {
                console.info("New account detected: ", accounts);
                window.location.reload();
              });
              //@ts-expect-error any
              window.ethereum.on("chainChanged", (chainId) => {
                // Handle the new chain.
                // Correctly handling chain changes can be complicated.
                // We recommend reloading the page unless you have good reason not to.
                console.info("New chain detected: ", chainId);
                window.location.reload();
              });
            }
          }
        });
      }
    );
  };
  return {
    actionSubscription,
  };
}
