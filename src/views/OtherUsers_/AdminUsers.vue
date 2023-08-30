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
  <div v-if="showNewUserModal" id="overlay" class="overlay" @click="showNewUserModal = false">
    <div class="modals" @click.stop>
      <div class="userdetailsheader">
        <p class="userdetailstext">User Details</p>
        <p @click="showNewUserModal = false" :style="{ cursor: 'pointer' }">X</p>
      </div>
      <form @submit.prevent="onSubmit">
        <div class="Line">
          <div class="formDetails">
            <label>First Name</label>
            <input placeholder="First name" type="text" v-model="firstName" />
          </div>
          <div class="formDetails">
            <label>Last Name</label>
            <input placeholder="Last name" type="text" v-model="LastName" />
          </div>
          <div class="formDetails">
            <label>Job Title</label>
            <input placeholder="Job Title" type="text" v-model="jobTitle" />
          </div>
        </div>

        <div class="Line">
          <div class="formDetails">
            <label>Email Address</label>
            <input placeholder="Email Address" type="email" required v-model="emailAddress" :disabled="disabled" />
          </div>
          <div class="formDetails">
            <label>Phone Number</label>
            <input placeholder="Phone Number" type="number" v-model="phoneNumber" />
          </div>
          <div class="formDetails">
            <label>User Role</label>
            <select required v-model="userRoleId">
              <option value="" disabled selected>User Role</option>
              <option value=5>Basic</option>
              <option value=4>Finance Admin</option>
              <option value=3>Procurement Admin</option>
              <option value=2>IT Admin</option>
              <option value=6>Management</option>
              <option value=7>Bidder</option>
            </select>
          </div>

        </div>

        <div class="Line">
          <div class="formDetails">
            <label>Department</label>
            <select required v-model="departmentId" :disabled="disabled">
              <option value="" disabled selected>Select Department</option>
              <option :value=departmentList.id v-for="departmentList in departments">
                {{ departmentList.departmentDescription }}</option>
            </select>
          </div>

          <div class="formDetails">
            <label>Business Unit</label>
            <select required v-model="businessUnitId" :disabled="disabled">
              <option value="" disabled selected>Select Business Unit</option>
              <option :value=businessUnitList.id v-for="businessUnitList in businessUnits">
                {{ businessUnitList.businessUnitDescription }}</option>
            </select>
          </div>

        </div>

        <div class="Line">
          <div class="address">
            <label>Address</label>
            <input placeholder="Address" type="text" v-model="address" />
          </div>
        </div>
        <b style="margin-left: 15px;">{{ errorMessage }}</b>
        <div class="newUser">
          <v-btn :loading="loading" class="flex-grow-1" height="48" rounded="xl" v-on:click.prevent="onSubmitEdit"
            v-if='onEdits'>
            Submit
          </v-btn>
          <v-btn :loading="loading" class="flex-grow-1" height="48" rounded="xl" variant="tonal"
            v-on:click.prevent="onSubmit" v-else>
            Submit
          </v-btn>
        </div>

      </form>
    </div>
  </div>

  <div v-if="showResults" class="overlay1" @click="showResults = false">
    <div class="modal2 animated fadeInRight" @click.stop>
      <div class="sidebar-header">
        <h3>Notifications</h3>
        <span class="close" @click="showResults = false"> ✕ </span>
      </div>
      <div class="notibox" v-for="i in notifications" :key="i.id">
        <div class="iconsize"> <v-icon size="large">mdi-bell-outline</v-icon></div>
        <div class="notetext">
          <h3>{{ i.notificationType }}</h3>
          <p :style="{ color: 'black' }">{{ i.description }}</p>
        </div>
        <div class="options" :style="{ cursor: 'pointer' }">
          <h3 @click="navigatetoNotification(i.recordId, i.notificationType)">See details</h3>
        </div>
      </div>
    </div>
  </div>

  <div v-if="deleteModal" class="overlay" @click="deleteModal = false">
    <div class="modals2" @click.stop>
      <p style="font-size: 30; font-weight: 700;">Are you sure you want to Delete?</p>
      <div style="display: flex; flex-direction: row; gap: 20px;"> <button @click="deleteModal = false;" class="rfqbtn">
          Cancel
        </button>
        <button @click="deleteUser(bidderNumber)" class="rfqbtn">
          Delete
        </button>
      </div>
    </div>
  </div>
  <PageHeader @selectOption="onOptionSelected"></PageHeader>

  <body>
    <WelcomeHead></WelcomeHead>
    <div class="settingheader">
      <SettingsHeader></SettingsHeader>
      <button v-on:click="onNew" class="rfqbtn" v-if="$route.path == '/settings'">
        Add new User
      </button>
    </div>
    <div class="purchdetails">
      <div class="activityBoxPurch">
        <input type="text" v-model="searchValue" placeholder="Search..." />
      </div>
      <div class="Rfq">
        <div class="table-responsive-sm">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col"><b>Name </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Email </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Role </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Type </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.userId" :style="{ cursor: 'pointer' }"
                @click="editAdmin(user.userFullName, user.userId, user.jobTitle, user.phoneNumber, user.roleName, user.address, user.departmentId, user.businessUnitId)"
                :onClick="onEdit">
                <th scope="row">{{ user.userFullName }}</th>
                <td>{{ user.userId }}</td>
                <td>{{ user.roleName }}</td>
                <td>{{ user.userType }}</td>
                <td style="color: red; " @click.stop="deleteModal = true; this.emailAddress = user.userId">X</td>
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
import administrationsService from "../../services/administrationsService";
import settingsService from "../../services/settingsService";
import notificationServices from "../../services/notificationServices";
import { useCounterStore } from "../../store/piniaStore";
import pinia from "../../store/store";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import emailServices from "../../services/emailServices";
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
      adminUsers: [],
      disabled: false,
      firstName: "",
      LastName: "",
      FullName: "",
      jobTitle: "",
      emailAddress: "",
      departments: [],
      deleteModal: false,
      businessUnits: [],
      phoneNumber: "",
      errorMessage: '',
      loading: false,
      userRoleId: "",
      departmentId: undefined,
      businessUnitId: undefined,
      address: "",
      showResults: false,
      onEdits: false,
      showNewUserModal: false,
      searchValue: '',
      notifications: []
    };
  },
  async created() {
    this.adminUsers = await administrationsService.getUserRoles();
    this.departments = await settingsService.getDepartments()
    this.businessUnits = await settingsService.getBusinessUnits()
    let notifs = await notificationServices.getNotifications(stores.signedInUserEmail)
    this.notifications = notifs.reverse()

  },

  computed: {
    pageCount() {
      let l = this.adminUsers.length,
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
      let users = this.adminUsers


      if (this.searchValue != '' && this.searchValue) {
        users = users.filter((item) => {
          return item.userFullName
            .toLowerCase()
            .includes(this.searchValue.toLowerCase()) ||
            item.userId.toLowerCase().includes(this.searchValue.toLowerCase())
        })
      }

      // Sort by alphabetical order
      users = users.sort((a, b) => {

        if (this.sortBy == 'alphabetically') {
          let fa = a.userFullName.toLowerCase(), fb = b.userFullName.toLowerCase()

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
    nextPage() {
      this.pageNumber++;
    },
    prevPage() {
      this.pageNumber--;
    },
    async deleteUser() {
      await administrationsService.deleteUsers(this.emailAddress);
      toast.success("Delete Successful"); 
      this.deleteModal = false;
      setTimeout(async () => {
        this.adminUsers = await administrationsService.getUserRoles()
      }, 2000);
    },
    editAdmin(userFullName, userId, jobTitles, phoneNumbers, roles, addressUser, departments, businessUnits) {
      this.firstName = userFullName; this.emailAddress = userId, this.jobTitle = jobTitles,
        this.phoneNumber = phoneNumbers, this.userRoleId = roles, this.address = addressUser
      this.departmentId = departments, this.businessUnitId = businessUnits
      this.showNewUserModal = true
    },

    onEdit() {
      this.onEdits = true;
      this.disabled = true;
    },

    onNew() {
      this.showNewUserModal = true;
      this.disabled = false;
      this.firstName = ""
      this.LastName = ""
      this.FullName = ""
      this.jobTitle = ""
      this.emailAddress = ""
      this.phoneNumber = ""
      this.userRoleId = ""
      this.departmentId = undefined
      this.businessUnitId = undefined
      this.onEdits = false;

    },

    async onSubmit() {
      this.FullName = this.firstName.concat(' ', this.LastName)
      if (this.emailAddress == '', this.FullName == '', this.userRoleId == '', this.jobTitle == '', this.phoneNumber = '', this.address = '', this.departmentId == undefined, this.businessUnitId == undefined) {
        return this.errorMessage = "Please fill in all fields appropraitely"
      }
      let ps = await administrationsService.createUsers(this.emailAddress, this.FullName, this.userRoleId, this.jobTitle, this.phoneNumber, this.address, this.departmentId, this.businessUnitId)
      if (ps) {
        emailServices.sendUserOnboarding(this.emailAddress, this.FullName, 'User Onboarding To Infracredit Procurement', '', '', '', new Date().toJSON(), '', 'procurement@infracredit.ng', 'Procurement Team')
        this.showNewUserModal = false;
        toast.success("User Created Successfully");
      }
      setTimeout(async () => {
        this.adminUsers = await administrationsService.getUserRoles()
      }, 2000);
    },

    async onSubmitEdit() {
      this.FullName = this.firstName.concat(' ', this.LastName)
      this.loading = true
      if (this.emailAddress == '', this.FullName == '', this.userRoleId == '', this.jobTitle == '', this.phoneNumber = '', this.address = '', this.departmentId == undefined, this.businessUnitId == undefined) {
        return this.errorMessage = "Please fill in all fields appropraitely"
      }
      await administrationsService.editUser(this.emailAddress, this.FullName, this.userRoleId, this.jobTitle, this.phoneNumber, this.address, this.departmentId, this.businessUnitId)

      setTimeout(async () => {
        this.loading = false
        this.showNewUserModal = false;
        this.adminUsers = await administrationsService.getUserRoles()
      }, 3000);
    },
    navigatetoNotification(id, type) {
      if (type == 'Bid Submission') {
        this.$router.push(`/rfqedit/${id}`)
      }

      else if (type == 'Signed Contract Upload') {
        this.$router.push(`/purchcontractdetails/${id}`)
      }
    }
  }

};
</script>
  
  
<style scoped>
.v-btn {
  background: linear-gradient(90deg, #227CBF 0%, #47B65C 100%);
  color: #FFFFFF;
  padding: 10px 60px 10px 60px;

}

.paginationButtons {
  justify-content: flex-end;
  align-self: flex-end;
  display: flex;
  margin-top: -10px;
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
  font-family: 'Roboto';
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
  border-radius: 10px;
  background: #ffffff;

}

.sorticon:hover {
  cursor: pointer;
}

.settingheader {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.rfqbtn {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  margin-top: 17px;
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

.searchbtn {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
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

.rfqbtn:hover,
.searchbtn:hover {
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

.rfqtableHeader {
  width: 100%;
  background: #FFFFFF;
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.5fr 1fr;
  grid-gap: 20px;
}

.tableHeader {
  display: flex;
  flex-direction: row;
}

.tableHeadertext {
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  margin-right: 5px;
  font-size: 16px;
  line-height: 19px;
  color: #000000;
  text-align: left;
}

.tablerowtext {
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
  overflow: auto;
  align-items: center;
  justify-content: center;
}

.iconsize {
  margin-top: 2px
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

.userdetailsheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  gap: 10px;
  width: 900px;
  height: 44px;
  margin-top: -30px;
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

select:disabled {
  background: #dddddd;
}

.newUser {
  margin: 10px 0px 0px 15px;
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

.activityBoxPurch input {
  align-items: center;
  border: 1px #000000 solid;
  padding: 10px 20px;
  gap: 21px;
  width: 350px;
  right: 0px;
  height: 40px;
}

.activityBoxPurch {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  padding-right: 20px;
}

.formDetails input {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
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
.modals2 {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  position: relative;
  width: 690px;
  border-radius: 5px;
  border: 1px solid #E4E4E7;
}
.modal2 {
  position: fixed;
  width: 350px;
  right: -5px;
  box-shadow: 0px 0px 5px 0.5px rgb(101, 101, 101);
  background-color: #e6e6e6;
  border-left: 1px solid rgb(113, 113, 113);
  height: 100%;
  overflow: auto;
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

.notetext h3 {
  font-size: 18px;
  font-family: 'Roboto';
  margin-bottom: 0px;
}

.modals img {
  margin-top: 5px;
}

.options {
  padding: 5px;
}

.sidebar-header {
  margin-left: 12px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 100px;
  align-items: baseline;
  color: rgb(0, 0, 0);
  cursor: context-menu;
}

.sidebar-header .close {
  cursor: pointer;
  border-radius: 20px 0px 0px 20px;
  padding: 3px 0px 10px 10px;
}

.notibox {
  color: black;
  font-family: 'Roboto';
  background-color: white;
  padding: 15px;
  margin: 5px;
  border-radius: 6px;
  position: relative;
  display: flex;
  width: 23.5vw;
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

.options p {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #808080;
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
</style>