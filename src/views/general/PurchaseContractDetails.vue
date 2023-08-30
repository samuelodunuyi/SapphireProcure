<script setup>
import { ref } from "vue";
import WelcomeHead from '../../components/PageMenuHeader.vue';
import PageHeader from '../../components/TopHeader.vue';
var newComment = ref("")
var disabled = ref(false)
const showResults = ref(false)
const saveComment = () => {
  disabled.value = true
}

const onOptionSelected = (isCorrect) => {
  if (isCorrect) {
    const ps = showResults.value = !showResults.value
    return ps
  }
}

const removeComment = () => {
  newComment.value = ''
}
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Aladin">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
  <link href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Material+Icons" rel="stylesheet">

  <div v-if="showUploadModal" class="overlay" @click="showUploadModal = false">
    <div class="modal3" @click.stop>
      <div class="topUpload">
        <img src="../../assets/images/upload_cloud.svg" />
        <div class="bottomContent">
          <h2>Select a file or drag and drop here</h2>
          <p>.pdf, file size no more than 30MB</p>
        </div>
        <div class="upload">
          <v-btn :loading="loadingUpload" height="48" rounded="xl" size="small"
            onclick="document.getElementById('getFile').click()" variant="flat">Upload file</v-btn>
          <input type='file' id="getFile" style="display:none" @change="submitFile()" accept="application/pdf"
            ref="fileInput">
        </div>
        <div class="fileUploaded" v-if="contractUploadUrl != ''">
          <p style="text-decoration: underline; font-weight: bold;">{{ example.name }}</p>
          <p :style="{ cursor: 'pointer' }" @click="clearInput()">X</p>
        </div>
      </div>
      <b v-if="errorMessage">{{ errorMessage }}</b>
      <div class="bottomUpload">
        <div>
          <div class="topBotton3">
            <button class="topButton" @click="clearModal()">Cancel</button>
            <button class="topButton" @click="uploadContract()">Upload</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="showResults" class="overlay" @click="showResults = false">
    <div class="modal2 animated fadeInRight" @click.stop>
      <div class="sidebar-header">
        <h2>Notifications</h2>
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

  <v-row justify="center"
    style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
    <v-dialog v-model="dialog" width="724">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" v-bind="props">
          Open Dialog
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5-bold">Comments</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-textarea label="Comments" bg-color="#F5F5F5" no-resize="true" flat="true" rows="10"></v-textarea>

            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="white" variant="text" @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="white" variant="text" @click="dialog = false">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <PageHeader @selectOption="onOptionSelected"></PageHeader>

  <body>
    <WelcomeHead></WelcomeHead>
    <div class="Rfq" v-for="contract in filteredContracts" :key="contract.id">
      <div class="purchContractDetails">
        <div class="rfqtableHeader">
          <p class="tableHeadertext">Contract ID</p>
          <p class="tableHeadertext">RFQ NO</p>
          <p class="tableHeadertext">Winner Name</p>
          <p class="tableHeadertext" v-if="negotiatedBidValue > 10">Negotiated Bid Value</p>
          <p class="tableHeadertext" v-else>Bid Value</p>
          <p class="tableHeadertext">Service Sector</p>
          <p class="tableHeadertext">Request Sub-Type</p>
        </div>
        <div class="rfqtableHeader">
          <p class="tableRowtexts">{{ contract.id }}</p>
          <p class="tableRowtexts"> {{ contract.requisitionId }}</p>
          <p class="tableRowtexts">{{ contract.bidderName }}</p>
          <p class="tableRowtexts" v-if="negotiatedBidValue > 10">{{ negotiatedBidValue.toLocaleString() }}</p>
          <p class="tableRowtexts" v-else>{{ bidValue }}</p>
          <p class="tableRowtexts">{{ contract.subCategoryName }}</p>
          <p class="tableRowtexts">{{ contract.requisitionSubType }}</p>
        </div>
      </div>
      <div class="topBotton">
        <v-btn :loading="loading" height="48" rounded="xl" size="small" variant="flat"
          v-if="stores.signedInUserRole != 'Bidder' && contract.bidderSignedContractFileURL.length < 2"
          @click="notifyWinnerforSignature()">Notify Winner for
          Signature</v-btn>
        <v-btn :loading="loadingNotification" height="48" rounded="xl" size="small" v-on:click="showUploadModal = true"
          variant="flat" :disabled="contract.bidderSignedContractFileURL.length > 4"
          v-if="stores.signedInUserRole == 'Bidder' && contract.contractFileURL.length > 4">Upload Bidder Signed
          Contract</v-btn>
        <v-btn :loading="loading" height="48" rounded="xl" size="small" v-on:click="showUploadModal = true" variant="flat"
          :disabled="contract.fullyExecutedContractFileURL.length > 4"
          v-if="stores.signedInUserRole != 'Bidder' && contract.bidderSignedContractFileURL.length > 4">Upload Signed
          Contract</v-btn>
        <v-btn :loading="loading" height="48" rounded="xl" v-on:click.prevent="downloadContract" size="small"
          variant="flat" v-if="setPreview == 1 && stores.signedInUserRole == 'Bidder'">Download Contract</v-btn>
        <v-btn :loading="loading" height="48" rounded="xl" v-on:click.prevent="downloadContractBidderSigned" size="small"
          variant="flat" v-if="setPreview == 2">Download Signed Contract</v-btn>
        <v-btn :loading="loading" height="48" rounded="xl" v-on:click.prevent="downloadContractFullyExecuted" size="small"
          variant="flat" v-if="setPreview == 3">Download Signed Contract</v-btn>
        <b>{{ message }}</b>
      </div>

      <div class="mainPage">
        <div class="contractPreview">
          <iframe v-if="setPreview == 1" :src=contractFileURL height="100%" width="100%"
            title="Purchase Contract Preview"></iframe>
          <iframe v-if="setPreview == 2" :src=bidderSignedContractFileURL height="100%" width="100%"
            title="Purchase Contract Preview"></iframe>
          <iframe v-if="setPreview == 3" :src=fullyExecutedContractFileURL height="100%" width="100%"
            title="Purchase Contract Preview"></iframe>
        </div>
        <div class="w-100">
          <div style="width: 100%; max-height: 500px; overflow: auto;">
            <div style="display: flex; flex-direction: row; gap:50px; ">
              <h1>Comments</h1>
              <h1 @click="dialog = true" style="cursor: pointer;">+</h1>
            </div>
            <div class="comments">
              <h3> th
                <p>5/12/2023 . LUKMAN</p>
              </h3>

              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle bg-transparent" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-expanded="false" style="border: none;">
                  <img src="../../assets/images/dots1.png" alt="logo"
                    style="width: 30px; height: 30px; padding: 5px 0 0 0;">
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item" @click="dialog = true">View/Edit</a></li>
                  <li><a class="dropdown-item" @click="deleteComment()">Delete</a></li>
                </ul>
              </div>

            </div> 
           <div class="comments">
              <h3> Hi Bob. Your remark is noted
                <p>5/12/2023 . LUKMAN</p>
              </h3>
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle bg-transparent" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-expanded="false" style="border: none;">
                  <img src="../../assets/images/dots1.png" alt="logo"
                    style="width: 30px; height: 30px; padding-top: 5px;">
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item" href="#">View/Edit</a></li>
                  <li><a class="dropdown-item" href="#">Delete</a></li>
                </ul>
              </div>
            </div> <div class="comments">
              <h3> Comment 1
                <p>5/12/2023 . LUKMAN</p>
              </h3>
              <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle bg-transparent" type="button" id="dropdownMenuButton1"
                  data-bs-toggle="dropdown" aria-expanded="false" style="border: none;">
                  <img src="../../assets/images/dots1.png" alt="logo"
                    style="width: 30px; height: 30px; padding: 5px 0 0 0;">
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  <li><a class="dropdown-item" href="#">View/Edit</a></li>
                  <li><a class="dropdown-item" href="#">Delete</a></li>
                </ul>
              </div>
            </div>
            <v-divider :thickness="2"></v-divider>

          </div>
          <div class="uploads">
            <img src="../../assets/images/upload.svg" alt="">
            <strong style="color: black">Uploaded files</strong>
          </div>
          <div class="uploadedfiles">
            <p>Uploaded Contract File</p>
            <p style="cursor: pointer;" @click="setPreview = 1">Preview</p>
            <p>{{ sizeContractFile.toFixed(2) }}MB</p>
          </div>

          <div class="uploadedfiles" v-if="contract.bidderSignedContractFileURL.length > 4">
            <p>Bidder Signed Contract</p>
            <p style="cursor: pointer;" @click="setPreview = 2">Preview</p>
            <p>{{ sizebidderSignedContract.toFixed(2) }}MB</p>
          </div>

          <div class="uploadedfiles" v-if="contract.fullyExecutedContractFileURL.length > 4">
            <p>Fully Executed Contract</p>
            <p style="cursor: pointer;" @click="setPreview = 3">Preview</p>
            <p>{{ sizeExecutedContractFile.toFixed(2) }}MB</p>
          </div>

        </div>
        <div>
        </div>
      </div>
    </div>
  </body>
