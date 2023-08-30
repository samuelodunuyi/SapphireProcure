<script setup>
const emit = defineEmits(["selectOption"])

const emitSelectedOption = (isCorrect) => {
  emit("selectOption", isCorrect)
}
const { modalValue } = defineProps(['modalValue'])
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;800&display=swap" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Aladin:wght@400&display=swap" />
  <div class="MainHeader">
    <div class="subheader">
      <div class="subheader1">
        <img src="../assets/images/EPROC-01.png" class="pageheadertext"/> 
      </div>
      <div class="subheader2">
        <img src="../assets/images/InfraCredit.svg" alt="">
      </div>
      <div class="subheader3">
        <div class="notif">
          <div class="text-none" @click="emitSelectedOption(true)" style="color: black;">
              <v-badge :content=stores.notificationLength color="#47B65C">
                <v-icon size="large" color="black">mdi-bell-outline</v-icon>
              </v-badge>
          </div>
        </div>

        <div class="user41">
          <img class="user-child37" alt="" src="../assets/images/ellipse-6@2x.png" />
          <div class="john-snow22" :style="{ cursor: 'context-menu' }">{{ name }}</div>
        </div>

        <div class="div1237" @click="SignOut()">
          <img class="frame-icon67" alt="" src="../assets/images/frame67.svg" />
          <div class="john-snow22">Logout</div>
        </div>

      </div>
    </div>
  </div>
</template>


<script>
import authenticationService from '../services/authenticationService';
import notificationServices from "../services/notificationServices";
import { useCounterStore } from "../store/piniaStore";
import pinia from "../store/store";
const stores = useCounterStore(pinia);

export default {
  name: 'TopHeader',
  data() {
    return {
      account: undefined,
      name: '',
      notifications: [],
      notificationsLength: 0

    };
  },

  async created() {
    this.notifications = await notificationServices.getNotifications(stores.signedInUserEmail)
    this.notificationsLength = this.notifications.length
    if(stores.notificationLength!=this.notificationsLength){
    stores.notificationLength = this.notificationsLength
    }
  },

  mounted() {
    const accounts = authenticationService.msalInstance.getAllAccounts();
    this.account = accounts[0];
    if (this.account.name.split(" ")[2] == undefined) {
      this.name = this.account.name.split(" ")[0] + " " + this.account.name.split(" ")[1];
    }
    else {
      this.name = this.account.name.split(" ")[0] + " " + this.account.name.split(" ")[2];
    }
  },

  methods: {
    async SignOut() {
      return authenticationService.SignOut();
    },
  },
};
</script>

<style scoped>
.v-icon {
  margin-left: 30px;
}

.triangle .v-badge__badge {
  border-radius: 0;
  height: 30px;
  width: 30px;
  background: #47B65C;

}

.my-badge {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  height: 100%;
  color: #fff;

}

.subheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  width: 100%;
  height: 85.63px;
  background: #ffffff;
  box-shadow: 0px 1px 0px rgba(18, 32, 59, 0.09);
}

.subheader3 {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-top: 20px;
  width: 350px;
}


.user41 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: var(--gap-3xs);
  margin-right: 30px;
}

.notif {
  margin-right: 30px;
  margin-top: 5px;
  cursor: pointer;
}

.user-child37 {
  width: 32px;
  height: 32px;
  object-fit: cover;
}

.john-snow22 {
  line-height: 19.2px;
  font-family: Roboto;
  margin-top: 3px;
  margin-left: 5px;
  font-weight: 600;
  color: black;

}

.div1237 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: var(--gap-8xs);
  cursor: pointer;
}

.frame-icon67 {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  overflow: hidden;
}

.subheader2 img {
  height: 45.62px;
  width: 150px;
  top:10px;
  margin-left: 10px;
}

.pageheadertext {
  margin-top: 20px;
  margin-left: -15px;
  width: 200px;
  cursor: context-menu;
}
</style>
