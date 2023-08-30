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
  <div v-if="showResults" class="overlay" @click="showResults=false">
    <div class="modal21 animated fadeInRight" @click.stop>
      <div class="sidebar-header" >
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

  <div v-if="showNewUserRole" class="overlay1" @click="showNewUserRole = false">
    <div class="modals" @click.stop>
      <div class="userdetailsheader">
        <p v-if="onEdits" class="userdetailstext">Edit Role</p>
        <p v-else class="userdetailstext">Create New Role</p>
        <p @click="showNewUserRole = false" :style="{ cursor: 'pointer' }">X</p>
      </div>
      <form @submit.prevent="onSubmit">
        <div class="Line">
          <div class="formDetails">
            <label>Role Name</label>
            <input placeholder="Role Id" type="text" v-model.trim="name" />
          </div>
        </div>

        <div class="Line">
          <div class="formDetails">
            <label>Role Description</label>
            <input placeholder="Role Description" type="test" required v-model.trim="description" />
          </div>
        </div>

        <div class="Line">
          <div class="formDetails">
            <label>User Type</label>
            <select v-model="userType" required>
              <option value="" disabled selected>User Type</option>
              <option value="Employee">Employee</option>
              <option value="Bidder">Bidder</option>
            </select>
          </div>
        </div>
        <div v-if='showErrorMessage' style="text-align: center; color: red;">**An error occured, please try again.**</div>
        <div class='buttons'>
          <button v-if="onEdits" v-on:click.prevent="onSubmitEdit" class="newUser">
            Submit
          </button>
          <button v-else v-on:click.prevent="onSubmit" class="newUser">
            Submit
          </button>
          <button @click="showNewUserRole = false" class="newUser">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>

  <PageHeader @selectOption="onOptionSelected"></PageHeader>

  <body>
    <WelcomeHead></WelcomeHead>
    <div class="settingheader">
      <SettingsHeader></SettingsHeader>
      <button @click="onNew" class="rfqbtn2" v-if="$route.path == '/settings/userRolesSetting'">
        +
      </button>
    </div>
    <div class="purchdetails">
      <div class="Rfq21">
        <div class="table-responsive-sm">
        <table class="table table-hover" >
          <thead>
            <tr>
              <th scope="col"><b>Role Name </b>
              <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending"/></th>
              <th scope="col"><b>Role Description </b>
              <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending"/></th>
              <th scope="col"><b>User Type </b>
                <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" /></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="userRoles in filteredUsers" :key="userRoles.name"
          :style="{ cursor: 'pointer' }"
          @click="editRole(userRoles.id, userRoles.name, userRoles.description, userRoles.userType)" :onClick="onEdit">
              <th scope="row">{{ userRoles.name }}</th>
              <td>{{ userRoles.description }}</td>
              <td>{{ userRoles.userType }}</td>
            </tr>
          </tbody>
        </table>
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
import AdministrationService from '../../services/administrationsService'
import administrationsService from "../../services/administrationsService";
import notificationServices from "../../services/notificationServices";
import { useCounterStore } from "../../store/piniaStore"
import pinia from "../../store/store";
const stores = useCounterStore(pinia);

