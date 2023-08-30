<script setup>
import { ref } from "vue";
const showResults = ref(false)

const onOptionSelected = (isCorrect) => {
  if (isCorrect) {
    const ps = showResults.value = !showResults.value
    return ps
  }
}
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Aladin">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
  <div v-if="showbusinessUnitModal" id="overlay" class="overlay" @click="showbusinessUnitModal = false">
    <div class="modals" @click.stop>
      <div class="userdetailsheader">
        <p class="userdetailstext">Business Unit</p>
        <p @click="showbusinessUnitModal = false" :style="{ cursor: 'pointer' }">X</p>
      </div>
      <form @submit.prevent="onSubmit">
        <div class="Line">
          <div class="formDetails">
            <label>Business Unit Short Code</label>
            <input placeholder="Business Unit Short Code" type="text" v-model="businessUnitShortCode" />
          </div>
        </div>

        <div class="Line">
          <div class="address">
            <label>Business Unit</label>
            <input placeholder="Business Unit" type="text" v-model="businessUnit" />
          </div>
        </div>
        <b style="margin-left: 15px;">{{errorMessage}}</b>

        <button v-if='onEdits' v-on:click.prevent="onSubmitEdit" class="newUser">
          Submit
        </button>
        <button v-else v-on:click.prevent="onSubmit" class="newUser">
          Submit
        </button>
      </form>
    </div>
  </div>

  <div v-if="showResults" class="overlay1" @click="showResults=false">
    <div class="modal2 animated fadeInRight" @click.stop>
      <div class="sidebar-header">
        <h3>Notifications</h3>
        <span class="close" @click="showResults = false"> ✕ </span>
      </div>
      <div class="notibox" v-for="i in notifications" :key="i.id">
        <div class="iconsize"> <v-icon size="large">mdi-bell-outline</v-icon></div>
        <div class="notetext">
          <h2>{{i.notificationType}}</h2>
          <p :style="{color: 'black'}">{{ i.description }}</p>
        </div>
        <div class="options" :style="{ cursor: 'pointer' }">
          <h3 @click="navigatetoNotification(i.recordId, i.notificationType)">See details</h3>
        </div>
      </div>
    </div>
  </div>

  <PageHeader @selectOption="onOptionSelected"></PageHeader>

  <body>

    <WelcomeHead></WelcomeHead>
    <div class="settingheader">
      <SettingsHeader></SettingsHeader>
      <button @click="onNew" class="rfqbtn2" v-if="$route.path == '/settings/businessUnit'">
        +
      </button>
    </div>
    <div class="purchdetails">
      <div class="Rfq">
        <div class="table-responsive-sm">
        <table class="table table-hover" >
          <thead>
            <tr>
              <th scope="col"><b>Business Unit Short Code </b>
              <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending"/></th>
              <th scope="col"><b>Business Unit </b>
                <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" /></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="businessUnit in filteredUsers" :key="businessUnit.id"
          :style="{ cursor: 'pointer' }" @click="editbusinessUnit(businessUnit.shortCode, businessUnit.businessUnitDescription)"
          :onClick="onEdit">
              <th scope="row">{{ businessUnit.shortCode }}</th>
              <td>{{ businessUnit.businessUnitDescription }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="paginationButtons">
          <button @click="prevPage" :disabled="pageNumber == 1" class="paginationButton">
            &lt
          </button>
          <button class="paginationButtonNumber" :disabled="pageNumber >= pageCount">
            {{ pageNumber }}
          </button>
          <button @click="nextPage()" class="paginationButton" :disabled="pageNumber >= pageCount">
            >
          </button>
        </div>
      </div>
    </div>
  </body>
</template>
  
  
<script>
import { ref } from "vue";
import WelcomeHead from '../../components/PageMenuHeader.vue';
import PageHeader from '../../components/TopHeader.vue'
import SettingsHeader from "../../components/SettingsHeader.vue";
import settingsService from "../../services/settingsService";
import { useCounterStore } from "../../store/piniaStore"
import pinia from "../../store/store";
import notificationServices from "../../services/notificationServices";

const stores = useCounterStore(pinia);

export default {
  props: {
    size: {
      type: Number,
      required: false,
      default: 10
    }
  },
  components: {
    WelcomeHead, PageHeader, SettingsHeader
  },
  data() {
    return {
      ascending: true,
      completeValue: false,
      sortBy: 'alphabetically',
      pageNumber: 1,  // default to page 0
      businessUnitList: [],
      disabled: false,
      businessUnit: "",
      businessUnitShortCode: "",
      errorMessage: '',
      showResults: false,
      onEdits: false,
      showbusinessUnitModal: false,
      notifications: []

    };
  },
  async created() {
    this.businessUnitList = await settingsService.getBusinessUnits()
    this.notifications = await notificationServices.getNotifications(stores.signedInUserEmail)
    let notifs = await notificationServices.getNotifications(stores.signedInUserEmail)
    this.notifications = notifs.reverse()
  },

  computed: {
    pageCount() {
      let l = this.businessUnitList.length,
        s = this.size;
      return Math.ceil(l / s);
    },

    indexStart() {
      return (this.pageNumber - 1) * this.size;
    },
    indexEnd() {
      return this.indexStart + this.size;
    },

    filteredUsers() {
      const start = this.pageNumber * this.size,
        end = start + this.size;
      let users = this.businessUnitList

      // Sort by alphabetical order
      users = users.sort((a, b) => {
        if (this.sortBy == 'alphabetically') {
          let fa = a.businessUnitDescription.toLowerCase(), fb = b.businessUnitDescription.toLowerCase()

          if (fa < fb) {
            return -1
          }
          if (fa > fb) {
            return 1
          }
          return 0

        }
      })
      // Show sorted array in descending or ascending order
      if (!this.ascending) {
        users.reverse().slice(this.indexStart, this.indexEnd)
      }

      return users.slice(this.indexStart, this.indexEnd)
    },
  },

  methods: {
    
    navigatetoNotification(id, type) {
      if(type=='Bid Submission'){
      this.$router.push(`/rfqedit/${id}`)
    }

    else if(type=='Signed Contract Upload'){
      this.$router.push(`/purchcontractdetails/${id}`)
    }
  },

    nextPage() {
      this.pageNumber++;
    },
    prevPage() {
      this.pageNumber--;
    },

    editbusinessUnit(businessUnit, businessUnitShortCode,) {
      this.businessUnit = businessUnit; this.businessUnitShortCode = businessUnitShortCode
      this.showbusinessUnitModal = true
    },

    onEdit() {
      this.onEdits = true;
      this.disabled = true;
    },

    onNew() {
      this.showbusinessUnitModal = true;
      this.disabled = false;
      this.businessUnitShortCode = "",
        this.businessUnit = "",
        this.onEdits = false;

    },

    async onSubmit() {
      if(this.businessUnitShortCode=='', this.businessUnit==''){
        return this.errorMessage = "Please fill in all fields appropraitely"
      }
      await settingsService.createBusinessUnits(this.businessUnitShortCode, this.businessUnit)
      this.showbusinessUnitModal = false;
      setTimeout(async () => {
        this.businessUnitList = await settingsService.getBusinessUnits()
      }, 2000);
    },

    async onSubmitEdit() {
      if(this.businessUnitShortCode=='', this.businessUnit==''){
        return this.errorMessage = "Please fill in all fields appropraitely"
      }
      await settingsService.createBusinessUnits(this.businessUnitShortCode, this.businessUnit)
      this.showbusinessUnitModal = false;
      setTimeout(async () => {
        this.businessUnitList = await settingsService.getBusinessUnits()
      }, 2000);
    }
  }

};
</script>
  
  
<style scoped>
.paginationButtons {
  justify-content: flex-end;
  align-self: flex-end;
  display: flex;
  margin-top: -20px;
}
.paginationButton {
  background-color: rgb(255, 255, 255);
  padding: 5px 10px 5px 10px;
  border: 1px solid #b3b3b3;
  color: black
}

.paginationButtonNumber {
  background-color: #227CBF;
  padding: 5px 10px 5px 10px;
  color: white;
}

body {
  font-family: Roboto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px 50px;
  gap: 20px;
  width: 100%;
  height: 100%;
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 1;
  background: #FAFAFB;
}

.purchdetails {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 0px 0px 30px;
  width: 100%;
  background: #FFFFFF;
  border-radius: 10px;
}

.sorticon:hover {
  cursor: pointer;
}



.activityStatusPurch {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  gap: 10px;
  width: 100%;
  height: 40px;
}

.settingheader {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.rfqbtn,
.newUser {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  margin-top: 27px;
  line-height: 19px;
  color: #FFFFFF;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  border: none;
  cursor: pointer;
  width: 200px;
  height: 40px;
  background: linear-gradient(90deg, #227CBF 0%, #47B65C 100%);
  border-radius: 50px;
}

.rfqbtn:hover {
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
  transition: 0.7s;
}

.Rfq {
  display: flex;
  flex-direction: column;
  padding: 20px 20px 0px 0px;
  gap: 30px;
  width: 100%;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.493);
  z-index: 10;
  display: flex;
  overflow: auto;
  align-items: center;
  justify-content: center;
}

.overlay1 {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.493);
  z-index: 10;
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
  justify-content: center;
}
.modals {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  position: relative;
  width: 900px;
  border-radius: 5px;
  border: 1px solid #E4E4E7;
}

.options {
  padding: 5px;
}

.sidebar-header {
  margin-left: 12px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: baseline;
  color: rgb(0, 0, 0);
  cursor: context-menu;
}

.sidebar-header .close {
  cursor: pointer;
  border-radius: 20px 0px 0px 20px;
  padding: 3px 0px 10px 65px;
}

.options h3 {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 14px;
  margin: 5px;
  border-bottom: 1px solid #E4E4E7;
  text-align: center;
  color: black;
  border-bottom: #808080;
  text-decoration: underline;
}

.userdetailsheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  gap: 10px;
  width: 900px;
  height: 40px;
  margin-top: -20px;
  background: #F7F7F7;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-color: #E8E8E8;
  border-radius: 5px 5px 0px 0px;
  font-size: 20px;
}

