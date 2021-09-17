<template>
  <h1 class="text-2xl font-bold">Nothing to see here 🤯</h1>
  <p>
    If you want to see an example on how you could retrieve some data from the
    blockchain, go to the
    <router-link class="text-green-500 font-bold" to="/account"
      >Account Page</router-link
    >. You need to be connected to Metamask to go there.
  </p>
  <div>
    <p>
      This is an example on how you could use a composable to fetch some data
      using an external provider like Alchemy
    </p>
    <SampleWalletData />
  </div>
</template>
<script setup lang="ts"></script>
