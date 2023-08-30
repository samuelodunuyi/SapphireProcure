<script setup>
import { RouterLink } from 'vue-router';
const emit = defineEmits(["selectedButton"])
const emitSelectedButton = (isCorrects) => {
  emit("selectedButton", isCorrects)
}
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Aladin">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
  <div class="MainHead">
    <div class="WelcomeNote">
      <h2><b>Hi {{ firstName }}, </b> Welcome to Infra eProcure</h2>
      <div class="toggleButton" v-if="$route.path == '/'"
        v-show="showITAdminMenu || showProcurementAdminMenu || showITAdminMenu || showManagementMenu">
        <v-btn-toggle v-model="text" color='green-darken-1' group mandatory variant="elevated">
          <v-btn size="x-small" density="compact" value="myrecords" v-on:click="emitSelectedButton('myRecords')">
            My Records
          </v-btn>
          <v-btn size="x-small" density="compact" value="allrecords" v-on:click="emitSelectedButton('allRecords')">
            All Records
          </v-btn>
        </v-btn-toggle>
      </div>

    </div>
    <div class="topItems" v-if="showITAdminMenu">
      <div class="tabmenu">
        <RouterLink to="/" active-class="active" class="inactive">Dashboard</RouterLink>
        <RouterLink to="/settings" active-class="active" class="inactive">Settings</RouterLink>
        <RouterLink to="/biddersList" active-class="active" class="inactive">Bidders</RouterLink>
        <RouterLink to="/rfqs" active-class="active" class="inactive">Request for Quotes</RouterLink>
        <RouterLink to="/purchcontract" active-class="active" class="inactive">Service Contracts</RouterLink>
        <RouterLink to="/reviewVendor" active-class="active" class="inactive">Rate Bidders</RouterLink>
      </div>
    </div>

    <div class="topItems" v-if="showProcurementAdminMenu">
      <div class="tabmenu">
        <RouterLink to="/" active-class="active" class="inactive">Dashboard</RouterLink>
        <RouterLink to="/biddersList" active-class="active" class="inactive">Bidders</RouterLink>
        <RouterLink to="/rfqs" active-class="active" class="inactive">Request for Quotes</RouterLink>
        <RouterLink to="/purchcontract" active-class="active" class="inactive">Service Contracts</RouterLink>
        <RouterLink to="/reviewVendor" active-class="active" class="inactive">Rate Bidders</RouterLink>
        <RouterLink to="/report" active-class="active" class="inactive">Report</RouterLink>
      </div>
    </div>


    <div class="topItems" v-if="showManagementMenu">
      <div class="tabmenu">
        <RouterLink to="/" active-class="active" class="inactive">Dashboard</RouterLink>
        <RouterLink to="/biddersList" active-class="active" class="inactive">Bidders</RouterLink>
        <RouterLink to="/rfqs" active-class="active" class="inactive">Request for Quotes</RouterLink>
        <RouterLink to="/purchcontract" active-class="active" class="inactive">Service Contracts</RouterLink>
        <RouterLink to="/report" active-class="active" class="inactive">Report</RouterLink>
      </div>
    </div>

    <div class="topItems" v-if="showFinanceAdminMenu">
      <div class="tabmenu">
        <RouterLink to="/" active-class="active" class="inactive">Dashboard</RouterLink>
        <RouterLink to="/biddersList" active-class="active" class="inactive">Bidders</RouterLink>
        <RouterLink to="/rfqs" active-class="active" class="inactive">Request for Quotes</RouterLink>
        <RouterLink to="/purchcontract" active-class="active" class="inactive">Service Contracts</RouterLink>
      </div>
    </div>

    <div class="topItems" v-if="showBidderMenu">
      <div class="tabmenu">
        <RouterLink to="/bidders" active-class="active" class="inactive">Dashboard</RouterLink>
        <RouterLink to="/rfqBids" active-class="active" class="inactive">Request for Quotes</RouterLink>
        <RouterLink to="/purchcontractBidder" active-class="active" class="inactive">My Service Contracts</RouterLink>
        <RouterLink to="/biddersProfile" active-class="active" class="inactive">Profile</RouterLink>
      </div>
    </div>


    <div class="topItems" v-if="showBasicMenu">
      <div class="tabmenu">
        <RouterLink to="/basichome" active-class="active" class="inactive">My Requisitions</RouterLink>
        <RouterLink to="/PurchContractHome" active-class="active" class="inactive"> Service Contracts</RouterLink>
        <RouterLink to="/ratingBasic" active-class="active" class="inactive">Rate Bidders</RouterLink>
      </div>
      <div>
        <button @click="$router.push('/newrfq')" class="rfqbtn2" v-if="$route.path == '/basichome'">
          Create new RFQ
        </button>
      </div>
    </div>

    <div class="topItems" v-if="userRoleId > 7">
      <div class="tabmenu">
      </div>
    </div>
  </div>