.userdetailstext {
  font-family: Roboto;
  font-style: normal;
  font-weight: 600;
  color: #000000;
}

.Line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px 20px;
  width: 900px;
  height: 60px;
  margin-top: 25px;
}

input[type="email"]:disabled {
  background: #dddddd;
}

.newUser {
  margin: 20px 0px 0px 20px;
}

.formDetails,
.address {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 5px;
  width: 270px;
  height: 60px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #000000;
}

.formDetails input {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px 10px 10px;
  gap: 71px;
  width: 270px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #E4E4E7;
  border-radius: 5px;
}

.address input {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 20px 10px 10px;
  gap: 71px;
  width: 860px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #E4E4E7;
  border-radius: 5px;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;
  background-image: url('../../assets/images/arrow_right.svg');
  background-repeat: no-repeat;
  background-position-x: 98%;
  background-position-y: 13px;
  border: 1px solid #E4E4E7;
  border-radius: 2px;
  padding-left: 10px;
  width: 270px;
  height: 40px;
  border-radius: 5px;
  font-family: Roboto;
  font-size: 12px;
}

.modal2 {
  position: fixed;
  width: 350px;
  right: -5px;
  overflow: auto;
  box-shadow: 0px 0px 5px 0.5px rgb(101, 101, 101);
  background-color: #e6e6e6;
  border-left: 1px solid rgb(113, 113, 113);
  height: 100%;
  top: 0px;
  display: flex;
  flex-direction: column;
}

