<script setup>
import { ref } from "vue";
const showFilter = ref(false)
const showResults = ref(false)
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
}

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
  <div v-if="showResults" class="overlay" @click="showResults = false">
    <div class="modal38 animated fadeInRight" @click.stop>
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

  <div v-if="showRatingModal" class="overlay" @click="showRatingModal = false">
    <div class="modals" @click.stop>
      <v-app>
      <h3>Bidder Performance Rating</h3>
      <div class="text-center">
      </div>
      <div style="display: flex; flex-direction: row; font-weight: 400; margin-bottom: -20px;">
        <p>{{BidContactNo}} -</p>
        <p>{{ BidderName }}</p>
      </div>

      <div class="ratingtext" v-if="bidderPerformanceRatingByContract.length > 0">
        <li>Timeliness of response</li>
        <div class="ratingdetails">
          <v-rating v-model="ratingTime" bg-color="orange-lighten-1" color="#47B65C" density="compact" hover
            half-increments></v-rating>
        </div>
      </div>

      <div class="ratingtext" v-else>
        <li>Timeliness of response</li>
        <div class="ratingdetails">
          <v-slider v-model="ratingTime" :min="0" :max="100" :step="1.0" thumb-label></v-slider>
        </div>
      </div>

      <div class="ratingtext" v-if="bidderPerformanceRatingByContract.length > 0">
        <li>Quality of Report</li>
        <div class="ratingdetails">
          <v-rating v-model="ratingQuality" bg-color="orange-lighten-1" color="#47B65C" density="compact" hover
            half-increments></v-rating>
        </div>
      </div>

      <div class="ratingtext" v-else>
        <li>Quality of Report</li>
        <div class="ratingdetails">
          <v-slider v-model="ratingQuality" :min="0" :max="100" :step="1.0" thumb-label></v-slider>
        </div>
      </div>

      <div class="ratingtext" v-if="bidderPerformanceRatingByContract.length > 0">
        <li>Responsiveness of Consultant</li>
        <div class="ratingdetails">
          <v-rating v-model="ratingResponsive" bg-color="orange-lighten-1" color="#47B65C" density="compact" hover
            half-increments></v-rating>
        </div>
      </div>

      <div class="ratingtext" v-else>
        <li>Responsiveness of Consultant</li>
        <div class="ratingdetails">
          <v-slider v-model="ratingResponsive" :min="0" :max="100" :step="1.0" thumb-label></v-slider>
        </div>
      </div>

      <div class="ratingtext" v-if="bidderPerformanceRatingByContract.length > 0">
        <li>Reliability of the report</li>
        <div class="ratingdetails">
          <v-rating v-model="ratingReliability" bg-color="orange-lighten-1" color="#47B65C" density="compact" hover
            half-increments></v-rating>
        </div>
      </div>

      <div class="ratingtext" v-else>
        <li>Reliability of the report</li>
        <div class="ratingdetails">
          <v-slider v-model="ratingReliability" :min="0" :max="100" :step="1.0" thumb-label></v-slider>
        </div>
      </div>

      <div class="ratingtext" v-if="bidderPerformanceRatingByContract.length > 0">
        <li>Professionality and attitude to work</li>
        <div class="ratingdetails">
          <v-rating v-model="ratingProffessionality" bg-color="orange-lighten-1" color="#47B65C" density="compact" hover
            half-increments></v-rating>
        </div>
      </div>
      <div class="ratingtext" v-else>
        <li>Professionality and attitude to work</li>
        <div class="ratingdetails">
          <v-slider v-model="ratingProffessionality" :min="0" :max="100" :step="1.0" thumb-label></v-slider>
        </div>
      </div>'
      <div class="ratingtext" v-if="ratingTotalDisplay != 0">
        <h3>Total</h3>
        <div class="ratingdetails">
          <v-rating v-model="ratingTotal" bg-color="orange-lighten-1" color="#47B65C" density="compact" hover
            half-increments readonly></v-rating>
          <span style="font-size: 16px; color: black;">
            <h4>{{ ratingTotalDisplay.toFixed(2) }}%</h4>
          </span>
        </div>
      </div>
      <div class="buttonsave">
        <button class="save" @click="showRatingModal = false">Close</button>
        <button class="save" @click="createPerformanceRatings()" :disabled="disableSave">Save</button>
      </div>
    </v-app>
    </div>
  </div>

  <PageHeader @selectOption="onOptionSelected"></PageHeader>

  <body>
    <WelcomeHead></WelcomeHead>
    <div class="purchdetails">
      <div class="activityStatusPurch">
        <h2 class="activityHeaderPurch">
          Rate Bidders
        </h2>
        <div class="activityBoxPurch">
          <input type="text" v-model="searchValue" placeholder="Search Contracts..." />
          <img src="../../assets/images/Frame.svg" class="filter" @click="toggleFilter">
        </div>
      </div>
      <div class="filerdetails" v-if="showFilter">
        <label for="">Filter Criteria</label>
        <select v-model="selectedType">
          <option value="" disabled selected hidden>Criteria</option>
          <option value="contractNo">Contract No</option>
          <option value="date">Date</option>
        </select>
        <label for="" v-if="checkSelectionDate()">Date Options</label>
        <select v-model="selectedDateType" v-if="checkSelectionDate()">
          <option value="" disabled selected hidden>Date Option</option>
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisweek">This week</option>
          <option value="thismonth">This Month</option>
          <option value="choosedate">Choose dates</option>
          <option value="cleardate">Clear date</option>
        </select>
        <div v-if="checkSelectionDateOption()" class="criteria">
          <label for="">Start Date: </label>
          <input type="date" v-model="startDate">
          <label for="">End Date: </label>
          <input type="date" v-model="endDate">
        </div>
        <div v-if="checkSelectionContractNo()" class="criteria">
          <label for="">From: </label>
          <input type="text" v-model="contractSearchValueTo">
          <label for="">To: </label>
          <input type="text" v-model="contractSearchValueFro">
          <p v-if='completeValue'>Please fill in both fields to filter</p>
        </div>
      </div>



      <div class="Rfq">
        <div class="table-responsive-sm">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col"><b>Contract No </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Bidder </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Description </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
                <th scope="col"><b>Contract Date </b>
                  <img src="../../assets/images/sorticon.svg" class="sorticon" v-on:click="ascending = !ascending" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="contract in filteredContracts" :key="contract.id" @click="showRatings(contract.id, contract.bidderName)"
                :style="{ cursor: 'pointer' }">
                <th scope="row">{{ contract.id }}</th>
                <td>{{ contract.bidderName }}</td>
                <td>{{ contract.projectShortDescription }}</td>
                <td>{{ contract.creationDateTime.slice(0, 10) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="tablerowtext1"
          v-if="searchValue && !filteredContracts.length || contractSearchValueTo && contractSearchValueFro && !filteredContracts.length">
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
import PageHeader from '../../components/TopHeader.vue'
import purchaseContractService from '../../services/purchaseContractService';
import { useCounterStore } from "../../store/piniaStore"
import notificationServices from "../../services/notificationServices";
import ratingServices from "../../services/ratingServices";
import pinia from "../../store/store";
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
      ascending: true,
      completeValue: false,
      pageNumber: 1,  // default to page 0
      sortBy: 'alphabetically',
      searchValue: '',
      selectedType: '',
      selectedDateType: '',
      currentDate: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
      startDate: this.localizeDate(this.startDate),
      endDate: this.localizeDate(this.endDate),
      contractSearchValueTo: "",
      contractSearchValueFro: "",
      purchcontracts: [],
      BidContactNo: '',
      BidderName: '',
      BidderId: '',
      showRatingModal: false,
      RFQRequestedUserId: '',
      criteriaId: '',
      score: 0,
      ratingTime: 0,
      ratingQuality: 0,
      ratingResponsive: 0,
      ratingReliability: 0,
      ratingProffessionality: 0,
      ratingTotal: 0,
      ratingTotalDisplay: 0,
      bidderPerformanceRatingByContract: [],
      disableSave: false
    };
  },

  async created() {
    var purchContractAll  = await purchaseContractService.getContracts()
    this.purchcontracts = purchContractAll.filter(o=>o.createdBy==stores.signedInUserEmail)
    let notifs = await notificationServices.getNotifications(stores.signedInUserEmail)
    this.notifications = notifs.reverse()
  },

  computed: {
    pageCount() {
      let l = this.purchcontracts.length,
        s = this.size;
      return Math.ceil(l / s);
    },

    indexStart() {
      return (this.pageNumber - 1) * this.size;
    },
    indexEnd() {
      return this.indexStart + this.size;
    },

    filteredContracts() {
      const start = this.pageNumber * this.size,
        end = start + this.size;
      let contracts = this.purchcontracts

      // Process search input
      if (this.searchValue != '' && this.searchValue) {
        contracts = contracts.filter((item) => {
          return item.id
            .toLowerCase()
            .includes(this.searchValue.toLowerCase()) ||
            item.bidderName
              .toLowerCase()
              .includes(this.searchValue.toLowerCase()) || item.projectShortDescription.toLowerCase().includes(this.searchValue.toLowerCase())
        })
      }

      //filter    
      if (this.startDate && this.endDate) {
        contracts = this.purchcontracts.filter((item) => {
          return this.startDate <= item.creationDateTime.slice(0, -12) && item.creationDateTime.slice(0, -12) <= this.endDate;
        })
      }

      if (this.contractSearchValueTo && this.contractSearchValueFro) {
        contracts = this.purchcontracts.filter((item) => {
          return this.contractSearchValueTo.toUpperCase() <= item.id && item.id <= this.contractSearchValueFro.toUpperCase();
        })
      }
      else if (!this.contractSearchValueTo && this.contractSearchValueFro || this.contractSearchValueTo && !this.contractSearchValueFro) {
        this.completeValue = true;
        return contracts = this.purchcontracts
      }

      if (this.startDate && !this.endDate) {
        contracts = this.purchcontracts.filter((item) => {
          return this.startDate <= item.contractdatetime.slice(0, -12)
        })
      }
      if (!this.startDate && this.endDate) {
        contracts = this.purchcontracts.filter((item) => {
          return item.contractdatetime.slice(0, -12) <= this.endDate;
        })
      }

      // Sort by alphabetical order
      contracts = contracts.sort((a, b) => {
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
        contracts.slice(this.indexStart, this.indexEnd)
      }

      return contracts.slice(this.indexStart, this.indexEnd)
    },
  },

  methods: {
    nextPage() {
      this.pageNumber++;
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

    async showRatings(idx, name) {
      this.bidderPerformanceRatingByContract = []
      this.showRatingModal = true
      const contractSelected = this.purchcontracts.filter(o => o.id === idx)
      this.BidContactNo = contractSelected[0].id,
      this.BidderId = contractSelected[0].bidderId,
      this.BidderName = name
      this.RFQRequestedUserId = contractSelected[0].createdBy,
      this.bidderPerformanceRatingByContract = await ratingServices.getBidderPerformancesByContractId(this.BidContactNo, this.RFQRequestedUserId)
      this.ratingTime = 0,
      this.ratingQuality = 0,
      this.ratingResponsive = 0,
      this.ratingReliability = 0,
      this.ratingProffessionality = 0
      this.ratingTotal = 0
      this.ratingTotalDisplay = 0
      this.disableSave = false
      if (this.bidderPerformanceRatingByContract.length > 0) {
        this.disableSave = true
        var ReportTimeliness = this.bidderPerformanceRatingByContract.filter(o => o.criteriaId == 5)
        var ReportQuality = this.bidderPerformanceRatingByContract.filter(o => o.criteriaId == 6)
        var ReportResponsiveness = this.bidderPerformanceRatingByContract.filter(o => o.criteriaId == 7)
        var ReportReliability = this.bidderPerformanceRatingByContract.filter(o => o.criteriaId == 8)
        var ReportProfessionality = this.bidderPerformanceRatingByContract.filter(o => o.criteriaId == 9)

        this.ratingTime = (ReportTimeliness[0].totalScores) / 20
        this.ratingQuality = (ReportQuality[0].totalScores) / 20
        this.ratingResponsive = (ReportResponsiveness[0].totalScores) / 20
        this.ratingReliability = (ReportReliability[0].totalScores) / 20
        this.ratingProffessionality = (ReportProfessionality[0].totalScores) / 20
        this.ratingTotalDisplay = (this.ratingTime*20 + this.ratingQuality*20 + this.ratingResponsive*20 + this.ratingReliability*20 + this.ratingProffessionality*20)/5
        this.ratingTotal = (this.ratingTime + this.ratingQuality + this.ratingResponsive + this.ratingReliability + this.ratingProffessionality)/5
      }
    },

    createPerformanceRatings() {
      ratingServices.createBidderPerformances(this.BidContactNo, this.BidderId, this.RFQRequestedUserId, 5, (this.ratingTime)/20)
      ratingServices.createBidderPerformances(this.BidContactNo, this.BidderId, this.RFQRequestedUserId, 6, (this.ratingQuality)/20)
      ratingServices.createBidderPerformances(this.BidContactNo, this.BidderId, this.RFQRequestedUserId, 7, (this.ratingResponsive)/20)
      ratingServices.createBidderPerformances(this.BidContactNo, this.BidderId, this.RFQRequestedUserId, 8, (this.ratingReliability)/20)
      ratingServices.createBidderPerformances(this.BidContactNo, this.BidderId, this.RFQRequestedUserId, 9, (this.ratingProffessionality)/20)
      this.showRatingModal = false
    },
    checkSelectionContractNo() {
      if (this.selectedType == "contractNo") {
        return true
      }
      return false

    },

    checkSelectionDateOption() {
      if (this.selectedDateType == "choosedate" && this.selectedType == "date") {
        return true
      }
      else if (this.selectedDateType == "today") {
        var date = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        this.startDate = date;
        this.endDate = date;
      }
      else if (this.selectedDateType == "yesterday") {
        var date = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        var yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1)
        var yesterdayDate = yesterday.toJSON().slice(0, 10).replace(/-/g, '-');
        this.startDate = yesterdayDate;
        this.endDate = yesterdayDate;
      }

      else if (this.selectedDateType == "thisweek") {
        var date = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        var thisweek = new Date(date);
        thisweek.setDate(thisweek.getDate() - 7)
        var thisWeekDate = thisweek.toJSON().slice(0, 10).replace(/-/g, '-');
        this.startDate = thisWeekDate;
        this.endDate = date;
      }

      else if (this.selectedDateType == "thismonth") {
        var date = new Date().toJSON().slice(0, 10).replace(/-/g, '-');
        var thismonth = new Date(date);
        thismonth.setDate(thismonth.getDate() - 30)
        var thismonthDate = thismonth.toJSON().slice(0, 10).replace(/-/g, '-');
        this.startDate = thismonthDate;
        this.endDate = date;
      }

      else if (this.selectedDateType == "cleardate") {
        this.startDate = "";
        this.endDate = "";
      }
      return false

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
.modal38 {
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

.modals {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 500px;
  padding: 30px;
  position: relative;
  width: 750.49px;
  border-radius: 10px;
}

.paginationButton {
  background-color: #FFFFFF;
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
  padding-top: 20px;
  gap: 20px;
  width: 100%;
  background: #FFFFFF;
  border-radius: 10px;
}

.activityBoxPurch {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 20px;
  width: 620px;
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


.activityHeaderPurch {
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: #47B65C;
  width: 100%;
}

.activityBoxPurch input {
  align-items: center;
  border: 1px #000000 solid;
  padding: 10px 20px;
  gap: 21px;
  width: 350px;
  height: 40px;
  left: 0px;
  top: 0px;
}

input {
  border: 1px solid black
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
  align-items: center;
  padding: 10px 20px;
  gap: 21px;
  border: 1px solid black;
  margin: 0px 50px 0px 20px;
  width: 150px;
}


.filerdetails {
  width: 100%;
  padding: 0px 20px 0px 20px;
}

.criteria {
  margin-top: 20px;
}

.ratingtext {
  font-family: Roboto;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  display: grid;
  margin-top: 20px;
  align-items: center;
  color: #000000;
  height: 31.92px;
  width: 100%;
  grid-template-columns: 2.5fr 2fr;
  grid-gap: 60px;
}

.ratingdetails {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 10px;
  width: 250.97px;
  height: 21px;
  font-family: 'Open Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: #9FA1A2;
}

.modals h3 {
  font-weight: bold;
}

.modals .save {
  margin-top: 7px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  width: 200px;
  height: 40px;
  background: linear-gradient(90deg, #227CBF 0%, #47B65C 100%);
  border-radius: 50px;
  font-family: Roboto;
  font-weight: 400;
  font-size: 16px;
  color: #FFFFFF;
}

.buttonsave {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 5px auto;
  padding: 0px;
  gap: 10px;
  margin-top: 20px;
  width: 493.49px;
  height: 40px;
}

.save:disabled,
.save:disabled:hover {
  background: linear-gradient(90deg, #919191 0%, #838383 100%);
}

.save:hover {
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
  transition: 0.7s;
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

.rfqbtn:hover {
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
  transition: 0.7s;
}

.filter {
  cursor: pointer;
}

.Rfq {
  align-items: flex-start;
  padding-top: 20px;
  width: 100%;
  padding: 0px 15px
}

.rfqtableHeader {
  padding: 20px 20px;
  width: 100%;
  background: #FFFFFF;
  align-items: center;
  display: grid;
  grid-template-columns: 0.6fr 1fr 1.5fr 2fr;
  grid-gap: 100px;
  margin-bottom: -10px;
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
  flex-direction: column;
  overflow: auto;
  align-items: center;
  justify-content: center;
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

.notetext h2 {
  font-size: 18px;
  font-family: 'Roboto';
  margin-bottom: 0px;
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

.options {
  padding: 5px;
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