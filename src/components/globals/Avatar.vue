<template>
  <div>
    <div
      v-if="status === 'RUNNING'"
      class="h-5 w-5 animated animate-flash animate-loop bg-white bg-opacity-10 animate-duration-6000 rounded-full"
    ></div>
    <img
      v-if="image !== ''"
      class="h-5 w-5 rounded-full shadow-xl"
      :src="image"
      alt=""
    />
  </div>
</template>

<script lang="ts" setup>
import { useEnsAvatar } from "~/composables/useEnsAvatar";
const props = defineProps({
  ensOrAddress: {
    type: String,
    default: "",
  },
});

const { image, getAvatarImageUrl, status } = useEnsAvatar(props.ensOrAddress);
onMounted(async () => {
  await getAvatarImageUrl();
});
</script>
