<template>
  <h1 class="text-2xl font-bold">Nothing to see here</h1>
  <p>
    The Account page is route guarded. You need to be connected to metamask to
    go there.
    <router-link class="text-green-500 font-bold" to="/account"
      >Account Page</router-link
    >.
  </p>

  <div class="mt-10">
    <p>
      This is an example on how you could use a composable to fetch some data
      using an external provider like Alchemy
    </p>
    <SampleWalletData />
  </div>
</template>
<script setup lang="ts"></script>
