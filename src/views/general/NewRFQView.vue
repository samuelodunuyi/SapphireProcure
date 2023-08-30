<script setup>
import { AccordionList, AccordionItem } from "vue3-rich-accordion";
import { ref } from "vue";
import PageHeader from '../../components/TopHeader.vue';
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
    <PageHeader @selectOption="onOptionSelected"></PageHeader>
    <div class="sandbox">
        <div class="topBotton_">
            <button class="topButton_" @click="onSubmit()" :disabled="disableSave">Begin RFQ</button>
            <button class="topButton_" @click="$router.go(-1)"> Back</button>
        </div>
        <b style="color:red">{{ errorMessage }}</b>
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
                            <div class="general_">
                                <div class="generalInput213_">
                                    <p>RFQ NO</p>
                                    <input name="rfqno" type="text" v-model="rfQNo" disabled class="genInput">
                                </div>
                                <div class="generalInput213_">
                                    <p>Creation Date</p>
                                    <input name="creationDate" type="date" v-model="creationDate" disabled>
                                </div>
                                <div class="generalInput213_">
                                    <p>Requestor</p>
                                    <input name="requestor" type="text" v-model="requestor" disabled>
                                </div>
                                <div class="generalInput213_">
                                    <p>Business Unit</p>
                                    <input name="requestor" type="text" v-model="businessUnit" disabled>

                                </div>
                                <div class="generalInput213_">
                                    <p>Department</p>
                                    <input name="requestor" type="text" v-model="department" disabled>
                                </div>
                            </div>

                            <div class="general2_">
                                <div class="generalInput213_">
                                    <p>Transaction/Request name</p>
                                    <textarea class="textarea2_" name="textarea" rows="17" cols="55" v-model="description"
                                        :disabled="disableFieldGeneral" maxlength="30"></textarea>
                                </div>
                                <div class="generalInput213_">
                                    <p>Background</p>
                                    <div class="ckeditor2">
                                        <div class="document-editor__toolbar1"></div>
                                        <div class="document-editor__editable-container">
                                            <ckeditor :editor="editor" :config="editorConfig" @ready="onReady1"
                                                v-model="companyOverview" :disabled="disableFieldGeneral"
                                                class="checkEditor"></ckeditor>
                                        </div>
                                    </div>
                                </div>

                                <div class="generalInput213_">
                                    <p>Project Description</p>
                                    <div class="ckeditor2">
                                        <div class="document-editor__toolbar2"></div>
                                        <div class="document-editor__editable-container">
                                            <ckeditor :editor="editor" :config="editorConfig" @ready="onReady2"
                                                v-model="projectDescription" :disabled="disableFieldGeneral"
                                                class="checkEditor"></ckeditor>
                                        </div>
                                    </div>
                                </div>
                                <div class="generalInput213_">
                                    <p>Requisition Status</p>
                                    <select name="rfqstatus" class="rfqstatus_1" disabled v-model="rfqStatus">
                                        <option value="open">Open</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="fullpage2"></div>
</template>

<script>
import administrationsService from "../../services/administrationsService";
import requisitionsServices from "../../services/requisitionsServices";
import notificationServices from "../../services/notificationServices";
import DecoupledDocument from '@ckeditor/ckeditor5-build-decoupled-document';
import { useCounterStore } from "../../store/piniaStore";
import pinia from "../../store/store";
import router from "../../router";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
const stores = useCounterStore(pinia);

export default {
    data() {
        return {
            editor: DecoupledDocument,
            editorConfig: {
                toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'insertTable', 'undo', 'redo', 'alignment', 'fontColor', 'fontFamily', 'fontSize',
                'underline'],
            },
            errorMessage: '',
            ascending: true,
            pageNumber: 0,  // default to page 0
            sortBy: 'alphabetically',
            rfQNo: "",
            serviceCategory: [],
            user: [],
            requestor: '',
            creationDate: new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
            businessUnit: undefined,
            department: undefined,
            businessUnitId: undefined,
            departmentId: undefined,
            description: '',
            companyOverview: '',
            projectDescription: '',
            rfqStatus: 'open',
            disableSave: false,
            notifications: []
        };
    },

    async created() {
        this.user = await administrationsService.getUserRoles()
        let getLoggedInUserRoles = this.user.find(o => o.userId === stores.signedInUserEmail)
        console.log(stores.signedInUserEmail)
        this.requestor = getLoggedInUserRoles.userFullName
        this.requestoremail = getLoggedInUserRoles.userId
        this.businessUnit = getLoggedInUserRoles.businessUnitDescription
        this.department = getLoggedInUserRoles.departmentDescription
        this.businessUnitId = getLoggedInUserRoles.businessUnitId
        this.departmentId = getLoggedInUserRoles.departmentId
        this.serviceCategory = await administrationsService.getServiceCategory()
        this.notifications = await notificationServices.getNotifications(stores.signedInUserEmail)

    },

    methods: {
        async onSubmit() {
            if (this.creationDate == '' || this.requestoremail == '' || this.description == '' || this.departmentId == '' || this.businessUnitId == '' || this.companyOverview == '' || this.projectDescription == '' || this.requestoremail == '' || this.creationDate == '') {
                return this.errorMessage = 'Please fill all fields'
            }
            this.errorMessage = ''
            let rfqReturn = await requisitionsServices.createRequisitions(this.creationDate, this.requestoremail, this.description, this.departmentId, this.businessUnitId, this.companyOverview, this.projectDescription, this.requestoremail, this.creationDate);
            this.rfQNo = rfqReturn.id
            if (this.rfQNo.length > 3) {
                toast.success("RFQ Created Successfully");
                this.disableSave = true
                setTimeout(async () => {
                    router.replace(`/rfqedit/${this.rfQNo}`)
                }, 2500);
            }
        },
        navigatetoNotification(id, type) {
            if (type == 'Bid Submission') {
                this.$router.push(`/rfqedit/${id}`)
            }

            else if (type == 'Signed Contract Upload') {
                this.$router.push(`/purchcontractdetails/${id}`)
            }
        },
        onReady1(editor) {
            const toolbarContainer = document.querySelector('.document-editor__toolbar1');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        },

        onReady2(editor) {
            const toolbarContainer = document.querySelector('.document-editor__toolbar2');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        },
    }

};
</script>


