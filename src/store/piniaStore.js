import { defineStore } from "pinia";
import { useLocalStorage, useSessionStorage } from "@vueuse/core"

export const useCounterStore = defineStore("counter", {
  state: () => {
    return { 
      signedInUserRole:  useLocalStorage('signedInUserRole', ''),
      signedInUserEmail:  useLocalStorage('signedInUserEmail', ''),
      notificationLength:  useSessionStorage('notificationLength', ''),
      rfqNo:  useLocalStorage('rfqNo', ''),
      expirationDate: useLocalStorage('expirationDate', ''),
      testDocument3: useSessionStorage('testDocument3', ''),
      biddersRFQ: useLocalStorage('biddersRFQ', ''),
      bidderId: useLocalStorage('bidderId', ''),
      contractNo: useLocalStorage('contractNo', ''),
      accessToken: useSessionStorage('accessToken', ''),
      storesBlob: useSessionStorage('storesBlob', {}),
     };
  },
  persist: true
});