<script setup>
import { ref } from "vue";
const showFilter = ref(false)
const showResults = ref(false)
const onOptionSelected = (isCorrect) => {
    if (isCorrect) {
        const ps = showResults.value = !showResults.value
        return ps
    }
}
const toggleFilter = () => {
    showFilter.value = !showFilter.value;
}
</script>

<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Aladin">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <div v-if="showResults" class="overlay" @click="showResults = false">
        <div class="modal98 animated fadeInRight" @click.stop>
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
        <RFQHeader></RFQHeader>
        <div class="purchdetails">
            <div class="activityStatusPurch">
                <h2 class="activityHeaderPurch">
                    My Requisitions
                </h2>
                <div class="activityBoxPurch">
                    <input type="text" v-model="searchValue" placeholder="Search..." />
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
                    <option value="cleardate">Clear Date</option>
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
                                <th scope="col"><b>RFQ No </b>
                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                        v-on:click="ascending = !ascending" />
                                </th>
                                <th scope="col"><b>Transaction/Request Name </b>
                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                        v-on:click="ascending = !ascending" />
                                </th>
                                <th scope="col"><b>Created Date </b>
                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                        v-on:click="ascending = !ascending" />
                                </th>
                                <th scope="col"><b>Status </b>
                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                        v-on:click="ascending = !ascending" />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="value in filteredRFQs" @click="navigateToRFQ(value.id)"
                                :style="{ cursor: 'pointer' }">
                                <th scope="row">{{ value.id }}</th>
                                <td>{{ value.description.slice(0, 60) }}</td>
                                <td>{{ value.createdDate.slice(0, 10) }}</td>
                                <td v-if="value.status == 'Pending' || 'Open'">
                                    <div class="div244">
                                        <img alt="" src="../../assets/images/ellipse-84.svg" />
                                        <p class="pending21"> {{ value.status }}</p>
                                    </div>
                                </td>

                                <td v-else="value.status=='Completed'">
                                    <div class="div248">
                                        <img alt="" src="../../assets/images/ellipse-85.svg" />
                                        <p class="completed22"> {{ value.status }}</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="paginationButtons">
                    <button @click="prevPage" :disabled="pageNumber == 1" class="paginationButton">
                        &lt
                    </button>
                    <button  class="paginationButtonNumber" :disabled="pageNumber >= pageCount">
                        {{ pageNumber }}
                    </button>
                    <button @click="nextPage()" class="paginationButton" :disabled="pageNumber >= pageCount">
                        >
                    </button>
                </div>
                <p class="tablerowtext1"
                    v-if="searchValue && !filteredRFQs.length || contractSearchValueTo && contractSearchValueFro && !filteredRFQs.length">
                    No results found!</p>
            </div>
        </div>

    </body>
</template>


<script>
import { ref } from "vue";
import WelcomeHead from '../../components/PageMenuHeader.vue';
import PageHeader from '../../components/TopHeader.vue';
import RFQHeader from '../../components/requestforQuotesHeader.vue';
import requisitionsServices from "../../services/requisitionsServices";
import { useCounterStore } from "../../store/piniaStore"
import notificationServices from "../../services/notificationServices";

import pinia from "../../store/store";
const stores = useCounterStore(pinia);