</template>


<script>
import purchaseContractService from "../../services/purchaseContractService";
import biddersService from "../../services/biddersService";
import notificationServices from "../../services/notificationServices";
import { useCounterStore } from "../../store/piniaStore"
import pinia from "../../store/store";
import uploadRequest from "../../components/uploadRequest";
import emailServices from '../../services/emailServices';
import { toast } from 'vue3-toastify';
import settingsService from "../../services/settingsService";

const stores = useCounterStore(pinia);

export default {
  name: 'ContactUs',
  data() {
    return {
      loading: false,
      loadingUpload: false,
      loadingNotification: false,
      message: '',
      bidderName: '',
      purchaseContractNo: '',
      setPreview: 1,
      toWhom: [],
      purchcontracts: [],
      contractFileURL: "",
      sizeContractFile: 0,
      bidderSignedContractFileURL: "",
      negotiatedBidValue: 0,
      bidValue: 0,
      sizebidderSignedContract: 0,
      fullyExecutedContractFileURL: "",
      sizeExecutedContractFile: 0,
      idSelectDownload: "",
      requisitionSubType: "",
      disableUploadSignedContractBtn: false,
      example: '',
      showUploadModal: false,
      dialog: false,
      contractId: "",
      contractUploadUrl: "",
      errorMessage: "",
      bidderId: "",
      rfQNo: "",
      bidderEmail: "",
      bidderName: "",
      createdBy: "",
      disableCompleteContract: false,
      notifications: [],
    }
  },


  async created() {
    const id = this.$route.params.id
    let contractsM = await purchaseContractService.getContracts()
    this.purchcontracts = contractsM.filter(o => o.id === id)
    this.bidderId = this.purchcontracts[0].bidderId
    this.createdBy = this.purchcontracts[0].createdBy
    this.rfQNo = this.purchcontracts[0].requisitionId
    this.negotiatedBidValue = this.purchcontracts[0].negotiatedBidValue
    this.requisitionSubType = this.purchcontracts[0].requisitionSubType
    let BiddersList = await biddersService.getBidders()
    let bidderReqDetails = BiddersList.filter(o => o.id === this.bidderId)
    this.bidderEmail = bidderReqDetails[0].primaryEmailAddress
    this.bidderName = bidderReqDetails[0].bidderName
    this.contractId = id
    let notifs = await notificationServices.getNotifications(stores.signedInUserEmail)
    this.notifications = notifs.reverse()

    if (this.purchcontracts[0].status == 'Executed') {
      this.disableCompleteContract = true
    }
    await this.checkUrl1(),
      await this.checkUrl2(),
      await this.checkUrl3()
  },

  computed: {
    filteredContracts() {
      let contracts = this.purchcontracts
      if (this.purchcontracts[0].bidderSignedContractFileURL) {
        this.bidderSignedContractFileURL = this.purchcontracts[0].bidderSignedContractFileURL
      }
      if (this.purchcontracts[0].fullyExecutedContractFileURL) {
        this.fullyExecutedContractFileURL = this.purchcontracts[0].fullyExecutedContractFileURL
      }
      return contracts
    },
  },

  methods: {
    navigatetoNotification(id, type) {
      if (type == 'Bid Submission') {
        this.$router.push(`/rfqedit/${id}`)
      }

      else if (type == 'Signed Contract Upload') {
        this.$router.push(`/purchcontractdetails/${id}`)
      }
    },

    async checkUrl1() {
      let Url1 = this.purchcontracts[0].contractFileURL
      let response = await fetch(`https://eprocureapi.infracredit.ng/infraUpload/DownloadContractDocument?filename=${Url1}`);
      let data = await response.blob();
      this.sizeContractFile = (data.size) / 1000000
      let metadata = {
        type: 'application/pdf'
      }
      let file = new File([data], "application.pdf", metadata);
      var reader = new FileReader();
      reader.onload = function () {
        this.contractFileURL = reader.result;
      }.bind(this)
      reader.readAsDataURL(file);
    },

    async checkUrl2() {
      let Url2 = this.purchcontracts[0].bidderSignedContractFileURL
      let response2 = await fetch(`https://eprocureapi.infracredit.ng/infraUpload/DownloadContractDocument?filename=${Url2}`);
      let data2 = await response2.blob();
      this.sizebidderSignedContract = (data2.size) / 1000000
      let metadata = {
        type: 'application/pdf'
      }
      let file2 = new File([data2], "application.pdf", metadata);
      var reader = new FileReader();
      reader.onload = function () {
        this.bidderSignedContractFileURL = reader.result;
        if (this.bidderSignedContractFileURL.length > 5) {

        }
      }.bind(this)
      reader.readAsDataURL(file2);
    },

    async checkUrl3() {
      let Url3 = this.purchcontracts[0].fullyExecutedContractFileURL
      let response3 = await fetch(`https://eprocureapi.infracredit.ng/infraUpload/DownloadContractDocument?filename=${Url3}`);
      let data3 = await response3.blob();
      this.sizeExecutedContractFile = (data3.size) / 1000000
      let metadata = {
        type: 'application/pdf'
      }
      let file3 = new File([data3], "application.pdf", metadata);
      var reader = new FileReader();
      reader.onload = function () {
        this.fullyExecutedContractFileURL = reader.result;
      }.bind(this)
      reader.readAsDataURL(file3);
    },

    downloadContract() {
      var link = document.createElement("a");
      link.download = "filename";
      link.target = "_blank";
      link.href = `https://eprocureapi.infracredit.ng/infraUpload/DownloadContractDocument?filename=${this.purchcontracts[0].contractFileURL}`
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    downloadContractBidderSigned() {
      var link = document.createElement("a");
      link.download = "filename";
      link.target = "_blank";
      link.href = `https://eprocureapi.infracredit.ng/infraUpload/DownloadContractDocument?filename=${this.purchcontracts[0].bidderSignedContractFileURL}`
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    downloadContractFullyExecuted() {
      var link = document.createElement("a");
      link.download = "filename";
      link.target = "_blank";
      link.href = `https://eprocureapi.infracredit.ng/infraUpload/DownloadContractDocument?filename=${this.purchcontracts[0].fullyExecutedContractFileURL}`
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    async submitFile() {
      this.example = this.$refs.fileInput.files[0];
      this.errorMessage = ''
      this.loadingUpload = true
      let contractUpload = await uploadRequest.UploadContractDocument(this.$refs.fileInput.files[0])
      if (contractUpload.length > 5) {
        this.contractUploadUrl = contractUpload
        this.loadingUpload = false
      }
    },

    clearInput() {
      this.fileName = ''
      this.contractUploadUrl = ''
      this.loadingUpload = false
    },

    clearModal() {
      this.fileName = ''
      this.contractUploadUrl = ''
      this.showUploadModal = false
      this.loadingUpload = false
    },

    async uploadContract() {
      if (this.contractUploadUrl.length < 3) {
        return this.errorMessage = "Invalid file uploaded"
      }
      if (stores.signedInUserRole != 'Bidder') {
        this.errorMessage = ""
        this.showUploadModal = false
        let ps = await purchaseContractService.uploadFullySignedContract(this.contractId, this.contractUploadUrl, stores.signedInUserEmail)
        if (ps) {
          emailServices.sendExecutedContractUpload(this.bidderEmail, this.bidderName, `Fully Executed contract for ${this.rfQNo} has been uploaded`, this.rfQNo, this.bidderName, '', new Date().toJSON(), this.contractId, 'procurement@infracredit.ng', 'Procurement Team')
          setTimeout(async () => {
            window.location.reload();
          }, 2000)
        }
      }
      else if (stores.signedInUserRole == 'Bidder') {
        this.errorMessage = ""
        this.showUploadModal = false
        let ps = await purchaseContractService.uploadSignedContractBidder(this.contractId, this.contractUploadUrl, stores.signedInUserEmail)
        if (ps) {
          emailServices.sendSignedContractUpload(this.createdBy, this.createdBy, `Bidder Signed Contract for ${this.rfQNo} has been uploaded`, this.rfQNo, '', '', new Date().toJSON(), this.contractId, 'procurement@infracredit.ng', 'Procurement Team')
          setTimeout(async () => {
            window.location.reload();
          }, 2000);
        }
      }
    },

    async notifyWinnerforSignature() {
      this.loadingNotification = true
      let ps = await emailServices.sendContractSignature(this.bidderEmail, this.bidderName, `Contract for ${this.rfQNo}`, this.rfQNo, this.bidderName, '', new Date().toJSON(), this.contractId, 'procurement@infracredit.ng', 'Procurement Team')
      purchaseContractService.requestBidderToSignContact(this.bidderId, this.contractId)
      setTimeout(async () => {
        this.loadingNotification = false
        toast.success("Notification Sent");
      }, 2000);
    },
  }
}
</script>


<style scoped>
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

b {
  margin-top: 40px;
}

.dropdown-toggle::after {
  content: none;
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

.Rfq {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px 30px;
  gap: 20px;
  width: 100%;
  border-radius: 10px;
  background: #FFFFFF;
}

.topBotton {
  display: flex;
  gap: 7px;
  flex-direction: row;
  justify-content: flex-start;
  padding: 20px 20px 0px 0px;
}

.mainPage {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px 20px 20px 0px;
  gap: 30px;
  width: 100%;
  height: 665.37px;

}

.v-btn {
  text-transform: none !important;
  width: 240px;
  height: 40px;
  justify-content: center;
  padding: 15px;
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%) !important;
  font-family: 'Roboto' !important;
  font-weight: 400;
  font-size: 14px !important;
  color: white
}

.v-btn:hover {
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%) !important;
  transition: 0.7s !important;
  color: #FFFFFF !important;
  border: none !important;
}

.v-btn:disabled {
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%) !important;
  color: #100f0f !important;
}

.textarea {
  display: flex;
  flex-direction: column;
  justify-content: start;
  justify-items: start;
  margin-top: 5px;
  align-content: start;
  vertical-align: top;
  align-items: flex-start;
  gap: 5px;
  font-size: 17px;
  width: 415px;
  border: 1px solid black;
  resize: none;
  height: 262.37px;
}

.formButton1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  width: 415px;
  height: 40px;

}

