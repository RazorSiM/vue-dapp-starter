<template>
  <component :is="layout" class="font-nunito">
    <router-view />
  </component>
</template>

<script lang="ts" setup>
const route = useRoute();
let layout = $computed(() => {
  return route.meta.layout;
});
onMounted(() => {
  //@ts-expect-error any
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
});
</script>
