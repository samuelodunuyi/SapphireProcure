<script setup>
import { AccordionList, AccordionItem } from "vue3-rich-accordion";
import { ref } from "vue";
import PageHeader from '../../components/TopHeader.vue';
const showResults = ref(false);

const onOptionSelected = (isCorrect) => {
    if (isCorrect) {
        showResults.value = !showResults.value
    }
}

</script>

<template>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Aladin">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <div v-if="showUploadModal" class="overlay">
        <div class="modal">
            <div class="topUpload">
                <img src="../../assets/images/upload_cloud.svg" />
                <div class="bottomContent">
                    <h2>Select a file or drag and drop here</h2>
                    <p>.pdf, file size no more than 20MB</p>
                </div>
                <div class="upload">
                    <v-btn class="buttonUploaded" :loading="loadingUpload" height="48" rounded="xl" size="small"
                        onclick="document.getElementById('getFile').click()" variant="flat">Upload file</v-btn>
                    <input type='file' id="getFile" style="display:none" @change="submitFile()" accept="application/pdf"
                        ref="fileInput">
                </div>
                <div class="fileUploaded" v-if="contractUploadUrl != ''">
                    <p style="text-decoration: underline; font-weight: bold;">{{ fileName.name }}</p>
                    <p :style="{ cursor: 'pointer' }" @click="clearInput()">X</p>
                </div>
                <b style="color:red">{{ errorMessageUpload }}</b>
            </div>
            <div class="bottomUpload">
                <div>
                    <div class="topBotton">
                        <button class="topButton" @click="clearModal()">Cancel</button>
                        <button class="topButton" @click="validateUpload()">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <PageHeader @selectOption="onOptionSelected"></PageHeader>

    <div class="sandbox">
        <div class="breadcrumb">
            <p @click="$router.push('/bidders')" style="cursor: pointer;">Dashboard</p>
            <img src="../../assets/images/arrowdown.svg" />
            <p>Bid Details</p>
        </div>
        <div class="topBotton">
            <button class="loginBtn" @click="downloadRFQ()">Download RFQ</button>
            <button class="loginBtn" @click="submitResponse()" :disabled="disableResponse">Submit Response</button>
        </div>

        <div class="accordion" id="accordionExample" style="width: 100%">
            <div class="accordion-item">
                <h2 id="headingOne" style="color: black; background-color: #227CBF;">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                        aria-expanded="true" aria-controls="collapseOne" style="color: white; background-color: #227CBF;">
                        General
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div class="maingeneral">
                            <div class="general221">
                                <div class="generalInput">
                                    <p>RFQ No:</p>
                                    <input name="rfqno" type="text" disabled v-model="rfqNo">
                                </div>
                                <div class="generalInput">
                                    <p>Creation Date:</p>
                                    <input name="creationDate" type="date" disabled v-model="rfqCreationDate">
                                </div>
                                <div class="tableV">
                                    <p style="color: #47B65C;">Invitation Date & Time: {{ InvitationDate }} GMT+1</p>
                                    <p style="color: #227CBF;">Expiration Date & Time: {{ ExpirationDate }} GMT+1</p>
                                </div>

                                <div class="tableV">
                                    <div class="timer" v-if="!expiredText">
                                        <vue-countdown :time="time" :interval="100"
                                            v-slot="{ days, hours, minutes, seconds }"
                                            style="color: #FF0000; font-size: 15px;">
                                            Expiration Countdown：{{ days }} days, {{ hours }} hours, {{ minutes }} minutes,
                                            {{
                                                seconds
                                            }} s.
                                        </vue-countdown>
                                    </div>
                                    <div class="timer" v-if="expiredText">
                                        <vue-countdown :time="time" :interval="100"
                                            style="color: #FF0000; font-size: 15px;">
                                            Expiration Countdown：<b>Expired</b>
                                        </vue-countdown>
                                    </div>
                                    <p>Submission Status: {{ bidSubmissionStatuses }}</p>
                                </div>
                            </div>
                            <div class="legal">
                                <div class="legalTop">
                                    <div id="lineTop" class="lineTop1">
                                        <p>Company Overview:</p>
                                        <div class="ckeditor">
                                            <div class="document-editor__toolbar1"></div>
                                            <div class="document-editor__editable-container">
                                                <ckeditor :editor="editor" :config="editorConfig" @ready="onReady1"
                                                    v-model="companyOverview" disabled class="checkEditor"></ckeditor>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="lineTop" class="lineTop1">
                                        <p>Project Description:</p>
                                        <div class="ckeditor">
                                            <div class="document-editor__toolbar2"></div>
                                            <div class="document-editor__editable-container">
                                                <ckeditor :editor="editor" :config="editorConfig" @ready="onReady2"
                                                    v-model="projectDescription" disabled class="checkEditor"></ckeditor>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="lineTop" class="lineTop1">
                                        <p>Scope of Work</p>
                                        <div class="ckeditor">
                                            <div class="document-editor__toolbar3"></div>
                                            <div class="document-editor__editable-container">
                                                <ckeditor :editor="editor" :config="editorConfig" @ready="onReady3"
                                                    v-model="scopeOfWork" disabled class="checkEditor"></ckeditor>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin: 5px 0px"></div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"
                        style="color: white; background-color: #227CBF;">
                        RFQ Response
                    </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div class="legal">
                            <div class="generalInput3">
                                <div>
                                    <p>Bid Value:</p>
                                    <input
                                        style="width: 180px; margin-top: 5px; padding: 5px; border-radius: 5px; border: 0.5px solid black;"
                                        v-model="bidValue" :disabled="disableResponse" v-if="submitStatus == 'true'" />
                                    <div style="display: flex; flex-direction: row;" v-if="submitStatus == 'false'">
                                        <CurrencyInput v-model="bidValue" :options="{ currency: 'NGN' }"
                                            :disabled="disableResponse" />
                                    </div>
                                </div>
                            </div>
                            <div class="generalInput3">
                                <div>
                                    <p>First Contact Person Name</p>
                                    <input type="text" v-model="contactPerson1" :disabled="disableResponse" />
                                </div>
                                <div>
                                    <p>Email</p>
                                    <input type="email" v-model="contactPersonEmail1" :disabled="disableResponse" />
                                </div>
                                <div>
                                    <p>Phone</p>
                                    <input type="text" v-model="contactPersonPhone1" :disabled="disableResponse" />
                                </div>
                            </div>

                            <div class="generalInput3">
                                <div>
                                    <p>Second Contact Person Name</p>
                                    <input type="text" v-model="contactPerson2" :disabled="disableResponse" />
                                </div>
                                <div>
                                    <p>Email</p>
                                    <input type="email" v-model="contactPersonEmail2" :disabled="disableResponse" />
                                </div>
                                <div>
                                    <p>Phone</p>
                                    <input type="text" v-model="contactPersonPhone2" :disabled="disableResponse" />
                                </div>
                            </div>
                            <div>
                                <p>Comment (Optional):</p>
                                <textarea class="textarea" name="textarea" rows="12" cols="162" v-model="comments"
                                    :disabled="disableResponse"></textarea>
                            </div>
                            <div class="Rfq223">
                                <div class="topBotton" style="justify-content: flex-start;">
                                    <button class="loginBtn" @click="showUploadModal = true"
                                        :disabled="disableResponse">Upload
                                        Supporting Document</button>
                                </div>
                                <div v-if="contractUploadUrl != ''" class="fileUploaded">
                                    <p style="text-decoration: underline; font-weight: bold;">{{ fileName.name }}</p>
                                    <p @click="clearInput()" :style="{ cursor: 'pointer' }">X</p>
                                </div>
                            </div>
                        </div>
                        <b style="color:red">{{ errorMessage }}</b>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CurrencyInput from "../../components/VCurrencyField.vue";