<style lang="scss" scoped>

.sandbox{
  padding: 20px 50px;
  background: #FAFAFB;
  font-family: 'Roboto';
}
.ckeditor2 {
    width: 100% !important;
    min-height: 100px !important;
    max-width: 27vw !important;
}

.document-editor__toolbar1,
.document-editor__toolbar2 {
    z-index: 1;
    border-bottom: 1px solid var(--ck-color-toolbar-border);
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

.ckeditor2:disabled {
    background: #bfbfbf;
}

.fullpage2 {
    width: 100%;
    padding-top: 400px;
    background: #FAFAFB;
}

.rfqstatus_1 {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    background-repeat: no-repeat;
    background-position-x: 96%;
    background-position-y: 13px;
}

.rfqstatus_1 {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 15px 8px 8px;
    width: 250px;
    height: 40px;
    background: #FAFAFB;
    border: 0.5px solid #808080;
    border-radius: 5px;
}

.topBotton_ {
    display: flex;
    width: 100%;
    margin: 20px 0px;
    gap: 7px;
    flex-direction: row;
    padding: 20px 20px 0px 0px;
}

input:disabled {
    background: #dddddd;
}
.topButton_ {
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
    font-size: 0.85rem;
    color: #227CBF;
}
.topButton_:hover {
    background-color: #47B65C;
    color: #FFFFFF;
    border: none;
}

button:hover {
    cursor: pointer;
}

.general2_ {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    width: 100%;
}

.ckeditor2 {
    width: 100% !important;
    min-height: 100px !important;
    max-width: 27vw !important;
}

.generalInput213_ textarea {
    width: 27.3vw;
}

.generalInput213_ {
    margin-bottom: 10px;
}

.generalInput213_ p {
    margin-bottom: 0px;
}

.generalInput213_ input {
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

.general_ {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}

.textarea2_ {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    gap: 71px;
    width: 380px;
    resize: none;
    height: 243px !important;
    border: 0.5px solid #808080;
    border-radius: 5px;
}


.overlay_ {
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

.modal223_ {
    position: fixed;
    width: 350px;
    right: -5px;
    box-shadow: 0px 0px 5px 0.5px rgb(101, 101, 101);
    background-color: #e6e6e6;
    border-left: 1px solid rgb(113, 113, 113);
    height: 100%;
    top: 0px;
    display: flex;
    flex-direction: column;
}

.midsect_ h3 {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;
    display: flex;
    text-align: center;
    color: #282828;
}

.midsect_ {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 10px;
    width: 361px;
    height: 144px;
}

.modal_ img {
    margin-top: 5px;
}



.bidderlist_ {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 5px;
    margin-top: 5px;
    width: 361px;
    height: 55px;
}

.bidderlist_ label {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #000000;
}

select {
    border: 5px yellow solid;

}

.bidderlist_ select {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    background-image: url('../../assets/images/arrow_right.svg');
    background-repeat: no-repeat;
    background-position-x: 98%;
    background-position-y: 10px;
    border: 1px solid #dfdfdf;
    border-radius: 2px;
    padding-left: 10px;
    width: 220px;
    height: 35px;
    border-radius: 5px;
    font-family: Roboto;
    font-size: 12px;
}

.options_ p {
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

.modals_ {
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    position: relative;
    width: 553.49px;
    border-radius: 10px;
}

.topUpload_ {
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

.bottomUpload_ {
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


.loginBtn_:hover {
    background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
    transition: 0.7s;
}

.loginBtn_ {
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

.topBotton3_ {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    gap: 7px;
    flex-direction: row;
    padding: 20px 20px 0px 0px;
}
</style>