export default {
    components: {
        WelcomeHead, PageHeader, RFQHeader
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
            maxDateValue: null,
            rfqvalues: [],
            myRfqValues: [],
            notifications: []

        };
    },
    async created() {
        this.rfqvalues = await requisitionsServices.getRequisitions();
        this.myRfqValues = this.rfqvalues.filter(o => o.requestedBy === stores.signedInUserEmail)
        this.notifications = await notificationServices.getNotifications(stores.signedInUserEmail)
        let notifs = await notificationServices.getNotifications(stores.signedInUserEmail)
        this.notifications = notifs.reverse()
    },
    computed: {
        pageCount() {
            let l = this.myRfqValues.length,
                s = this.size;
            return Math.ceil(l / s);
        },

        indexStart() {
            return (this.pageNumber - 1) * this.size;
        },
        indexEnd() {
            return this.indexStart + this.size;
        },


        filteredRFQs() {
            const start = this.pageNumber * this.size,
                end = start + this.size;
            let contracts = this.myRfqValues

            // Process search input
            if (this.searchValue != '' && this.searchValue) {
                contracts = contracts.filter((item) => {
                    return item.id
                        .toLowerCase()
                        .includes(this.searchValue.toLowerCase()) ||
                        item.description.toLowerCase().includes(this.searchValue.toLowerCase())
                })
            }

            //filter 
            if (this.startDate && this.endDate) {
                contracts = this.myRfqValues.filter((item) => {
                    return this.startDate <= item.createdDate.slice(0, -9) && item.createdDate.slice(0, -9) <= this.endDate;
                })
            }

            if (this.contractSearchValueTo && this.contractSearchValueFro) {
                contracts = this.myRfqValues.filter((item) => {
                    return this.contractSearchValueTo.toUpperCase() <= item.id && item.id <= this.contractSearchValueFro.toUpperCase();
                })
            }
            else if (!this.contractSearchValueTo && this.contractSearchValueFro || this.contractSearchValueTo && !this.contractSearchValueFro) {
                this.completeValue = true;
                return contracts = this.myRfqValues
            }

            if (this.startDate && !this.endDate) {
                contracts = this.myRfqValues.filter((item) => {
                    return this.startDate <= item.createdDate.slice(0, -9)
                })
            }
            if (!this.startDate && this.endDate) {
                contracts = this.myRfqValues.filter((item) => {
                    return item.createdDate.slice(0, -9) <= this.endDate;
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
                contracts.reverse().slice(this.indexStart, this.indexEnd)
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
            // Date picker uses ISO format (yyyy-mm-dd), which is UTC. The data
            // contains locale specific date strings (mm/dd/yyyy), which `Date`
            // parses with local time-zone offset instead of UTC. Normalize the
            // ISO date so we're comparing local times.
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
        navigateToRFQ(id) {
            stores.rfqNo = id
            this.$router.push(`/rfqedit/${id}`)
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
.paginationButton:disabled {
    background-color: rgb(255, 255, 255);
    padding: 5px 10px 5px 10px;
    border: 1px solid #b3b3b3;
    color: rgb(192, 192, 192)
}

.paginationButtonNumber {
    background-color: #227CBF;
    padding: 5px 10px 5px 10px;
    color: white;
}

table {
    padding-left: 25px;
    padding-right: 25px
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
    padding: 0px 5px;
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
    width: 100%;
    color: #47B65C;
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

.rfqtableHeader {
    padding: 11px 20px;
    width: 100%;
    background: #FFFFFF;
    align-items: center;
    display: grid;
    grid-template-columns: 0.8fr 2.5fr 0.8fr 0.5fr;
    grid-gap: 20px;
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
    border: 1px #000000 solid;
    align-items: center;
    padding: 10px 20px;
    gap: 21px;
    margin: 0px 50px 0px 20px;
    width: 150px;
}

.tableHeader {
    display: flex;
    flex-direction: row;
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
    width: 100%;
    padding: 5px 20px 0px 0px;

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

.pending21 {
    width: 66.34px;
}

.div244 {
    width: 100px;
    background-color: #FEF9C3;
    color: #713F12;
    width: 100px;
    gap: 8px;
    display: flex;
    flex-direction: row;
    border-radius: 40px;
    padding: 8px 8px 5px 11px;
    line-height: 10.4px;
    height: 25px !important;
    font-size: 12px;
}

.completed22 {
    width: 66.34px;
}

.div248 {
    width: 100px;
    background-color: #DCFCE7;
    color: #14532D;
    width: 100px;
    gap: 8px;
    display: flex;
    flex-direction: row;
    border-radius: 40px;
    padding: 8px 8px 5px 11px;
    line-height: 10.4px;
    height: 25px !important;
    font-size: 12px;
}

.rowStatus {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    height: 25px;
}

.rowStatusText {
    font-family: Roboto;
    font-style: normal;
    font-weight: 400;
    text-align: left;
    color: #713F12;
    padding: 5px 10px;
    border-radius: 40px;
    font-size: 12px;
    line-height: 14px;
    width: 100px;
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

.modal98 {
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

.notetext h2 {
    font-size: 18px;
    font-family: 'Roboto';
    margin-bottom: 0px;
}

.iconsize {
    margin-top: 3px
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
    grid-template-columns: 1fr 1fr;
    margin: 10px 0px 0px 10px;
    align-items: baseline;
    color: rgb(0, 0, 0);
    cursor: context-menu;
}

.sidebar-header .close {
    cursor: pointer;
    border-radius: 20px 0px 0px 20px;
    padding: 3px 0px 10px 100px;
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