import DecoupledDocument from '@ckeditor/ckeditor5-build-decoupled-document';
import { useCounterStore } from "../../store/piniaStore"
import pinia from "../../store/store";
import biddersService from "../../services/biddersService";
import notificationServices from "../../services/notificationServices";
import uploadRequest from '../../components/uploadRequest'
import ESGRFQTemplate from "../../components/ESGRFQTemplate.js";
import TechnicalRFQTemplate from "../../components/TechnicalRFQTemplate.js";
import LegalDDRFQTemplate from "../../components/LegalDDRFQTemplate.js";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import emailServices from "../../services/emailServices";

const stores = useCounterStore(pinia);

export default {
    components: { CurrencyInput },

    data() {
        return {
            editor: DecoupledDocument,
            content: [
                '<h1>Hello world!</h1><p>This is a rich-text editor built on top of <span contenteditable="false"><a href="https://vuejs.org/" target="_blank">Vue.js</a></span> using the native <span contenteditable="false"><a href="https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content" target="_blank"><i>contenteditable</i></a></span> browser implementation and some JavaScript trickery to spread content over paper-sized pages.</p><p>Built-in functionality includes:</p><ul><li>Using Vue.js components as interactive page templates (see next page)</li><li>Word-by-word page splitting with forward and backward propagation (<u>still experimental</u>)</li><li>Native Print compatible</li><li>Dynamic document format and margins in millimeters</li><li>Custom page overlays (headers, footers, page numbers)</li><li>Page breaks</li><li>Smart zoom and page display modes</li><li>Computes text style at caret position</li></ul><p>This library may be useful if you design an application that generate documents and you would let the user to modify them slightly before printing / saving, but with limited / interactive possibilities. It does not intend to replace a proper document editor with full functionality.<br>Make sure this project is suitable to your needs before using it.</p><p>This demo adds:</p><ul><li>The top bar (<span contenteditable="false"><a href="https://github.com/motla/vue-file-toolbar-menu" target="_blank">vue-file-toolbar-menu</a></span> component) and the functions associated with it</li><li>Rewritten history stack (undo/redo) compatible with native commands</li><li>Pinch and trackpad zooming</li></ul><p>Check out the <span contenteditable="false"><a href="https://github.com/motla/vue-document-editor/blob/master/src/Demo/Demo.vue" target="_blank">Demo.vue</a></span> file if you need to add these functionalities to your application.</p><p>The link below is an example of non-editable block set with <code>contenteditable="false"</code>:</p><p style="text-align:center" contenteditable="false"><a href="https://github.com/motla/vue-document-editor">View docs on Github</a>, you can\'t edit me.</p><p>But you can still edit this.</p>',
            ],
            editorData: '<p>Content of the editor.</p>',
            editorConfig: {},
            selectedCurrency: 'USD',
            content_history: [],
            showUploadModal: false,
            bidValue: 0,
            value: 1234,
            rfqValues: [],
            companyOverview: '',
            projectDescription: '',
            scopeOfWork: '',
            comments: '',
            rfqCreationDate: '',
            InvitationDate: '',
            ExpirationDate: '',
            time: 0,
            rfqNo: '',
            fileName: '',
            dateModified: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            disableResponse: false,
            serviceCategoryId: 0,
            errorMessage: "",
            contactPerson1: '',
            contactPerson2: '',
            contactPersonEmail1: '',
            contactPersonEmail2: '',
            contactPersonPhone1: '',
            contactPersonPhone2: '',
            errorMessageUpload: "",
            contractUploadUrl: '',
            bidSubmissionStatuses: '',
            expiredText: false,
            notifications: [],
            loadingUpload: false,
            uploadText: 'Upload File',
            requestorMail: '',
            requestorName: '',
            submitStatus: undefined
        };
    },

    async created() {
        let rfqDetails = await biddersService.getBidderRequisitionsById(stores.bidderId)
        this.rfqValues = (rfqDetails.filter(o => o.id === stores.rfqNo))[0]
        this.rfqNo = this.rfqValues.id
        this.companyOverview = this.rfqValues.companyOverview
        this.projectDescription = this.rfqValues.projectDescription
        this.scopeOfWork = this.rfqValues.scopeOfWork
        this.comments = this.rfqValues.comments
        this.rfqCreationDate = this.rfqValues.createdDate.slice(0, 10).replace(/-/g, '-')
        this.requestorMail = this.rfqValues.requestedBy
        this.requestorName = this.rfqValues.requestedFullName
        let expirationDates = this.rfqValues.expirationDateTime
        let invitationDates = this.rfqValues.invitationSentDateTime
        this.submitStatus = (this.rfqValues.bidSubmissionStatus).toString()
        if (this.submitStatus === 'false') {
            this.bidSubmissionStatuses = "Not Submitted"
        }
        else if (this.submitStatus === 'true') {
            this.bidSubmissionStatuses = "Submitted"
        }

        let expireDate = new Date(expirationDates).getTime();
        let inviteDate = new Date(invitationDates).getTime();

        this.InvitationDate = new Date(inviteDate + 2 * 60 * 60 * 1000).toJSON()
        this.ExpirationDate = new Date(expireDate + 2 * 60 * 60 * 1000).toJSON()

        this.serviceCategoryId = this.rfqValues.serviceCategoryId
        this.bidValue = this.rfqValues.bidValue.toLocaleString()
        if (this.rfqValues.bidSubmissionStatus == true) {
            this.disableResponse = true
        }
        this.timeFunction()

        if (this.time < 0) {
            this.disableResponse = true
            this.expiredText = true
        }

        let bidderDetails = await biddersService.getBidders();
        let bidderUser = bidderDetails.filter(o => o.id === stores.bidderId)[0]
        this.contactPerson1 = bidderUser.contactName
        this.contactPersonEmail1 = bidderUser.primaryEmailAddress
        this.contactPersonPhone1 = bidderUser.primaryContactNumber
        this.notifications = await notificationServices.getNotifications(stores.signedInUserEmail)

    },
    methods: {
        navigatetoNotification(id, type) {
            if (type == 'Bid Invitation' || 'Bid Winner') {
                this.$router.push(`/rfqedit/${id}`)
            }
            else if (type == 'Contract Signature' || 'Executed Contract Upload') {
                this.$router.push(`/purchcontractdetails/${id}`)
            }
        },

        async submitFile() {
            this.fileName = this.$refs.fileInput.files[0];
            this.loadingUpload = true
            var contractUpload = await uploadRequest.UploadSupportDocument(this.$refs.fileInput.files[0])
            if (contractUpload.length > 5) {
                this.contractUploadUrl = contractUpload
                this.loadingUpload = false
            }
        },

        async submitResponse() {
            if (this.bidValue <= 0 || this.contactPerson1 == '' || this.contactPersonEmail1 == '' || this.contactPersonPhone1 == '') {
                return this.errorMessage = 'Please fill in all required fields (Bid value, Contact Persons)'
            }
            this.errorMessage = ''
            let ps = await biddersService.editBidValues(this.rfqNo, stores.bidderId, this.bidValue, this.comments, this.dateModified, this.contractUploadUrl, this.contactPerson1, this.contactPersonEmail1, this.contactPersonPhone1)
            if (ps) {
                toast.success("Your Response has been successfully submitted");
                let psss = emailServices.sendBidSubmission(this.requestorMail, this.requestorName, `Response to ${this.rfQNo} has been submitted by Bidder`, this.rfqNo, '', '', new Date().toJSON(), '', 'procurement@infracredit.ng', 'Procurement Team')
            }

            setTimeout(async () => {
                window.location.reload();
            }, 3000);
        },

        downloadRFQ() {
            if (this.serviceCategoryId == 1) {
                LegalDDRFQTemplate.exportPdfDownload(this.rfqNo, this.companyOverview, this.projectDescription, this.scopeOfWork, this.ExpirationDate)
            }

            if (this.serviceCategoryId == 2) {
                TechnicalRFQTemplate.exportPdfDownload(this.rfqNo, this.companyOverview, this.projectDescription, this.scopeOfWork, this.ExpirationDate)
            }

            if (this.serviceCategoryId == 3) {
                ESGRFQTemplate.exportPdfDownload(this.rfqNo, this.companyOverview, this.projectDescription, this.scopeOfWork, this.ExpirationDate)
            }
        },

        timeFunction() {
            const nowDate = new Date().getTime();
            const now = new Date(nowDate + 1 * 60 * 60 * 1000)
            const check = new Date(this.ExpirationDate);
            this.time = check - now
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

        validateUpload() {
            if (this.contractUploadUrl.length < 4) {
                return this.errorMessageUpload = 'Select Valid File'
            }
            this.showUploadModal = false
            this.errorMessageUpload = ''
        },

        onReady1(editor) {
            const toolbarContainer = document.querySelector('.document-editor__toolbar1');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        },

        onReady2(editor) {
            const toolbarContainer = document.querySelector('.document-editor__toolbar2');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        },

        onReady3(editor) {
            const toolbarContainer = document.querySelector('.document-editor__toolbar3');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        },
    }
};
</script>


<style lang="scss" scoped>
.sandbox {
    margin: 20px 50px
}

.accordion-button:not(.collapsed) {
    color: inherit;
    background-color: #227CBF;
    color: white;
}

.accordion-button:not(.collapsed)::after {
    filter: brightness(0%) invert(100%);
}

.ckeditor {
    width: 100% !important;
    min-height: 100px !important;
    max-width: 27vw !important;
    margin-top: -20px;
}

.document-editor__toolbar1,
.document-editor__toolbar2,
.document-editor__toolbar3 {
    z-index: 1;
    border-bottom: 1px solid var(--ck-color-toolbar-border);
}

.document-editor__toolbar1 .ck-toolbar {
    border: 0;
    border-radius: 0;
}

.document-editor__editable-container {
    border: 1px hsl(0, 0%, 23%) solid;
}

.document-editor__editable-container .ck-editor__editable {
    margin-top: 0px;
    border: 1px hsl(0, 0%, 82.7%) solid;
    background: white;
    box-shadow: 0 0 5px hsla(0, 0%, 0%, .1);
}

.checkEditor {
    margin-top: -40px;
    max-height: 200px !important;
    min-height: 200px !important;
    border-radius: 8px;
    max-width: 42vw;
}

.topBotton {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    gap: 7px;
    margin: 20px 0px 0px 0px;
    flex-direction: row;
    padding: 0px 20px 0px 0px;
}

.loginBtn:hover {
    background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
    transition: 0.7s;
}

.buttonUploaded {
    text-transform: none !important;
    width: 233px;
    height: 40px;
    justify-content: center;
    padding: 15px;
    background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%) !important;
    border: 1px solid #227CBF;
    font-family: 'Roboto' !important;
    font-weight: 400;
    font-size: 15px !important;
    color: white
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
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 10px;
    cursor: pointer;
    border: none;
    background: linear-gradient(90deg, #227CBF 0%, #47B65C 100%);
    border-radius: 50px;
}

.timer {
    margin-top: -2px;
    margin-bottom: 1;
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

.fileUploaded {
    display: flex;
    flex-direction: row;
    gap: 12px;
}

.topButton:hover {
    background-color: #47B65C;
    color: #FFFFFF;
    border: none;
}

button:hover {
    cursor: pointer;
}

.general221 {
    display: grid;
    grid-template-columns: 0.6fr 0.6fr 1.2fr 0.8fr;
    align-items: flex-start;
}

.Rfq223 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 0px 0px 0px;
    gap: 20px;
    width: 100%;
}


.textarea {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    margin-top: -15px;
    gap: 71px;
    width: 100%;
    height: 110px;
    border: 0.5px solid #808080;
    border-radius: 5px;
    resize: none;
}

.generalInput input {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    gap: 21px;
    width: 15.5vw;
    height: 35px;
    border: 0.5px solid #808080;
    border-radius: 5px;
    font-family: Roboto;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    align-items: center;
    color: #000000;
}

.generalInput p {
    margin-bottom: 0px;
}

.generalInput3 p {
    margin-bottom: 0px;
    width: 230px;
}

.generalInput3 {
    display: flex;
    flex-direction: row;
    gap: 50px;
    width: 60%;
}

.generalInput3 input {
    align-items: center;
    padding: 10px;
    margin-right: 15px;
    gap: 70px;
    width: 18vw;
    height: 35px;
    border: 0.5px solid #808080;
    border-radius: 5px;
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #000000;
}

.legal {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 10px 0px 10px 0px;
}

.legalTop {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: flex-start;
    padding: 0px;
    gap: 20px;
    width: 100%;
    grid-gap: 0px;
}

.lineTop1 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 5px;
    width: 28vw;
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

.breadcrumb {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 10px;
    width: 311px;
    height: 15px;
}

.breadcrumb p {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 14px;
    margin-bottom: 0px;
    color: #808080;
}

.tableV {
    box-sizing: border-box;
    width: 100%;
    margin-top: 20px;
}


.tableV p {
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 15px;
    color: #47B65C;
    margin-bottom: 0px;
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

.modal {
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding-top: 10px;
    width: 551px;
    height: 385px;
    border-radius: 10px;
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