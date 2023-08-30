<script setup>
import { ref } from "vue";
const showFilter = ref(false)
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
}
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

  <div v-if="showResults" class="overlay1" @click="showResults = false">
    <div class="modal2 animated fadeInRight" @click.stop>
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

  <div v-if="showBidderForm" class="overlay" @click="showBidderForm = false">
    <div class="modals" @click.stop>
      <div class="userdetailsheader">
        <p class="userdetailstext">User Details</p>
        <p @click="showBidderForm = false" :style="{ cursor: 'pointer' }">X</p>
      </div>
      <form @submit.prevent="onSubmit">
        <div class="formBox">
          <div class="LineHeader">
            General
          </div>
          <div class="Line">
            <div class="formDetails">
              <label>Bidder Number</label>
              <input placeholder="Bidder Number" type="text" v-model="bidderNumber" :disabled="disabled" />
            </div>
            <div class="formDetails">
              <label>Name</label>
              <input placeholder="Name" type="text" v-model="bidderName" />
            </div>
          </div>
          <div class="Line">
            <div class="formDetails">
              <label>Last Date Modified</label>
              <input placeholder="Date" type="date" v-model="dateModified" disabled />
            </div>
            <div class="formDetails">
              <label>Status</label>
              <input placeholder="Status" type="text" v-model="bidderStatus" disabled />
            </div>
          </div>
        </div>

        <div class="formBox">
          <div class="LineHeader">
            Address & Contact
          </div>
          <div class="Line">
            <div class="formDetails">
              <label>Address 1</label>
              <input placeholder="Address 1" type="text" v-model="address1" />
            </div>
            <div class="formDetails">
              <label>City</label>
              <input placeholder="City" type="text" v-model="bidderCity" />
            </div>
          </div>

          <div class="Line">
            <div class="formDetails">
              <label>State</label>
              <input placeholder="State" type="text" v-model="bidderState" />
            </div>
            <div class="formDetails">
              <label>Contact Person Name</label>
              <input placeholder="Contact" type="text" v-model="contactPerson" />
            </div>
          </div>

          <div class="Line">
            <div class="formDetails">
              <label>Phone Number</label>
              <input placeholder="Phone Number" type="text" v-model="bidderPhoneNumber" />
            </div>
            <div class="formDetails">
              <label>Organization Email</label>
              <input placeholder="Contact" type="email" v-model="bidderEmail" />
            </div>
          </div>

          <div class="Line">
            <div class="formDetails">
              <label>Alternative Email 1</label>
              <input placeholder="Alternative Email" type="email" v-model="bidderAlternativeEmail1" />
            </div>
            <div class="formDetails">
              <label>Alternative Email 2</label>
              <input placeholder="Alternative Email" type="email" v-model="bidderAlternativeEmail2" />
            </div>
          </div>

          <div class="Line">
            <div class="formDetails">
              <label>Alternative Email 3</label>
              <input placeholder="Alternative Email" type="email" v-model="bidderAlternativeEmail3" />
            </div>
          </div>
        </div>
        <div class="formBox">
          <div class="LineHeader">
            Payment
          </div>
          <div class="Line">
            <div class="formDetails">
              <label>TIN Number</label>
              <input placeholder="Enter Tin Number" type="text" v-model="bidderTINNumber" />
            </div>
            <div class="formDetails">
              <label>Payment Term Code</label>
              <select v-model="selectedPaymentType" required>
                <option value="" disabled selected>Payment Term Code</option>
                <option value=4>14 Days</option>
                <option value=1>1M(BD)</option>
                <option value="2">45 Days</option>
                <option value=3>2 Months</option>
              </select>
            </div>
          </div>
        </div>

        <div class="formBox">
          <div class="LineHeader">
            Services
          </div>
          <div class="Line9">
            <div class="formDetails2">
              <label>Class</label>
              <select v-model="selectedServiceType" required @change="getServiceLines()">
                <option value="" disabled selected>Class</option>
                <option value=1>Legal</option>
                <option value=3>ESG</option>
                <option value=2>Technical</option>
              </select>
            </div>
            <div class="categoryLineSwitch">
              <v-switch v-model="selected" color="#004D40" :label=selectedServiceLines.subCategoryName
                :value="selectedServiceLines.id" v-for="selectedServiceLines in selectedServiceLine"
                :key="selectedServiceLines.id" hide-details inset density="comfortable"></v-switch>
            </div>
          </div>
        </div>


        <div class="formBox" v-if="onEdits">
          <div class="LineHeader">
            Bidder Overall Contract Performance Ratings
          </div>
          <div class="ratingtext">
            <b>Total Contracts Rated</b>
            <b>{{ totalContractsRated }}</b>
          </div>

          <div class="ratingtext">
            <p>Total Rating Score %</p>
            <div class="ratingdetails">
              <v-rating v-model="bidderTotalCalc" bg-color="orange-lighten-1" color="#47B65C" density="compact" hover
                half-increments readonly></v-rating>
              <b>{{ bidderTotalCalc2 }}%</b>
            </div>
          </div>

        </div>
        <b>{{ errorMessage }}</b>

        <button v-if='onEdits' v-on:click.prevent="onSubmitEdit" class="rfqbtn">
          Submit
        </button>
        <button v-else v-on:click.prevent="onSubmit" class="rfqbtn">
          Submit
        </button>
      </form>
    </div>
  </div>
  <div v-if="deleteModal" class="overlay" @click="deleteModal = false">
    <div class="modals2" @click.stop>
      <p style="font-size: 30; font-weight: 700;">Are you sure you want to Delete?</p>
      <div style="display: flex; flex-direction: row; gap: 20px;"> <button @click="deleteModal = false;" class="rfqbtn">
          Cancel
        </button>
        <button @click="deleteBidder(bidderNumber)" class="rfqbtn">
          Delete
        </button>
      </div>
    </div>
  </div>
  <PageHeader @selectOption="onOptionSelected"></PageHeader>

  <body>
    <WelcomeHead></WelcomeHead>
    <div class="purchdetails">
      <div class="activityStatusPurch">
        <div class="btn">
          <button @click="navigateToNewRFQ" class="btns">
            Upload Prequalified Bidders
          </button>
          <button v-on:click="onNew" class="btns">
            Create new Bidder
          </button>
        </div>
        <div class="activityBoxPurch">
          <input type="text" v-model="searchValue" placeholder="Search..." />
          <img src="../../assets/images/Frame.svg" class="filter" @click="toggleFilter">
        </div>
      </div>
      <div class="filerdetails" v-if="showFilter">
        <label for="">Filter by Bid No:</label>
        <div class="criteria">
          <label for="">From: </label>
          <input type="text" v-model="biddersSearchValueTo">
          <label for="">To: </label>
          <input type="text" v-model="biddersSearchValueFro">
          <p v-if='completeValue'>Please fill in both fields to filter</p>
        </div>
      </div>

      <div class="Rfq">
        <div class="table-responsive-sm">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col"><b>No </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Name </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Email </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Phone Number </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Address </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bidders in filteredBidders" :style="{ cursor: 'pointer' }" :key="bidders.bidNumber" @click="editBidders(
                bidders.id,
                bidders.bidderName,
                bidders.address,
                bidders.city,
                bidders.stateId,
                bidders.contactName,
                bidders.primaryContactNumber,
                bidders.primaryEmailAddress,
                bidders.tinNumber,
                bidders.paymentTermId,
                bidders.serviceCategoryId,
                bidders.lastModifiedDate,
                bidders.alternativeEmail1,
                bidders.alternativeEmail2,
                bidders.alternativeEmail3
              )" :onClick="onEdit">
                <th scope="row">{{ bidders.id }}</th>
                <td>{{ bidders.bidderName }}</td>
                <td>{{ bidders.primaryEmailAddress }}</td>
                <td>{{ bidders.primaryContactNumber }}</td>
                <td>{{ bidders.address }}</td>
                <td style="color: red; " @click.stop="deleteModal = true; this.bidderNumber = bidders.id">X</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="tablerowtext1"
          v-if="searchValue && !filteredBidders.length || biddersSearchValueTo && biddersSearchValueFro && !filteredBidders.length">
          No results found!</p>
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
import PageHeader from '../../components/TopHeader.vue';
import biddersService from "../../services/biddersService";
import administrationsService from "../../services/administrationsService";
import notificationServices from "../../services/notificationServices";
import { useCounterStore } from "../../store/piniaStore"
import pinia from "../../store/store";
import emailServices from "../../services/emailServices";
import { toast } from 'vue3-toastify';
import ratingServices from "../../services/ratingServices";
const stores = useCounterStore(pinia);

