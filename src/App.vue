<script setup>
import { RouterView } from 'vue-router'
import { watch } from "vue";
import { useIdle, useTimestamp, useCounter } from '@vueuse/core';
import authenticationService from "./services/authenticationService";
import pinia from "./store/store";
// import { useCounterStore } from "./store/piniaStore";
// const { inc, count } = useCounter()
// const { idle, lastActive, reset } = useIdle(7 * 60 * 2000)
// const now = useTimestamp()
// const stores = useCounterStore(pinia);

// watch(idle, (idleValue) => {
//   if (idleValue) {
//     if (stores.signedInUserEmail != '') {
//       inc()
//       console.log(`Session Time out:  ${count.value}`)
//       authenticationService.SignOut()
//     }
//   }
// })
</script>

<template>
  <router-view></router-view>
</template>