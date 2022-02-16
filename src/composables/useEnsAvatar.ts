import { Ref } from "vue";
import { getAvatarImageUrl as _getAvatarImageUrl } from "~/helpers/ensAvatar";
import { isAddress } from "@ethersproject/address";
import makeBlockie from "ethereum-blockies-base64";

const Status = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useEnsAvatar(ensOrAddress: string | Ref<string>) {
  const status = ref(Status.IDLE);
  const image = ref("");

  async function getAvatarImageUrl() {
    status.value = Status.RUNNING;
    if (isAddress(unref(ensOrAddress))) {
    } else {
      image.value = await _getAvatarImageUrl(unref(ensOrAddress));
      status.value = Status.SUCCESS;
    }
    if (image.value === "") {
      image.value = makeBlockie(unref(ensOrAddress));
      status.value = Status.SUCCESS;
    }
  }

  if (isRef(ensOrAddress)) {
    debouncedWatch(
      ensOrAddress,
      async () => {
        await getAvatarImageUrl();
      },
      { debounce: 1000 }
    );
  }

  return {
    status,
    image,
    getAvatarImageUrl,
  };
}