.notetext {
  margin-left: 10px;
  font-family: 'Roboto';
  display: flex;
  flex-direction: column;
  font-weight: 300;
  font-size: 12px;
  width: 18vw;
  padding-right: 10px;
  line-height: 14px;
  border-right: 1px solid #E4E4E7;
  color: black;
}

.notetext h2{
  font-size: 18px;
  font-family: 'Roboto';
  margin-bottom: 0px;
}

.iconsize{
  margin-top: 10px
}

.modals img {
  margin-top: 5px;
}

.rfqbtn2:hover {
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
  transition: 0.7s;
}

.rfqbtn2 {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #FFFFFF;
  justify-content: center;
  margin-top: 17px;
  padding: 10px;
  gap: 10px;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #227CBF 0%, #47B65C 100%);
  border-radius: 30px;
}
.notibox {
  color: black;
  font-family: 'Roboto';
  background-color: white;
  padding: 15px;
  width: 90%;
  margin: 5px 0px 5px 10px;
  border-radius: 6px;
  position: relative;
  display: flex;
  flex-direction: row; 
  vertical-align: middle;
  box-shadow: 0px 0px 2px 0.3px rgb(146, 146, 146);
}
.animated {
  background-repeat: no-repeat;
  background-position: left top;
  margin-bottom: 60px;
  -webkit-animation-duration: 0.9s;
  animation-duration: 0.9s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInRight {
  0% {
    opacity: 0;
    -webkit-transform: translateX(20px);
  }

  100% {
    opacity: 1;
    -webkit-transform: translateX(0);
  }
}

@keyframes fadeInRight {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.fadeInRight {
  -webkit-animation-name: fadeInRight;
  animation-name: fadeInRight;
}


@media (min-width: 1024px) {
  .Home {
    min-height: 100vh;
    display: flex;
    align-items: center;

  }
}
</style>