<script setup>
import { ref } from "vue";
const showResults = ref(false);
const onOptionSelected = (isCorrect) => {
  if (isCorrect) {
    showResults.value = !showResults.value
  }
}
const showRFQRFP = ref(true)

const rfpvalues = ref([
  { rfpNo: null, description: null, expirationdate: null, status: null }])
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Aladin">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">

  <div v-if="showResults" class="overlay" @click="showResults = false">
    <div class="modal93 animated fadeInRight" @click.stop>
      <div class="sidebar-header">
        <h3>Notifications</h3>
        <span class="close" @click="showResults = false"> ✕ </span>
      </div>
      <div class="notibox" v-for="i in notifications" :key="i.id">
        <div class="iconsize"> <v-icon size="large">mdi-bell-outline</v-icon></div>
        <div class="notetext">
          <h2>{{ i.notificationType }}</h2>
          <p :style="{ color: 'black' }">{{ i.description }}</p>
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
    <div class="activityStatus">
      <h2 class="activityHeader">
        Activity Status
      </h2>
      <div class="activityBoxGroup">
        <div class="activityBox" @click="showRFQRFP = !showRFQRFP" :style="{ cursor: 'pointer' }">
          <Transition>
            <p class="activityText">RFQ</p>
          </Transition>
          <Transition>
            <p class="activityValue">{{ rfqlengths }}</p>
          </Transition>
        </div>
        <div class="activityBox" @click="showRFQRFP = !showRFQRFP" :style="{ cursor: 'pointer' }">
          <Transition>
            <p class="activityText">RFP</p>
          </Transition>
          <Transition>
            <p class="activityValue">0</p>
          </Transition>
        </div>
        <div class="activityBox" @click="$router.push('purchcontractBidder')" :style="{ cursor: 'pointer' }">
          <Transition>
            <p class="activityText">Contract</p>
          </Transition>
          <Transition>
            <p class="activityValue">{{ purchcontracts.length }}</p>
          </Transition>
        </div>
      </div>
    </div>


    <div class="Rfq">
      <div class="rfqheader">
        <h3>My Recent Bids</h3>
      </div>
      <div class="rfqtableHeader">
        <p class="tableHeadertext" v-if="showRFQRFP">RFQ No</p>
        <p class="tableHeadertext" v-else>RFP No</p>
        <p class="tableHeadertext">Description</p>
        <p class="tableHeadertext">Expiration Date & Time</p>
        <p class="tableHeadertext">Status</p>
      </div>

      <div class="rfqtableHeader" v-for="value in filteredRFQs" v-if="showRFQRFP" @click="navigateToRFQ(value.id)">
        <p class="tablerowtext" :style="{ cursor: 'pointer' }">{{ value.id }}</p>
        <p class="tablerowtext" :style="{ cursor: 'pointer' }">{{ value.description.slice(0, 45) }}</p>
        <p class="tablerowtext" :style="{ cursor: 'pointer' }">{{ value.expirationDateTime }}</p>

        <div class="div248" v-if="value.bidSubmissionStatus === true">
          <img class="child61" alt="" src="../../assets/images/ellipse-85.svg" />
          <div class="pending21">Completed</div>
        </div>

        <div class="div244" v-if="value.bidSubmissionStatus === false">
          <img class="child57" alt="" src="../../assets/images/ellipse-84.svg" />
          <div class="completed22"> Open </div>
        </div>

      </div>

      <div class="rfqtableHeader" v-for="value in rfpvalues" @click="$router.push('/rfqResponse')" v-else>
        <p class="tablerowtext" :style="{ cursor: 'pointer' }">{{ value.rfpNo }}</p>
        <p class="tablerowtext" :style="{ cursor: 'pointer' }">{{ value.description.slice(0, 25) }}</p>
        <p class="tablerowtext" :style="{ cursor: 'pointer' }">{{ value.expirationdate }}</p>

        <div class="div244" v-if="value.bidSubmissionStatus == 'true'">
          <img class="child57" alt="" src="../../assets/images/ellipse-84.svg" />
          <div class="pending21">{{ value.status }}</div>
        </div>

        <div class="div248" v-else="value.bidSubmissionStatus=='false'">
          <img class="child61" alt="" src="../../assets/images/ellipse-85.svg" />
          <div class="completed22">{{ value.status }}</div>
        </div>

      </div>

    </div>
  </body>
</template>

<script>
import { ref } from "vue";
import PageHeader from '../../components/TopHeader.vue';
import WelcomeHead from '../../components/PageMenuHeader.vue';
import { useCounterStore } from "../../store/piniaStore"
import pinia from "../../store/store";
import administrationsService from "../../services/administrationsService";
import biddersService from "../../services/biddersService";
import purchaseContractService from '../../services/purchaseContractService';
import notificationServices from "../../services/notificationServices";

const stores = useCounterStore(pinia);