.rfqtableHeader {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  width: 100%;
}

.tableHeadertext {
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 10px;
  line-height: 19px;
  color: #000000;
  text-align: left;
}

.bottomContent h2 {
  text-align: center;
  font-family: Roboto;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 24px;
  color: #227CBF;
}

.bottomContent p {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 5px;
  line-height: 19px;
  text-align: center;
  color: #808080;
}

.tableRowtexts {
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 19px;
  margin-bottom: 0px;
  color: #000000;
  text-align: left;
}

.purchContractDetails {
  width: 100%;
}


.topButton1 {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  border: 1px solid #FFFFFF;
  width: 415px;
  height: 40px;
  background: #47B65C;
  border-radius: 50px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  box-sizing: border-box;
  color: #FFFFFF;
}

.topButton1:hover {
  background-color: #FAFAFB;
  color: #47B65C;
  border-color: #47B65C;
}

.topButton2 {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #FFFFFF;
  width: 415px;
  height: 40px;
  background: #FF0000;
  border: 1px solid #FFFFFF;
  border-radius: 50px;
}

.comments {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.commentBtnGroup {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 10px;
  width: 415px;
  height: 90px;
}

.uploads {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding: 0px;
  gap: 5px;
  width: 131px;
  height: 24px;
}

.uploads img {
  width: 20px;
  height: 24px
}

.contractPreview {
  width: 2000px;
  height: 100%;
}

.uploadedfiles {
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  width: 415px;
  height: 34px;
  border: 1px solid #47B65C;
  border-radius: 4px;
}

.uploadedfiles p {
  margin-bottom: 0px;
}


h1 {
  font-weight: bold;
  margin-bottom: 25px;
  font-size: 75px;
}

header button {
  border: none;
  padding: 10px;
  width: 40px;
  height: 50x;
  cursor: pointer;
  background-color: rgb(21, 20, 20);
  color: white;
  border-radius: 100%;
  font-size: 20px;
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

.modal3 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px;
  gap: 20px;
  position: relative;
  width: 540px;
  height: 400.81px;
  background: #FAFAFB;
  border-radius: 10px;
}

.modals {
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  position: relative;
  width: 553.49px;
  border-radius: 10px;
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
  grid-template-columns: 1.5fr 2fr;
  grid-gap: 20px;
}

.topButton {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px;
  width: 200px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #227CBF;
  border-radius: 50px;
  font-family: Roboto;
  font-weight: 400;
  font-size: 14px;
  color: #227CBF;
}

.topButton:hover {
  background-color: #47B65C;
  color: #FFFFFF;
  border: none;
}

.modals h3 {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  display: flex;
  align-items: center;
  text-align: left;
  color: #000000;
}

.modals button {
  width: 100%;
  border: none;
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
  flex-direction: column;
  align-items: center;
  padding: 0px;
  gap: 10px;
  margin-top: 10px;
  width: 493.49px;
  height: 40px;
}

.save:hover {
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
  transition: 0.7s;
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
  top: 0px;
  display: flex;
  flex-direction: column;
}

.options {
  padding: 5px;
}


h1 {
  color: black;
  font-weight: bold;
  font-size: 20px;
}

h3 {
  font-size: 15px;
  margin-top: 15px;
  color: rgb(0, 54, 54);
}

p {
  color: black;
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

.loginBtn:hover {
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
  transition: 0.7s;
}

.loginBtn {
  width: 230px;
  height: 43px;
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #FFFFFF;
  padding: 10px;
  cursor: pointer;
  background: linear-gradient(90deg, #227CBF 0%, #47B65C 100%);
  border-radius: 50px;
}

button:hover {
  cursor: pointer;
}

.topBotton3 {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 7px;
  flex-direction: row;
  padding: 20px 20px 0px 0px;
}

.fileUploaded {
  display: flex;
  flex-direction: row;
  gap: 12px;
}

.topUpload {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;
  gap: 24px;
  width: 531px;
  height: 287px;
  background: #FAFAFB;
  border-width: 1px 1px 0px 1px;
  border-style: dashed;
  border-color: #000000;
  border-radius: 5px 5px 0px 0px;
}

.bottomUpload {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 10px;
  width: 531px;
  height: 80px;
  background: #808080;
  box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.1);
  border-radius: 0px 0px 10px 10px;
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
