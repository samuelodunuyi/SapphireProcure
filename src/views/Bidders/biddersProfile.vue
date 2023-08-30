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

    <div v-if="showRatingModal" class="overlay1" @click="showRatingModal = false">
        <div class="modals" @click.stop>
            <h3>My Performance Rating</h3>
            <div class="text-center">
            </div>
            <div class="ratingtext">
                <h3>Total</h3>
                <div class="ratingdetails">
                    <v-rating v-model="ratingTotalDisplay" bg-color="orange-lighten-1" color="#47B65C" density="compact"
                        hover half-increments readonly></v-rating>
                    <span v-if="ratingTotal != 0" style="font-size: 16px; color: black;">
                        <h4>{{ ratingTotal }}%</h4>
                    </span>
                </div>
            </div>
            <div class="buttonsave">
                <button class="closeRating" @click="showRatingModal = false">Close</button>
            </div>
        </div>
    </div>

    <PageHeader @selectOption="onOptionSelected"></PageHeader>

    <body>
        <WelcomeHead></WelcomeHead>
        <div class="purchdetails">
            <h3>Your Profile</h3>
            <div class="Rfq">
                <div class="table-responsive-sm">
                    <div class="listHeader">
                        <h3>Bidder Number:</h3>
                        <p>{{ bidderId }}</p>
                    </div>
                    <div class="listHeader">
                        <h3>Bidder Name:</h3>
                        <p>{{ bidderName }}</p>
                    </div>
                    <div class="listHeader">
                        <h3>Address:</h3>
                        <p>{{ address }}</p>
                    </div>
                </div>
                <div class="table-responsive-sm">
                    <div class="listHeader">
                        <h3>City:</h3>
                        <p>{{ city }}</p>
                    </div>
                    <div class="listHeader">
                        <h3>Contact Name:</h3>
                        <p>{{ contactName }}</p>
                    </div>
                    <div class="listHeader">
                        <h3>Primary Contact Number:</h3>
                        <p>{{ primaryContactNumber }}</p>
                    </div>
                </div>
                <div class="table-responsive-sm">
                    <div class="listHeader">
                        <h3>Primary Contact Address:</h3>
                        <p>{{ primaryEmailAddress }}</p>
                    </div>
                    <div class="listHeader">
                        <h3>Tin Number:</h3>
                        <p>{{ tinNumber }}</p>
                    </div>
                    <div class="listHeader">
                        <h3>Ratings:</h3>
                        <p>{{ ratingTotal }}%
                            <span style="text-decoration: underline; color: blue; cursor: pointer;"
                                @click="showRatingModal = true">
                                Click for Details</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </body>
</template>
  
  
<script>
import WelcomeHead from '../../components/PageMenuHeader.vue';
import PageHeader from '../../components/TopHeader.vue'
import biddersService from "../../services/biddersService";
import ratingServices from "../../services/ratingServices";
import notificationServices from "../../services/notificationServices";
import { useCounterStore } from "../../store/piniaStore";
import pinia from "../../store/store";
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
        WelcomeHead, PageHeader
    },
    data() {
        return {
            showRatingModal: false,
            bidderUser: [],
            notifications: [],
            bidderId: "",
            bidderName: "",
            address: "",
            city: "",
            contactName: "",
            primaryContactNumber: "",
            primaryEmailAddress: "",
            tinNumber: "",
            ratingsTotal: "",
            ratingReliability: 3,
            ratingProffessionality: 3,
            ratingTime: 5,
            ratingQuality: 2,
            ratingResponsive: 4,
            ratingTotal: 0,
            ratingTotalDisplay: 0
        };
    },
    async created() {
        let bidderDetails = await biddersService.getBidders();
        this.bidderUser = bidderDetails.filter(o => o.id === stores.bidderId)[0]
        this.bidderId = this.bidderUser.id
        this.bidderName = this.bidderUser.bidderName
        this.address = this.bidderUser.address
        this.city = this.bidderUser.city
        this.contactName = this.bidderUser.contactName
        this.primaryContactNumber = this.bidderUser.primaryContactNumber
        this.primaryEmailAddress = this.bidderUser.primaryEmailAddress
        this.tinNumber = this.bidderUser.tinNumber
        let notifs = await notificationServices.getNotifications(stores.signedInUserEmail)
        this.notifications = notifs.reverse()
        this.ratings = this.bidderUser.ratings
        var ratingsbyBidderId = await ratingServices.getBidderPerformancesByBidderId(this.bidderId)
        if (ratingsbyBidderId[0]) {
            this.ratingTotal = ratingsbyBidderId[0].avgScores.toFixed(2)
            this.ratingTotalDisplay = (( ratingsbyBidderId[0].avgScores) / 20).toFixed(2)
        }
        else {
            this.totalContractsRated = 0
            this.bidderTotalCalc = 0
            this.bidderTotalCalc2 = 0
        }
    },

    methods: {
        navigatetoNotification(id, type) {
            if (type === 'Bid Invitation' || type === 'Bid Winner') {
                this.$router.push(`/rfqresponse/${id}`)
            }
            else if (type == 'Contract Signature' || type === 'Executed Contract Upload') {
                this.$router.push(`/purchcontractdetails/${id}`)
            }
        },
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
    background: #FAFAFB;
}

.modals {
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    position: relative;
    width: 753.49px;
    border-radius: 10px;
}

.listHeader h3 {
    font-family: 'Roboto';
    font-size: 16px;
    font-weight: bold;
    width: 100%;
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

.closeRating:hover {
    background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
    transition: 0.7s;
}


.closeRating {
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

.purchdetails {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 0px 0px 30px;
    width: 100%;
    border-radius: 10px;
    background: #ffffff;

}

.Rfq {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 20px 20px 0px 0px;
    width: 100%;
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