export default {
  components: {
    PageHeader, WelcomeHead
  },
  props: {
    size: {
      type: Number,
      required: false,
      default: 10
    }
  },
  data() {
    return {
      ascending: true,
      sortBy: 'alphabetically',
      contracts: [],
      searchValue: '',
      pageNumber: 0,  // default to page 0
      values2: [{ "newactivityText": "New" }, { "newactivityText": "Awaiting Approval" },
      { "newactivityText": "Approved" }, { "newactivityText": "In Progress" },
      { "newactivityText": "Completed" }, { "newactivityText": "Pending Rating" }],
      rfqvalues: [],
      purchcontracts: '',
      biddersId: '',
      rfqlengths: 0,
      showContract: false,
      notifications: []

    };
  },

  async created() {
    let bidders = await biddersService.getBidders();
    this.bidderbyLoggedInUser = bidders.filter(o => o.primaryEmailAddress === stores.signedInUserEmail)
    console.log(this.bidderbyLoggedInUser)
    this.biddersId = this.bidderbyLoggedInUser[0].id
    stores.bidderId = this.biddersId
    this.rfqvalues = await biddersService.getBidderRequisitionsById(this.biddersId)
    this.rfqlengths = this.rfqvalues.length
    if (stores.signedInUserRole == '') {
      stores.signedInUserRole = (await administrationsService.getLoggedInUserRoles(stores.signedInUserEmail)).roleName
    }
    this.purchcontracts = await purchaseContractService.getContractsbyId(stores.bidderId)
    let notifs = await notificationServices.getNotifications(stores.signedInUserEmail)
    this.notifications = notifs.reverse()
  },

  computed: {
    filteredRFQs() {
      const start = this.pageNumber * this.size,
        end = start + this.size;
      if (this.showContract == true) {
        this.contracts = this.purchcontracts
      }
      else {
        this.contracts = this.rfqvalues
      }
      // Process search input
      if (this.searchValue != '' && this.searchValue) {
        this.contracts = this.contracts.filter((item) => {
          return item.status
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())
        })
      }

      // Sort by alphabetical order
      this.contracts = this.contracts.sort((a, b) => {
        if (this.sortBy == 'alphabetically') {
          let fa = a.lastModifiedDate.slice(0, -9).toLowerCase(), fb = b.lastModifiedDate.slice(0, -9).toLowerCase()

          if (fa < fb) {
            return 1
          }
          if (fa > fb) {
            return -1
          }
          return 0

        }
      })

      // Show sorted array in descending or ascending order
      if (!this.ascending) {
        this.contracts.reverse().slice(start, end)
      }

      return this.contracts.slice(start, end)
    },
  },

  methods: {
    navigatetoNotification(id, type) {
      if (type === 'Bid Invitation' || type=== 'Bid Winner') {
        this.$router.push(`/rfqresponse/${id}`)
      }
      else if (type == 'Contract Signature' || type=== 'Executed Contract Upload') {
        this.$router.push(`/purchcontractdetails/${id}`)
      }
    },

    filterbyStatus(id) {
      this.searchValue = id
    },

    navigateToRFQ(id) {
      stores.rfqNo = id
      this.$router.push(`/rfqResponse/${id}`)
    }
  }


};
</script>

<style scoped>
.child57 {
  width: 9.9px;
  height: 10px;
}

.pending21 {
  width: 66.34px;
  margin-bottom: 33px;
}

.div244 {
  width: 100px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 6px;
  height: 25px;
  background-color: #FEF9C3;
  color: #713F12;
  border-radius: 40px;
  padding: 8px 8px 5px 11px;
  line-height: 11.4px;
  font-size: 12px;
}

.child61 {
  width: 9.9px;
  height: 10px;
}

.completed22 {
  width: 66.34px;
}

.div248 {
  width: 100px;
  display: flex;
  flex-direction: row;
  gap: 6px;
  height: 25px;
  background-color: #DCFCE7;
  color: #14532D;
  border-radius: 40px;
  padding: 8px 8px 5px 11px;
  line-height: 10.4px;
  font-size: 12px;
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

.activityBoxGroup {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  width: 100%;
  height: 120px;
  background: #FFFFFF;
  cursor: context-menu;
}

.activityBox {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 15px;
  gap: 10px;
  width: 216.67px;
  height: 120px;
  background: #227CBF;
  border: 1px solid #FFFFFF;

}

.activityStatus {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px 20px 30px 15px;
  gap: 20px;
  width: 100%;
  height: 190px;
  border-radius: 10px;
  background: #FFFFFF;
}

.activityHeader {
  width: 156px;
  height: 29px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #47B65C;
}

.activityText {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #FAFAFB;
  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.activityValue {
  width: 21px;
  height: 44px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 700;
  font-size: 36px;
  line-height: 43px;
  color: #FFFFFF;
  animation: fadeIn 1000ms;
}

.Rfq {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 0px 20px 0px;
  gap: 20px;
  width: 100%;
  border-radius: 10px;
  background: #FFFFFF;
}

.rfqheader h3 {
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #47B65C;
  padding: 0px 20px;
  gap: 10px;

}

.rfqtableHeader {
  padding: 0px 20px;
  margin-bottom: -10px;
  width: 100%;
  background: #FFFFFF;
  align-items: center;
  display: grid;
  grid-template-columns: 0.8fr 2.2fr 1.2fr 0.5fr;
  grid-gap: 20px;
}

.tableHeadertext {
  width: 100%;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
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
  word-wrap: break-word;
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

.modal93 {
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
  font-family: Roboto;
  display: flex;
  flex-direction: column;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  padding-right: 10px;
  line-height: 14px;
  border-right: 1px solid #E4E4E7;
  color: #000000;
  justify-content: space-around;
  vertical-align: middle;
}

.notetext h2{
  vertical-align: middle;
  font-size: 18px;
  font-family: 'Roboto';
  margin-bottom: 0px;
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
  margin-top: 20px;
  border-bottom: 1px solid #E4E4E7;
  text-align: center;
  color: black;
  border-bottom: #808080;
  text-decoration: underline;
}

.sidebar-header {
  margin-left: 12px;
  display: grid;
  margin: 10px 0px 0px 10px;
  grid-template-columns: 2fr 1fr;
  align-items: baseline;
  color: rgb(0, 0, 0);
  cursor: context-menu;
}

.sidebar-header .close {
  cursor: pointer;
  border-radius: 20px 0px 0px 20px;
  padding: 3px 0px 10px 60px;
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