</template>

<script>
import authenticationService from '../services/authenticationService';
import { useCounterStore } from "../store/piniaStore"
import pinia from "../store/store";


export default {
  name: 'PageMenuHeader',
  data() {
    return {
      stores: useCounterStore(pinia),
      account: undefined,
      firstName: undefined,
      userRoleId: '',
      showBidderMenu: false,
      showBasicMenu: false,
      showFinanceAdminMenu: false,
      showProcurementAdminMenu: false,
      showITAdminMenu: false,
      showManagementMenu: false,
      text: 'myrecords',
    };
  },

  async created() {
    this.userRoleId = this.stores.signedInUserRole
    if (this.userRoleId == 'IT Admin') {
      this.showITAdminMenu = true
    }
    else if (this.userRoleId == 'Procurement Admin') {
      this.showProcurementAdminMenu = true
    }
    else if (this.userRoleId == 'Finance Admin') {
      this.showFinanceAdminMenu = true
    }
    else if (this.userRoleId == 'Basic') {
      this.showBasicMenu = true
    }
    else if (this.userRoleId == 'Management') {
      this.showManagementMenu = true
    }
    else if (this.userRoleId == 'Bidder') {
      this.showBidderMenu = true
    }
  },

  mounted() {
    const accounts = authenticationService.msalInstance.getAllAccounts();
    this.account = accounts[0];
    this.firstName = this.account.name
    this.firstName = this.firstName.substring(0, this.firstName.indexOf(' '));
  },

};

</script>

<style scoped>
.MainHead {
  width: 100%;
}


.v-btn-toggle {
  border: 1px solid black;
  width: 155px;
  justify-content: center;
  border-radius: 10px;
  background-color: #FFFFFF;
  padding: 7px 0px;
  box-sizing: border-box;
  height: 37px;
  background: #FFFFFF;
  border: 1px solid #D4D4D8;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.06);
  border-radius: 5px;
}

.v-btn {
  width: 70px;
  height: 30px;
  align-items: center;
  justify-content: center;
  padding: 6px 36px;
  height: 27px;
  border-radius: 6px;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  font-size: 9px;
  line-height: 14px;
  border: 1px solid #D4D4D8;

}

.rfqbtn2 {
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

.WelcomeNote {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0px;
  gap: 10px;
  height: 24px;
  flex: none;
  order: 0;
  flex-grow: 0
}

.WelcomeNote b {
  height: 24px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #000000;
  flex: none;
  order: 0;
  flex-grow: 0;
}

.inactive {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  font-family: Roboto;
  text-decoration: none;
  color: #808080;
}

.active {
  color: #227CBF;
  border-bottom: 1.5px solid #227CBF;
  padding-bottom: 14px;
  cursor: default;
}


.WelcomeNote h2 {
  height: 20px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #808080;
}

.tabmenu {
  margin-top: 20px;
  width: 1045px;
  height: 44px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 30px;

}

.topItems {
  margin-top: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  width: 100%;
  height: 44px;
  border-bottom: 0.5px solid #808080;
}
</style>
