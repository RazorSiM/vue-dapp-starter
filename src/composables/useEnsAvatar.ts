import { Ref } from "vue";
import { getAvatarImageUrl as _getAvatarImageUrl } from "~/helpers/ensAvatar";
import { getAvatarUri } from "~/services/contracts";

const Status = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useEnsAvatar(wallet: string | Ref<string>) {
  const status = ref(Status.IDLE);
  const image = ref("");

  async function getAvatarImageUrl() {
    status.value = Status.RUNNING;
    const uri = await getAvatarUri(unref(wallet));
    if (uri !== null && uri !== "") {
      image.value = await _getAvatarImageUrl(uri, unref(wallet));
    } else {
      image.value = "";
    }
  }

  if (isRef(wallet)) {
    debouncedWatch(
      wallet,
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