export default {
  components: {
    WelcomeHead, PageHeader
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
      selected: [],
      serviceLine: false,
      ascending: true,
      completeValue: false,
      pageNumber: 1,  // default to page 0
      sortBy: 'alphabetically',
      searchValue: '',
      deleteModal: false,
      showBidderForm: false,
      selectedPaymentType: '',
      selectedServiceType: '',
      biddersSearchValueTo: "",
      biddersSearchValueFro: "",
      onEdits: false,
      bidderTotalCalc: "",
      bidderTotalCalc2: "",
      totalContractsRated: 0,
      bidderList: [],
      bidderNumber: '',
      bidderName: '',
      dateModified: '',
      errorMessage: '',
      bidderStatus: '',
      address1: '',
      bidderCity: '',
      bidderState: '',
      contactPerson: '',
      bidderPhoneNumber: '',
      bidderEmail: '',
      bidderAlternativeEmail1: '',
      bidderAlternativeEmail2: '',
      bidderAlternativeEmail3: '',
      bidderTINNumber: '',
      selectedServiceLine: [],
      disabled: false,
      notifications: [],
    };
  },

  async created() {
    this.bidderList = await biddersService.getBidders();
    let notifs = await notificationServices.getNotifications(stores.signedInUserEmail)
    this.notifications = notifs.reverse()
  },

  computed: {
    pageCount() {
      let l = this.bidderList.length,
        s = this.size;
      return Math.ceil(l / s);
    },

    indexStart() {
      return (this.pageNumber - 1) * this.size;
    },
    indexEnd() {
      return this.indexStart + this.size;
    },

    filteredBidders() {
      const start = (this.pageNumber - 1) * this.size,
        end = start + this.size;
      let biddders = this.bidderList;

      // Process search input
      if (this.searchValue != '' && this.searchValue) {
        biddders = biddders.filter((item) => {
          return item.id
            .toLowerCase()
            .includes(this.searchValue.toLowerCase()) ||
            item.bidderName.toLowerCase().includes(this.searchValue.toLowerCase())
        })
      }

      //   filter 
      if (this.biddersSearchValueTo && this.biddersSearchValueFro) {
        biddders = this.bidderList.filter((item) => {
          return this.biddersSearchValueTo.toUpperCase() <= item.id && item.id <= this.biddersSearchValueFro.toUpperCase();
        })
      }
      else if (!this.biddersSearchValueTo && this.biddersSearchValueFro || this.biddersSearchValueTo && !this.biddersSearchValueFro) {
        this.completeValue = true;
        return biddders = this.bidderList
      }

      // Sort by alphabetical order
      biddders = biddders.sort((a, b) => {
        if (this.sortBy == 'alphabetically') {
          let fa = a.id.toLowerCase(), fb = b.id.toLowerCase()

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
        biddders.reverse().slice(this.indexStart, this.indexEnd)
      }

      return biddders.slice(this.indexStart, this.indexEnd)
    },
  },

  methods: {
    nextPage() {
      this.pageNumber++;
    }, async deleteBidder() {
      await biddersService.deleteBidders(this.bidderNumber);
      toast.success("Delete Successful"); 
      this.deleteModal = false;
      setTimeout(async () => {
        this.bidderList = await biddersService.getBidders()
      }, 2000);
    },
    prevPage() {
      this.pageNumber--;
    },
    localizeDate(date) {
      if (!date || !date.includes('-')) return date
      const [yyyy, mm, dd] = date.split('-')
      return new Date(`${mm}/${dd}/${yyyy}`)
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(date))
    },
    checkSelectionDate() {
      if (this.selectedType == "date") {
        return true
      }
      return false

    },
    checkSelectionContractNo() {
      if (this.selectedType == "contractNo") {
        return true
      }
      return false

    },

    async editBidders(biddersNum, bidderNames, biddersaddr, bidderscity, bidderState, bidderscontactNames, biddersContactNumber, biddersEmailAddress, bidderstinNum, bidderspaymentTermIds, biddersserviceCategoryIds, bidderslastModifiedDates, alternativeEmail1, alternativeEmail2, alternativeEmail3) {
      var bidderserviceline;
      this.bidderNumber = biddersNum, this.bidderName = bidderNames, this.dateModified = bidderslastModifiedDates.slice(0, -9), this.bidderStatus = "status",
        this.address1 = biddersaddr, this.bidderCity = bidderscity, this.bidderState = bidderState, this.contactPerson = bidderscontactNames, this.bidderAlternativeEmail1 = alternativeEmail1, this.bidderAlternativeEmail2 = alternativeEmail2, this.bidderAlternativeEmail3 = alternativeEmail3
      this.bidderPhoneNumber = biddersContactNumber, this.bidderEmail = biddersEmailAddress, this.bidderTINNumber = bidderstinNum, this.selectedPaymentType = bidderspaymentTermIds,
        this.selectedServiceType = biddersserviceCategoryIds, bidderserviceline = await biddersService.getServiceLine(this.bidderNumber), this.showBidderForm = true,
        this.selectedServiceLine = await administrationsService.getServiceLine(this.selectedServiceType)
      const bidderRating = await ratingServices.getBidderPerformancesByBidderId(biddersNum)
      if (bidderRating[0]) {
        this.totalContractsRated = (bidderRating[0].totalCounts) / 5
        this.bidderTotalCalc = (bidderRating[0].avgScores.toFixed(2)) / 20
        this.bidderTotalCalc2 = bidderRating[0].avgScores.toFixed(2)
      }
      else {
        this.totalContractsRated = 0
        this.bidderTotalCalc = 0
        this.bidderTotalCalc2 = 0
      }
      let biddersServiceLineMap = bidderserviceline.map(({ serviceCategoryId, subCategoryName, ...rest }) => ({ ...rest }))
      this.selected = biddersServiceLineMap.map(function (item) {
        return item.id;
      });
    },

    onEdit() {
      this.onEdits = true;
      this.disabled = true;
      this.errorMessage = ""
    },

    onNew() {
      this.showBidderForm = true,
        this.disabled = false,
        this.bidderNumber = '',
        this.bidderTINNumber = '',
        this.bidderName = "",
        this.dateModified = new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
        this.bidderStatus = 'New',
        this.address1 = "",
        this.bidderCity = "",
        this.bidderState = "",
        this.bidderAlternativeEmail1 = "",
        this.bidderAlternativeEmail2 = "",
        this.bidderAlternativeEmail3 = "",
        this.contactPerson = "",
        this.bidderPhoneNumber = "",
        this.bidderEmail = "",
        this.selectedPaymentType = "",
        this.selectedServiceType = "",
        this.onEdits = false,
        this.selected = [],
        this.errorMessage = ""
    },

    async onSubmit() {
      if (this.bidderNumber == '' || this.bidderTINNumber == '' || this.bidderName == '' || this.dateModified == '' || this.bidderStatus == '' || this.address1 == '' || this.bidderCity == '' || this.contactPerson == '' || this.bidderPhoneNumber == '' || this.bidderEmail == '' || this.selectedPaymentType == '' || this.selectedServiceType == '' || this.selected == []) {
        return this.errorMessage = "Please fill in all fields appropraitely"
      }
      let newArr = this.selected.toString()
      await biddersService.createBidders(this.bidderNumber, this.bidderTINNumber, this.bidderName, this.dateModified, this.bidderStatus, this.address1, this.bidderCity, this.bidderState, this.contactPerson, this.bidderPhoneNumber, this.bidderEmail, this.selectedPaymentType, this.selectedServiceType, newArr, this.bidderAlternativeEmail1, this.bidderAlternativeEmail2, this.bidderAlternativeEmail3)
      await administrationsService.createUsers(this.bidderEmail, this.bidderName, 7, 'Bidder', this.bidderPhoneNumber, this.address1, 8, 13)
      await emailServices.sendBidderOnboarding(this.bidderEmail, this.bidderName, 'You are Now a Bidder on Infra eProcure')
      this.showBidderForm = false;
      toast.success("Bidder Account Created Successfully");
      setTimeout(async () => {
        this.bidderList = await biddersService.getBidders()
      }, 2000);
      setTimeout(async () => {
        await biddersService.editBidders(this.bidderNumber, this.bidderTINNumber, this.bidderName, this.dateModified, this.bidderStatus, this.address1, this.bidderCity, this.bidderState, this.contactPerson, this.bidderPhoneNumber, this.bidderEmail, this.selectedPaymentType, this.selectedServiceType, newArr, this.bidderAlternativeEmail1, this.bidderAlternativeEmail2, this.bidderAlternativeEmail3)
        this.bidderList = await biddersService.getBidders()
      }, 2000);
    },

    async onSubmitEdit() {
      if (this.bidderNumber == '' || this.bidderTINNumber == '' || this.bidderName == '' || this.dateModified == '' || this.bidderStatus == '' || this.address1 == '' || this.bidderCity == '' || this.contactPerson == '' || this.bidderPhoneNumber == '' || this.bidderEmail == '' || this.selectedPaymentType == '' || this.selectedServiceType == '' || this.selected == []) {
        return this.errorMessage = "Please fill in all fields appropraitely"
      }
      let newArr = this.selected.toString()
      await biddersService.editBidders(this.bidderNumber, this.bidderTINNumber, this.bidderName, this.dateModified, this.bidderStatus, this.address1, this.bidderCity, this.bidderState, this.contactPerson, this.bidderPhoneNumber, this.bidderEmail, this.selectedPaymentType, this.selectedServiceType, newArr, this.bidderAlternativeEmail1, this.bidderAlternativeEmail2, this.bidderAlternativeEmail3)
      this.showBidderForm = false;
      toast.success("Edit Successfully");
      setTimeout(async () => {
        this.bidderList = await biddersService.getBidders()
      }, 2000);
    },

    async getServiceLines() {
      this.selectedServiceLine = await administrationsService.getServiceLine(this.selectedServiceType)
      this.selected = []
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
.iconsize {
  margin-top: 3px
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

.btn {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.btns {
  box-sizing: border-box;
  display: flex;
  width: 17.5vw;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: #FFFFFF;
  border: 1px solid #227CBF;
  border-radius: 50px;
  font-family: Roboto;
  font-weight: 400;
  font-size: 1.2vw;
  color: #227CBF;
}

.btns:hover {
  background-color: #47B65C;
  color: #FFFFFF;
  border: none;
}

.purchdetails {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 30px;
  gap: 20px;
  width: 100%;
  background: #FFFFFF;
  border-radius: 10px;
}

.activityBoxPurch {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  width: 100%;
  flex-direction: row;
  padding: 0px;
  gap: 20px;
  height: 40px;
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

.activityBoxPurch input {
  align-items: center;
  border: 1px #000000 solid;
  padding: 10px 20px;
  gap: 21px;
  width: 25vw;
  height: 40px;
  left: 0px;
  top: 0px;
}

.filerdetails input {
  align-items: center;
  padding: 5px 10px;
  gap: 21px;
  margin: 0px 20px 0px 20px;
  width: 200px;
  border-radius: 6px;
  border: 0.5px solid black;
  height: 40px;
  background: #FAFAFB;

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

.filerdetails {
  width: 100%;
  padding: 0px 20px 0px 20px;
}

.criteria {
  margin-top: 20px;
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
  width: 14.5vw;
  height: 40px;
  background: linear-gradient(90deg, #227CBF 0%, #47B65C 100%);
  border-radius: 50px;
}

.rfqbtn:hover {
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
  transition: 0.7s;
}

.filter {
  cursor: pointer;
}

.categoryLineSwitch {
  display: grid;
  grid-template-columns: 2fr 2.5fr 2fr;
  width: 100%;
}

.Rfq {
  padding: 20px 15px 0px 15px;
  gap: 20px;
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
  margin-top: 550px;
  padding: 30px;
  position: relative;
  width: 690px;
  border-radius: 5px;
  border: 1px solid #E4E4E7;
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

.userdetailsheader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
  gap: 10px;
  width: 650px;
  height: 16px;
  font-size: 20px;
}

.userdetailstext {
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #000000;
}

.Line {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0px 20px;
  width: 100%;
  margin-top: 15px;
}

.Line9 {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  align-items: left;
  justify-content: space-between;
  gap: 10px;
  padding: 0px 0px 0px 20px;
  width: 100%;
  margin-top: 10px;
}

.rfqbtn {
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

.rfqtableHeader {
  padding: 12px 20px;
  background: #FFFFFF;
  align-items: center;
  display: grid;
  grid-template-columns: 1.5fr 2.5fr 2.5fr 2fr 2.5fr;
  grid-gap: 20px;
}

.tableHeader {
  flex-direction: row;
  display: flex;
}

.tableHeadertext {
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  margin-right: 5px;
  font-size: 15px;
  line-height: 19px;
  color: #000000;
  text-align: left;
}

.tablerowtext1 {
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  width: 100%;
  font-size: 16px;
  line-height: 19px;
  margin-left: 20px;
  color: #000000;
  text-align: left;
}

.LineHeader {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0px 10px 20px;
  gap: 10px;
  width: 650px;
  height: 44px;
  background: #F7F7F7;
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-color: #E8E8E8;
  border-radius: 5px 5px 0px 0px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #000000;
}

.tablerowtext {
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  width: 100%;
  font-size: 15px;
  line-height: 19px;
  color: #000000;
  text-align: left;
}

table {
  font-size: 15px;
  line-height: 19px;
  color: #000000;
  font-weight: 300;
  font-family: 'Roboto';
}

table td {
  word-wrap: break-word;
}

.formDetails,
.formDetails7 {
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

.formDetails7 {
  overflow-y: scroll;
  height: 120px;
  width: 250px;
}

.formDetails2 {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 19px;
  color: #000000;
  gap: 30px;
  width: 280px;
}

.formDetails3 {
  justify-content: center;
  gap: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.formDetails3 p {
  font-family: 'Roboto';
  font-weight: 400;
  font-size: 15px;
  line-height: 19px;
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

.formBox {
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px 0px 15px;
  gap: 10px;
  width: 652px;
  background: #FFFFFF;
  border: 1px solid #E4E4E7;
  border-radius: 5px;
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

.notetext h2 {
  font-size: 18px;
  font-family: 'Roboto';
  margin-bottom: 0px;
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

.ratingtext {
  font-family: Roboto;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  display: grid;
  margin-left: 20px;
  align-items: center;
  color: #000000;
  width: 100%;
  grid-template-columns: 2fr 2.5fr;
  grid-gap: 60px;
  margin-top: 20px
}

.ratingdetails {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: 250.97px;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #000000;
}

.ratingdetails b {}

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

.modals img {
  margin-top: 5px;
}

.options {
  padding: 5px;
}

.sidebar-header {
  margin-left: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 10px 10px 0px 10px;
  align-items: baseline;
  color: rgb(0, 0, 0);
  cursor: context-menu;
}

.sidebar-header .close {
  cursor: pointer;
  border-radius: 20px 0px 0px 20px;
  padding: 3px 0px 10px 100px;
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