export default {
  props: {
    size: {
      type: Number,
      required: false,
      default: 40
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
      pageNumber: 0,  // default to page 0
      userRoles: [],
      showNewUserRole: false,
      submitted: false,
      roleId: undefined,
      name: "",
      description: "",
      userType: "",
      onEdits: false,
      showErrorMessage: false,
      notifications: []

    };
  },

  async created() {
    this.userRoles = await AdministrationService.getRoles();
    let notifs = await notificationServices.getNotifications(stores.signedInUserEmail)
    this.notifications = notifs.reverse()
  },


  computed: {
    filteredUsers() {
      const start = this.pageNumber * this.size,
        end = start + this.size;
      let users = this.userRoles

      // Sort by alphabetical order
      users = users.sort((a, b) => {
        if (this.sortBy == 'alphabetically') {
          let fa = a.name.toLowerCase(), fb = b.name.toLowerCase()

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
        users.reverse().slice(start, end)
      }

      return users.slice(start, end)
    },
  },

  methods: {
    editRole(id, names, descr, userTypes) {
      this.roleId = id, this.name = names, this.description = descr, this.userType = userTypes,
        this.showNewUserRole = true
    },

    onEdit() {
      this.onEdits = true;
    },

    onNew() {
      this.showNewUserRole = true;
      this.name = "";
      this.description = "",
        this.userType = "",
        this.onEdits = false;

    },

    async onSubmit() {
      if(this.name=='' || this.description=='' || this.userType==''){
          return this.showErrorMessage=true
      }
      await administrationsService.createRoles(this.name, this.description, this.userType)
      this.showNewUserRole = false;
      setTimeout(async () => {
        this.userRoles = await administrationsService.getRoles()
      }, 2000);
    },

    async onSubmitEdit() {
      if(this.roleId=='' || this.name=='' || this.description=='' || this.userType==''){
          return this.showErrorMessage=true
      }
      await administrationsService.editRoles(this.roleId, this.name, this.description, this.userType)
      this.showNewUserRole = false;
      setTimeout(async () => {
        this.userRoles = await administrationsService.getRoles()
      }, 2000);
    },
    navigatetoNotification(id, type) {
      if(type=='Bid Submission'){
      this.$router.push(`/rfqedit/${id}`)
    }

    else if(type=='Signed Contract Upload'){
      this.$router.push(`/purchcontractdetails/${id}`)
    }
  }
  }

};
</script>
  
  
<style scoped>
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

.tableHeader211 {
  display: flex;
  flex-direction: row;
}

.buttons {
  display: flex;
  flex-direction: row;
}

.purchdetails {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 40px 0px 0px 20px;
  gap: 20px;
  width: 100%;
  background: #FFFFFF;
  border-radius: 10px;
}

.sorticon:hover {
  cursor: pointer;
}

.settingheader {
  display: flex;
  flex-direction: row;
  width: 100%;
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

.Rfq21 {
  align-items: flex-start;
  width: 100%;
}

.rfqtableHeader215 {
  background: #FFFFFF;
  align-items: center;
  display: grid;
  grid-gap: 20px;
  margin-bottom: -10px;
}

.tableHeadertext939 {
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  margin-right: 5px;
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  text-align: left;
}

.tablerowtext23 {
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  width: 100%;
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  text-align: left;

}

.overlay {
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

.overlay1 {
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

.modal21 {
  position: fixed;
  width: 350px;
  right: -5px;
  overflow: auto;
  box-shadow: 0px 0px 5px 0.5px rgb(101, 101, 101);
  background-color: #e6e6e6;
  border-left: 1px solid rgb(113, 113, 113);
  height: 100%;
  display: flex;
  flex-direction: column;
  top: 0px;
  margin-bottom: 0px;
}

.notetext {
  margin-left: 10px;
  font-family: 'Roboto';
  display: flex;
  flex-direction: column;
  font-weight: 300;
  width: 100%;
  font-size: 12px;
  padding-right: 10px;
  vertical-align: middle;
  line-height: 14px;
  border-right: 1px solid #E4E4E7;
  color: black;
}

.notetext h2{
  font-size: 18px;
  font-family: 'Roboto';
  margin-bottom: 0px;
}

.sidebar-header {
  margin-left: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 10px 0px 0px 0px;
  align-items: baseline;
  color: rgb(0, 0, 0);
  cursor: context-menu;
}

.modal img {
  margin-top: 5px;
}


.options {
  padding: 5px;
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

.userdetailsheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px;
  gap: 10px;
  width: 400px;
  height: 30px;
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
  width: 400px;
  height: 60px;
  margin-top: 25px;
}

.modals {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  position: relative;
  width: 400px;
  border-radius: 5px;
  border: 1px solid #E4E4E7;
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

.formDetails {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 5px;
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
  width: 350px;
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
  width: 350px;
  height: 40px;
  border-radius: 5px;
  font-family: Roboto;
  font-size: 12px;
}


.newUser {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  margin: 20px 0px 0px 20px;
  color: #FFFFFF;
  padding: 10px;
  gap: 10px;
  border: none;
  cursor: pointer;
  width: 165px;
  height: 40px;
  background: linear-gradient(90deg, #227CBF 0%, #47B65C 100%);
  border-radius: 50px;
}
</style>