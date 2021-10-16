import {
  getEthBalance as _getEthBalance,
  getLatestBlockTimestamp as _getLatestBlockTimestamp,
  getNetwork as _getNetwork,
  lookupAddress as _lookupAddress,
} from "~/services/contracts";

import { Ref } from "vue";

const Status = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useWalletInfo(walletAddress: string | Ref<string>) {
  const status = ref(Status.IDLE);
  const network = ref();

  const ethBalance = ref();

  const latestBlockTimestamp = ref();
  const ensAddress = ref();

  async function getNetwork() {
    status.value = Status.RUNNING;
    try {
      const response = await _getNetwork();
      status.value = Status.SUCCESS;
      network.value = response;
    } catch (error) {
      status.value = Status.ERROR;

      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Error getting the network");
      }
    }
  }

  async function getLatestBlockTimestamp() {
    status.value = Status.RUNNING;
    try {
      const response = await _getLatestBlockTimestamp();
      status.value = Status.SUCCESS;
      latestBlockTimestamp.value = response;
    } catch (error) {
      status.value = Status.ERROR;

      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Error getting the timestamp");
      }
    }
  }

  async function getEthBalance() {
    status.value = Status.RUNNING;
    try {
      const response = await _getEthBalance(unref(walletAddress));
      status.value = Status.SUCCESS;
      ethBalance.value = response;
    } catch (error) {
      status.value = Status.ERROR;

      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Error getting the Eth balance");
      }
    }
  }

  async function getEnsAddress() {
    status.value = Status.RUNNING;
    try {
      const response = await _lookupAddress(unref(walletAddress));
      status.value = Status.SUCCESS;
      if (response) {
        ensAddress.value = response;
      } else {
        ensAddress.value = "No ENS available";
      }
    } catch (error) {
      status.value = Status.ERROR;
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Error getting the ens address");
      }
    }
  }

  if (isRef(walletAddress)) {
    debouncedWatch(
      walletAddress,
      async () => {
        await getNetwork();
        await getEthBalance();
        await getLatestBlockTimestamp();
        await getEnsAddress();
      },
      { debounce: 1000 }
    );
  }

  return {
    status,
    network,
    ethBalance,
    latestBlockTimestamp,
    ensAddress,
    getLatestBlockTimestamp,
    getNetwork,
    getEthBalance,
    getEnsAddress,
  };
}
