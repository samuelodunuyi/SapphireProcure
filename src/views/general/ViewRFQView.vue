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

    <div v-if="showPreferredBidders" class="overlay_" @click="showPreferredBidders = false">
        <div class="modals63_" @click.stop>
            <div class="midsect_">
                <div class="headerBox">
                    <h4 style="color: black;">Add Nominated Bidders to RFQ</h4>
                    <input type="text" placeholder="Search Bidder List..." v-model="searchValue" style="color: black;" />
                </div>
                <div class="tableDiv">
                    <v-table fixed-header density="compact" height="300px">
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Select
                                </th>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-left">
                                    Rating Score
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i in filteredPreferredBidders" :key="i.id" :style="{ cursor: 'pointer' }">
                                <td> <v-checkbox v-model="preferredBiddersSelected" :value="i.id"></v-checkbox></td>
                                <th scope="row">{{ i.bidderName }}</th>
                                <td>65/100%</td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
                <div class="topBotton4_">
                    <button class="topButton785_" @click="showPreferredBidders = false">Cancel</button>
                    <button class="topButton785_" v-if="idPreferredBidders == 1"
                        @click="createLineSelectedBiddersLegal()">Submit</button>
                    <button class="topButton785_" v-if="idPreferredBidders == 2"
                        @click="createLineSelectedBiddersESG()">Submit</button>
                    <button class="topButton785_" v-if="idPreferredBidders == 3"
                        @click="createLineSelectedBiddersTechnical()">Submit</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="selectAllBiddersESG" class="overlay_" @click="selectAllBiddersESG = false">
        <div class="modals5_" @click.stop>
            <div class="midsect_">
                <h3>Select All Bidders</h3>
                <div class="bidderlist_">
                    <label for="">Do you want to select all {{ checkServiceLineCategoryESG }} Bidders? </label>
                </div>
                <div class="topBotton31_">
                    <button class="topButton785_" @click="selectAllBiddersESG = false">No</button>
                    <button class="topButton785_" @click.prevent="createLineAllBiddersESG()">Yes</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="selectAllBiddersLegal" class="overlay_" @click="selectAllBiddersLegal = false">
        <div class="modals5_" @click.stop>
            <div class="midsect_">
                <h3>Select All Bidders</h3>
                <div class="bidderlist_">
                    <label for="">Do you want to select all {{ checkServiceLineCategoryLegal }} Bidders? </label>
                </div>
                <div class="topBotton31_">
                    <button class="topButton785_" @click="selectAllBiddersLegal = false">No</button>
                    <button class="topButton785_" @click.prevent="createLineAllBiddersLegal()">Yes</button>
                </div>
            </div>

        </div>
    </div>

    <div v-if="selectAllBiddersTechnical" class="overlay_" @click="selectAllBiddersTechnical = false">
        <div class="modals5_" @click.stop>
            <div class="midsect_">
                <h3>Select All Bidders</h3>
                <div class="bidderlist_">
                    <label for="">Do you want to select all {{ checkServiceLineCategoryTechnical }} Bidders? </label>
                </div>
                <div class="topBotton31_">
                    <button class="topButton785_" @click="selectAllBiddersTechnical = false">No</button>
                    <button class="topButton785_" @click.prevent="createLineAllBiddersTechnical()">Yes</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showReviewQuotes" class="overlay_" @click="showReviewQuotes = false">
        <div class="modal4" @click.stop>
            <div class="frame_">
                <h3>Review Quotes</h3>
                <p>RFQ Number: {{ rfQNo }}</p>
                <p>Number of Vendors: {{ filteredbidderResponse.length }}</p>
            </div>
            <div class="tableframe_">
                <div class="table-responsive-sm reviewQuoteTable">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col"><b>Bidder ID </b></th>
                                <th scope="col"><b>Bidder Name </b></th>
                                <th scope="col"><b>Bid Value </b></th>
                                <th scope="col"><b>Negotiated Bid Value </b></th>
                                <th scope="col"><b>Ranking </b></th>
                                <th scope="col"><b>Comments </b></th>
                                <th scope="col"><b>Document Upload </b></th>
                                <th scope="col"><b></b></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="value in filteredbidderResponse" :key="value.rfqNo">
                                <th scope="row">{{ value.bidderId }}</th>
                                <td>{{ value.bidderName }}</td>
                                <td>{{ value.bidValue.toLocaleString() }}</td>
                                <td v-if="value.negotiatedBidValue != null">{{ value.negotiatedBidValue.toLocaleString() }}
                                </td>
                                <td v-else> </td>
                                <td>{{ value.autoRankWinner }}</td>
                                <td>{{ value.comments }}</td>
                                <td>
                                    <p style="text-decoration: underline; cursor: pointer; color: blue;"
                                        class="tableHeadertext_"
                                        v-if="value.documentFileName != null && value.documentFileName != ''"
                                        @click="downloadSupportingDocumentt(value.documentFileName)">
                                        Download File
                                    </p>
                                    <p class="tableHeadertext_" v-else>None</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="tableframe_" v-if="id == 1">
                <div class="justifcationHeader">
                    <b>Do you prefer a different Bidder?</b>
                </div>
                <div class="justifcationSubHeader">
                    <p>Select a preferred Bidder</p>
                    <select name="rfqstatus" class="rfqstatus3_" v-model="selectedBidResponseLegal"
                        disabled>
                        <option :value=response.bidderId v-for="response in filteredbidderResponse">{{
                            response.bidderName }}
                        </option>
                    </select>
                </div>

                <div class="justificationLine" v-if="selectedBidResponseLegal != ''">
                    <p style="margin-left: 10px">Provide Justification for your preference </p>
                    <textarea v-model="preferenceJustificationLegal" class="textarea23_" name="textarea" rows="17" cols="55"
                        disabled></textarea>
                    <p style="margin-left: 10px">Negotiated Bid Value(Optional)</p>
                    <CurrencyInput v-model="negotiatedBidValueLegal" class="generalInput73_" :options="{ currency: 'NGN' }"
                        disabled />
                    <div class="justificationButton">
                        <button class="regularBtn" @click="showJustification = false"
                            disabled>Cancel</button>
                        <button class="regularBtn" @click="selectasPreferredWinner()"
                            disabled>Submit</button>
                    </div>
                </div>
            </div>

            <div class="tableframe_" v-if="id == 2">
                <div class="justifcationHeader">
                    <b>Do you prefer a different Bidder?</b>
                </div>
                <div class="justifcationSubHeader">
                    <p>Select a preferred Bidder</p>
                    <select name="rfqstatus" class="rfqstatus3_" v-model="selectedBidResponseESG"
                        disabled>
                        <option :value=response.bidderId v-for="response in filteredbidderResponse">{{ response.bidderName
                        }}
                        </option>
                    </select>
                </div>

                <div class="justificationLine" v-if="selectedBidResponseESG != ''">
                    <p :style="{ 'margin-left': '10px' }">Provide Justification for your preference </p>
                    <textarea v-model="preferenceJustificationESG" class="textarea23_" name="textarea" rows="17" cols="55"
                        disabled></textarea>
                    <p style="margin-left: 10px">Negotiated Bid Value(Optional)</p>
                    <CurrencyInput v-model="negotiatedBidValueESG" class="generalInput73_" :options="{ currency: 'NGN' }"
                        disabled />
                    <div class="justificationButton">
                        <button class="regularBtn" @click="showJustification = false"
                            disabled>Cancel</button>
                        <button class="regularBtn" @click="selectasPreferredWinner()"
                            disabled>Submit</button>
                    </div>
                </div>

            </div>

            <div class="tableframe_" v-if="id == 3">
                <div class="justifcationHeader">
                    <b>Do you prefer a different Bidder?</b>
                </div>
                <div class="justifcationSubHeader">
                    <p>Select a preferred Bidder</p>
                    <select name="rfqstatus" class="rfqstatus3_" v-model="selectedBidResponseTechnical"
                        disabled>
                        <option :value=response.bidderId v-for="response in filteredbidderResponse">{{
                            response.bidderName }}
                        </option>
                    </select>
                </div>

                <div class="justificationLine" v-if="selectedBidResponseTechnical != ''">
                    <p :style="{ 'margin-left': '10px' }">Provide Justification for your preference </p>
                    <textarea v-model="preferenceJustificationTechnical" class="textarea23_" name="textarea" rows="17"
                        cols="55" disabled></textarea>
                    <p style="margin-left: 10px">Negotiated Bid Value(Optional)</p>
                    <CurrencyInput v-model="negotiatedBidValueTechnical" class="generalInput73_"
                        :options="{ currency: 'NGN' }" disabled/>
                    <div class="justificationButton">
                        <button class="regularBtn" @click="showJustification = false"
                            disabled>Cancel</button>
                        <button class="regularBtn" @click="selectasPreferredWinner()"
                            disabled>Submit</button>
                    </div>
                </div>

            </div>
            <div class="topBotton2_">
                <button class="topButton785_" @click="showReviewQuotes = !showReviewQuotes">Cancel</button>
                <button class="topButton785_" @click="notifyWinner()">Notify Preferred Winner</button>
            </div>
        </div>
    </div>

    <div v-if="showPreview" class="overlay_" @click="showPreview = false">
        <div class="modal5" @click.stop>
            <iframe :src=stores.testDocument3 height="100%" width="100%" title="Preview Template"></iframe>
        </div>
    </div>

    <div v-if="showContractToSendLegal" class="overlay_" @click="showContractToSendLegal = !showContractToSendLegal">
        <div class="modal6" @click.stop>
            <div class="main_1">
                <Editor api-key="a5xwo6r69r6w6av04foa9xikzbpf55uy3vog6pef3fw4fj25" :init="{
                    plugins: 'lists link image table code help wordcount',
                    noneditable_class: 'uneditable',
                    editable_class: 'editable',
                    content_style: `.editable{background: #FBEEB8;}`
                }" v-model="contentLegal" disabled/>
            </div>
            <div class="topBotton2_">
                <button class="topButton785_" @click="showContractToSendLegal = false">Cancel</button>
                <button class="topButton785_" @click="submitFile(1)" v-if="contractIdLegal == ''">Send</button>
                <button class="topButton785_" @click="navigateContractLegal(1)" v-else>View</button>
            </div>
        </div>
    </div>

    <div v-if="showContractToSendESG" class="overlay_" @click="showContractToSendESG = !showContractToSendESG">
        <div class="modal6" @click.stop>
            <div class="main_1">
                <Editor api-key="a5xwo6r69r6w6av04foa9xikzbpf55uy3vog6pef3fw4fj25" :init="{
                    plugins: 'lists link image table code help wordcount',
                    noneditable_class: 'uneditable',
                    editable_class: 'editable',
                    content_style: `.editable{background: #FBEEB8;}`
                }" v-model="contentESG" disabled/>
            </div>
            <div class="topBotton2_">
                <button class="topButton785_" @click="showContractToSendESG = false">Cancel</button>
                <button class="topButton785_" @click="submitFile(2)" v-if="contractIdESG == ''">Send</button>
                <button class="topButton785_" @click="navigateContractESG(2)" v-else>View</button>
            </div>
        </div>
    </div>

    <div v-if="showContractToSendTechnical" class="overlay_"
        @click="showContractToSendTechnical = !showContractToSendTechnical">
        <div class="modal6" @click.stop>
            <div class="main_1">
                <Editor api-key="a5xwo6r69r6w6av04foa9xikzbpf55uy3vog6pef3fw4fj25" :init="{
                    plugins: 'lists link image table code help wordcount',
                    noneditable_class: 'uneditable',
                    editable_class: 'editable',
                    content_style: `.editable{background: #FBEEB8;}`
                }" v-model="contentTechnical" disabled />
            </div>
            <div class="topBotton2_">
                <!-- {{contentTechnical}} -->
                <button class="topButton785_" @click="showContractToSendTechnical = false">Cancel</button>
                <button class="topButton785_" @click="submitFile(3)" v-if="contractIdTechnical == ''">Send</button>
                <button class="topButton785_" @click="navigateContractTechnical(3)" v-else>View</button>
            </div>
        </div>
    </div>
    <PageHeader @selectOption="onOptionSelected"></PageHeader>
    <div class="sandbox">
        <div class="breadcrumbs_">
            <p @click="$router.push('/')" style="cursor: pointer;">Dashboard</p>
            <img src="../../assets/images/arrowdown.svg" />
            <p>Requisitions</p>
            <img src="../../assets/images/arrowdown.svg" />
            <p>Requisition Details</p>
        </div>
        <div class="topBotton_">
            <button class="topButton785_" @click="$router.go(-1)"> Back</button>
            <button class="topButton785_" @click="completeRFQ()" disabled > Complete
                Requisition</button>
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
                                        disabled maxlength="30"></textarea>
                                </div>
                                <div class="generalInput213_">
                                    <p>Background</p>
                                    <div class="ckeditor2">
                                        <div class="document-editor__toolbar1"></div>
                                        <div class="document-editor__editable-container">
                                            <ckeditor :editor="editor" :config="editorConfig" @ready="onReady1"
                                                v-model="companyOverview" disabled
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
                                                v-model="projectDescription" disabled
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
            <div style="margin: 5px 0px"></div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"
                        style="color: white; background-color: #227CBF;">
                        Legal RFQ Section
                    </button>
                </h2>
                <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div class="legal_">
                            <div class="legalTop_">
                                <div>
                                    <p>Scope of Work</p>
                                    <div class="ckeditor">
                                        <div class="document-editor__toolbar3"></div>
                                        <div class="document-editor__editable-container">
                                            <ckeditor :editor="editor" :config="editorConfig" @ready="onReady3"
                                                v-model="scopeofWorkLegal" disabled
                                                class="checkEditor"></ckeditor>
                                        </div>
                                    </div>
                                </div>
                                <div class="category785_">
                                    <p>Expiration Duration</p>
                                    <div class="frame12348_">
                                        <input name="rfqno" type="number" placeholder="Input Days/Hours"
                                            v-model="selectTimeLegal" disabled>
                                        <select name="rfqstatus" class="rfqstatus_" v-model="selectTimeFrameworkLegal"
                                            disabled>
                                            <option value="Days">Days</option>
                                            <option value="Hours">Hours</option>
                                        </select>
                                    </div>
                                    <p>Service Sector</p>
                                    <select name="rfqstatus" class="rfqstatus3_" v-model="selectedServiceCategoryLineLegal"
                                        disabled>
                                        <option :value=serviceCategory.id
                                            v-for="serviceCategory in serviceCategoryLineLegal">{{
                                                serviceCategory.subCategoryName }}</option>
                                    </select>
                                    <p>Type</p>
                                    <div class="frame12349_">
                                        <select name="rfqstatus" class="rfqstatus3_" v-model="selectedRFQTypeLineLegal"
                                            disabled>
                                            <option :value=rfqTp.description v-for="rfqTp in rfqType">{{
                                                rfqTp.description }}</option>
                                        </select>

                                        <select name="rfqstatus" class="rfqstatus_" v-model="selectedRFQSubTypeLineLegal"
                                            disabled v-if="selectedRFQTypeLineLegal == 'TAF'">
                                            <option value="">Select Subtype</option>
                                            <option :value=rfqSubTp.id v-for="rfqSubTp in rfqSubType">{{
                                                rfqSubTp.description }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="topBotton_2">
                                    <button class="topButton785_" @click="saveRFQLineLegal()">Save & Preview RFQ</button>
                                    <button class="topButton785_" @click="selectAllBiddersLegal = !selectAllBiddersLegal"
                                        disabled>Select all
                                        Bidders</button>
                                    <button class="topButton785_" @click="getBiddersbyServiceCategoryLineIdLegal()"
                                        disabled>Nominate Select Bidders</button>
                                    <button class="topButton785_" @click="notifyBiddersLegal()"
                                        disabled>Send RFQ to Bidders</button>
                                </div>
                            </div>
                            <b v-if="errorMessageId == 1"> {{ errorMessage }}</b>
                            <div class="tableV_">
                                <h3 style="margin-left: 5px;">Nominated Bidders</h3>
                                <div v-if="showTimeLegal">
                                    <p style="color: #47B65C;">Invitation Date & Time: {{ invitationDateLegal }} GMT+1</p>
                                    <p style="color: #227CBF;">Expiration Date & Time: {{ expirationDateLegal }} GMT+1</p>
                                    <vue-countdown :time="timeLegal" :interval="100"
                                        v-slot="{ days, hours, minutes, seconds }" style="color: #FF0000;">
                                        Expiration Countdown：{{ days }} days, {{ hours }} hours, {{ minutes }} minutes, {{
                                            seconds
                                        }} seconds.
                                    </vue-countdown>
                                </div>
                            </div>

                            <div class="Rfq_" v-if="nominatedBiddersLegal.length >= 1">
                                <div class="table-responsive-sm">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col"><b>Bidder No </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                                <th scope="col"><b>Bidder Name </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                                <th scope="col"><b>Bid Submitted </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                                <th scope="col"><b>Bid Value </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="biddersSelected in filteredBiddersLegal"
                                                :key="biddersSelected.bidderId">
                                                <th scope="row">{{ biddersSelected.bidderId }}</th>
                                                <td>{{ biddersSelected.bidderName }}</td>
                                                <td v-if="biddersSelected.bidSubmissionStatus == true">
                                                    <p :style="{ 'font-weight': '500' }">Yes</p>
                                                </td>
                                                <td v-if="biddersSelected.bidSubmissionStatus == false">
                                                    <p :style="{ 'font-weight': '500' }">No</p>
                                                </td>
                                                <td v-if="showBidSubmitandValueLegal">₦ {{
                                                    biddersSelected.bidValue.toLocaleString("en-US") }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="paginationButtons" v-if="showPagination">
                                    <button @click="prevPage" :disabled="pageNumber == 1" class="paginationButton">
                                        &lt;
                                    </button>
                                    <p> ---{{ pageNumber }}---</p>
                                    <button @click="nextPage()" :disabled="pageNumber >= pageCountLegal - 1"
                                        class="paginationButton">
                                        >
                                    </button>
                                </div>
                            </div>
                            <div class="topBotton_">
                                <button class="topButton785_" @click="resetLineBiddersLegal()"
                                    disabled>Reset Bidders</button>
                                <button class="topButton785_" :disabled="!showBidSubmitandValueLegal"
                                    @click="reviewQuotes(1)">Review Quotes</button>
                                <button class="topButton785_" @click="showContractToSendLegal = true"
                                   disabled>
                                    Edit/Send Contract</button>
                                <button class="topButtonU_" disabled
                                    @click="notifyLosers()">Notify Unsuccessful
                                    Bidders</button>
                                <div class="generalInput234_" v-if="progressStatusLegal == 'Completed'">
                                    <p>Progress Status</p>
                                    <input name="progressStatusLegal" type="text" v-model="progressStatusLegal" disabled>
                                </div>
                                <div class="generalInput234_" v-if="progressStatusLegal == 'Contract Created'"
                                    style="margin-top:-20px">
                                    <p>Progress Status</p>
                                    <input name="progressStatusLegal" type="text" v-model="progressStatusLegal" disabled>
                                </div>
                                <div class="generalInput235_" v-if="progressStatusLegal == 'Open'">
                                    <p>Progress Status</p>
                                    <input name="progressStatusLegal" type="text" v-model="progressStatusLegal" disabled>
                                </div>
                                <div class="generalInput236" v-if="progressStatusLegal == 'In Progress'">
                                    <p>Progress Status</p>
                                    <input name="progressStatusLegal" type="text" v-model="progressStatusLegal" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin: 5px 0px"></div>
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree"
                        style="color: white; background-color: #227CBF;">
                        ESG RFQ Section
                    </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div class="legal_">
                            <div class="legalTop_">
                                <div>
                                    <p>Scope of Work</p>
                                    <div class="ckeditor">
                                        <div class="document-editor__toolbar4"></div>
                                        <div class="document-editor__editable-container">
                                            <ckeditor :editor="editor" :config="editorConfig" @ready="onReady4"
                                                v-model="scopeofWorkESG" disabled class="checkEditor">
                                            </ckeditor>
                                        </div>
                                    </div>
                                </div>
                                <div class="category785_">
                                    <p>Expiration Duration</p>
                                    <div class="frame12348_">
                                        <input name="rfqno" type="number" placeholder="Input Days/Hours"
                                            v-model="selectTimeESG" disabled>
                                        <select name="rfqstatus" class="rfqstatus_" v-model="selectTimeFrameworkESG"
                                            disabled>
                                            <option value="Days">Days</option>
                                            <option value="Hours">Hours</option>
                                        </select>
                                    </div>
                                    <p>Service Sector</p>
                                    <select name="rfqstatus" class="rfqstatus3_" v-model="selectedServiceCategoryLineESG"
                                        disabled>
                                        <option :value=serviceCategory.id v-for="serviceCategory in serviceCategoryLineESG">
                                            {{ serviceCategory.subCategoryName }}</option>
                                    </select>
                                    <p>Type</p>
                                    <div class="frame12349_">
                                        <select name="rfqstatus" class="rfqstatus3_" v-model="selectedRFQTypeLineESG"
                                            disabled>
                                            <option :value=rfqTp.description v-for="rfqTp in rfqType">{{
                                                rfqTp.description }}</option>
                                        </select>

                                        <select name="rfqstatus" class="rfqstatus_" v-model="selectedRFQSubTypeLineESG"
                                            disabled v-if="selectedRFQTypeLineESG == 'TAF'">
                                            <option value="">Select Subtype</option>
                                            <option :value=rfqSubTp.id v-for="rfqSubTp in rfqSubType">{{
                                                rfqSubTp.description }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="topBotton_2">
                                    <button class="topButton785_" @click="saveRFQLineESG()">Save & Preview RFQ</button>
                                    <button class="topButton785_" @click="selectAllBiddersESG = !selectAllBiddersESG"
                                        disabled>Select all
                                        Bidders</button>
                                    <button class="topButton785_" @click="getBiddersbyServiceCategoryLineIdESG()"
                                        disabled>Nominate Select Bidders</button>
                                    <button class="topButton785_" @click="notifyBiddersESG()"
                                        disabled>Send
                                        RFQ to Bidders</button>
                                </div>
                            </div>
                            <b v-if="errorMessageId == 2"> {{ errorMessage }}</b>
                            <div class="tableV_">
                                <h3 style="margin-left: 5px;">Nominated Bidders</h3>
                                <div v-if="showTimeESG">
                                    <p style="color: #47B65C;">Invitation Date & Time: {{ invitationDateESG }} GMT+1</p>
                                    <p style="color: #227CBF;">Expiration Date & Time: {{ expirationDateESG }} GMT+1</p>
                                    <vue-countdown :time="timeESG" :interval="100"
                                        v-slot="{ days, hours, minutes, seconds }" style="color: #FF0000;">
                                        Expiration Countdown：{{ days }} days, {{ hours }} hours, {{ minutes }} minutes, {{
                                            seconds
                                        }} seconds.
                                    </vue-countdown>
                                </div>
                            </div>

                            <div class="Rfq_" v-if="nominatedBiddersESG.length >= 1">
                                <div class="table-responsive-sm">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col"><b>Bider No </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                                <th scope="col"><b>Bidder Name </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                                <th scope="col"><b>Bid Submitted </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                                <th scope="col"><b>Bid Value </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="biddersSelected in filteredBiddersESG"
                                                :key="biddersSelected.bidderId">
                                                <th scope="row">{{ biddersSelected.bidderId }}</th>
                                                <td>{{ biddersSelected.bidderName }}</td>
                                                <td v-if="biddersSelected.bidSubmissionStatus == true">
                                                    <p :style="{ 'font-weight': '500' }">Yes</p>
                                                </td>
                                                <td v-if="biddersSelected.bidSubmissionStatus == false">
                                                    <p :style="{ 'font-weight': '500' }">No</p>
                                                </td>
                                                <td v-if="showBidSubmitandValueESG">₦ {{
                                                    biddersSelected.bidValue.toLocaleString("en-US") }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="paginationButtons" v-if="showPagination">
                                    <button @click="prevPage" :disable="pageNumber == 1" class="paginationButton">
                                        &lt;
                                    </button>
                                    <p> ---{{ pageNumber }}---</p>
                                    <button @click="nextPage()" :disabled="pageNumber >= pageCountESG - 1"
                                        class="paginationButton">
                                        >
                                    </button>
                                </div>
                            </div>
                            <div class="topBotton_">
                                <button class="topButton785_" @click="resetLineBiddersESG"
                                    disabled>Reset
                                    Bidders</button>
                                <button class="topButton785_" @click="reviewQuotes(2)"
                                    :disabled="!showBidSubmitandValueESG">Review
                                    Quotes</button>
                                <button class="topButton785_" @click="showContractToSendESG = true"
                                    disabled>
                                    Edit/Send Contract</button>
                                <button class="topButtonU_" disabled
                                    @click="notifyLosers()">Notify Unsuccessful
                                    Bidders</button>
                                <div class="generalInput234_" v-if="progressStatusESG == 'Completed'">
                                    <p>Progress Status</p>
                                    <input name="progressStatusESG" type="text" v-model="progressStatusESG" disabled>
                                </div>
                                <div class="generalInput234_" v-if="progressStatusESG == 'Contract Created'"
                                    style="margin-top:-20px">
                                    <p>Progress Status</p>
                                    <input name="progressStatusESG" type="text" v-model="progressStatusESG" disabled>
                                </div>
                                <div class="generalInput235_" v-if="progressStatusESG == 'Open'">
                                    <p>Progress Status</p>
                                    <input name="progressStatusESG" type="text" v-model="progressStatusESG" disabled>
                                </div>
                                <div class="generalInput236" v-if="progressStatusESG == 'In Progress'">
                                    <p>Progress Status</p>
                                    <input name="progressStatusESG" type="text" v-model="progressStatusESG" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style="margin: 5px 0px"></div>

            <div class="accordion-item">
                <h2 class="accordion-header" id="headingFour">
                    <button class="accordion-button collapsed " type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour"
                        style="color: white; background-color: #227CBF;">
                        Technical RFQ Section
                    </button>
                </h2>
                <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour"
                    data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div class="legal_">
                            <div class="legalTop_">
                                <div>
                                    <p>Scope of Work</p>
                                    <div class="ckeditor">
                                        <div class="document-editor__toolbar5"></div>
                                        <div class="document-editor__editable-container">
                                            <ckeditor :editor="editor" :config="editorConfig" @ready="onReady5"
                                                v-model="scopeofWorkTechnical" disabled
                                                class="checkEditor"></ckeditor>
                                        </div>
                                    </div>
                                </div>
                                <div class="category785_">
                                    <p>Expiration Duration</p>
                                    <div class="frame12348_">
                                        <input name="rfqno" type="number" placeholder="Input Days/Hours"
                                            v-model="selectTimeTechnical" disabled>
                                        <select name="rfqstatus" class="rfqstatus_" v-model="selectTimeFrameworkTechnical"
                                            disabled>
                                            <option value="Days">Days</option>
                                            <option value="Hours">Hours</option>
                                        </select>
                                    </div>
                                    <p>Service Sector</p>
                                    <select name="rfqstatus" class="rfqstatus3_"
                                        v-model="selectedServiceCategoryLineTechnical" disabled>
                                        <option :value=serviceCategory.id
                                            v-for="serviceCategory in serviceCategoryLineTechnical">{{
                                                serviceCategory.subCategoryName }}</option>
                                    </select>
                                    <p>Type</p>
                                    <div class="frame12349_">
                                        <select name="rfqstatus" class="rfqstatus3_" v-model="selectedRFQTypeLineTechnical"
                                            disabled>
                                            <option :value=rfqTp.description v-for="rfqTp in rfqType">{{
                                                rfqTp.description }}</option>
                                        </select>

                                        <select name="rfqstatus" class="rfqstatus_"
                                            v-model="selectedRFQSubTypeLineTechnical" disabled
                                            v-if="selectedRFQTypeLineTechnical == 'TAF'">
                                            <option value="">Select Subtype</option>
                                            <option :value=rfqSubTp.id v-for="rfqSubTp in rfqSubType">{{
                                                rfqSubTp.description }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="topBotton_2">
                                    <button class="topButton785_" @click="saveRFQLineTechnical()">Save & Preview
                                        RFQ</button>
                                    <button class="topButton785_"
                                        @click="selectAllBiddersTechnical = !selectAllBiddersTechnical"
                                        disabled>Select all
                                        Bidders</button>
                                    <button class="topButton785_" @click="getBiddersbyServiceCategoryLineIdTechnical()"
                                        disabled>Nominate Select Bidders</button>
                                    <button class="topButton785_" @click="notifyBiddersTechnical()"
                                        disabled>Send RFQ to Bidders</button>
                                </div>
                            </div>
                            <b v-if="errorMessageId == 3"> {{ errorMessage }}</b>
                            <div class="tableV_">
                                <h3 style="margin-left: 5px;">Nominated Bidders</h3>
                                <div v-if="showTimeTechnical">
                                    <p style="color: #47B65C;">Invitation Date & Time: {{ invitationDateTechnical }} GMT+1
                                    </p>
                                    <p style="color: #227CBF;">Expiration Date & Time: {{ expirationDateTechnical }} GMT+1
                                    </p>
                                    <vue-countdown :time="timeTechnical" :interval="100"
                                        v-slot="{ days, hours, minutes, seconds }" style="color: #FF0000;">
                                        Expiration Countdown：{{ days }} days, {{ hours }} hours, {{ minutes }} minutes, {{
                                            seconds
                                        }} seconds.
                                    </vue-countdown>
                                </div>
                            </div>

                            <div class="Rfq_" v-if="nominatedBiddersTechnical.length >= 1">
                                <div class="table-responsive-sm">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col"><b>Bidder No </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                                <th scope="col"><b>Bidder Name </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                                <th scope="col"><b>Bid Submitted </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                                <th scope="col"><b>Bid Value </b>
                                                    <img src="../../assets/images/sorticon.svg" class="sorticon"
                                                        v-on:click="ascending = !ascending" />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="biddersSelected in filteredBiddersTechnical"
                                                :key="biddersSelected.bidderId">
                                                <th scope="row">{{ biddersSelected.bidderId }}</th>
                                                <td>{{ biddersSelected.bidderName }}</td>
                                                <td v-if="biddersSelected.bidSubmissionStatus == true">
                                                    <p :style="{ 'font-weight': '500' }">Yes</p>
                                                </td>
                                                <td v-if="biddersSelected.bidSubmissionStatus == false">
                                                    <p :style="{ 'font-weight': '500' }">No</p>
                                                </td>
                                                <td v-if="showBidSubmitandValueTechnical">₦ {{
                                                    biddersSelected.bidValue.toLocaleString("en-US") }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="paginationButtons" v-if="showPagination">
                                    <button @click="prevPage" :disabled="pageNumber == 1" class="paginationButton">
                                        &lt;
                                    </button>
                                    <p> ---{{ pageNumber }}---</p>
                                    <button @click="nextPage()" :disabled="pageNumber >= pageCountTechnical - 1"
                                        class="paginationButton">
                                        >
                                    </button>
                                </div>
                            </div>
                            <div class="topBotton_">
                                <button class="topButton785_" @click="resetLineBiddersTechnical"
                                    disabled>Reset Bidders</button>
                                <button class="topButton785_" @click="reviewQuotes(3)"
                                    :disabled="!showBidSubmitandValueTechnical">Review
                                    Quotes</button>
                                <button class="topButton785_" @click="showContractToSendTechnical = true"
                                    disabled >
                                    Edit/Send Contract</button>
                                <button class="topButtonU_" disabled
                                    @click="notifyLosers()">Notify Unsuccessful
                                    Bidders</button>
                                <div class="generalInput234_" v-if="progressStatusTechnical == 'Completed'">
                                    <p>Progress Status</p>
                                    <input name="progressStatusTechnical" type="text" v-model="progressStatusTechnical"
                                        disabled>
                                </div>
                                <div class="generalInput234_" v-if="progressStatusTechnical == 'Contract Created'"
                                    style="margin-top:-20px">
                                    <p>Progress Status</p>
                                    <input name="progressStatusTechnical" type="text" v-model="progressStatusTechnical"
                                        disabled>
                                </div>
                                <div class="generalInput235_" v-if="progressStatusTechnical == 'Open'">
                                    <p>Progress Status</p>
                                    <input name="progressStatusTechnical" type="text" v-model="progressStatusTechnical"
                                        disabled>
                                </div>
                                <div class="generalInput236" v-if="progressStatusTechnical == 'In Progress'">
                                    <p>Progress Status</p>
                                    <input name="progressStatusTechnical" type="text" v-model="progressStatusTechnical"
                                        disabled>
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
import purchaseContractService from "../../services/purchaseContractService";
import pinia from "../../store/store";
import ESGRFQTemplate from "../../components/ESGRFQTemplate.js";
import TechnicalRFQTemplate from "../../components/TechnicalRFQTemplate.js";
import LegalDDRFQTemplate from "../../components/LegalDDRFQTemplate.js";
import biddersService from "../../services/biddersService";
import emailService from "../../services/emailServices";
import settingsService from "../../services/settingsService";
import notificationServices from "../../services/notificationServices";
import 'vue3-toastify/dist/index.css';
import uploadRequest from '../../components/uploadRequest'
import DecoupledDocument from '@ckeditor/ckeditor5-build-decoupled-document';
import LegalEngagementLetter from '../../components/LegalEngagementLetter.js';
import ESGEngagementLetter from '../../components/ESGEngagementLetter.js';
import TechnicalEngagementLetter from '../../components/TechnicalEngagementLetter.js';
import ESDHTML from '../../components/esdHtml.js';
import technicalHtml from '../../components/technicalHtml.js';
import LegalHtml from '../../components/LegalHtml.js';
import CurrencyInput from "../../components/VCurrencyField.vue";
import Editor from '@tinymce/tinymce-vue'
import { useCounterStore } from "../../store/piniaStore";
import { toast } from 'vue3-toastify';

const stores = useCounterStore(pinia);

export default {
    props: {
        size: {
            type: Number,
            required: false,
            default: 6
        }
    },
    components: { CurrencyInput },
    data() {
        return {
            editor: DecoupledDocument,
            editorData: '<p>Content of the editor.</p>',
            contentTechnical: technicalHtml,
            contentESG: ESDHTML,
            contentLegal: LegalHtml,
            editorConfig: {
                toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'outdent', 'indent', '|', 'insertTable', 'undo', 'redo', 'alignment', 'fontColor', 'fontFamily', 'fontSize',
                    'underline'],
            },
            timeLegal: 0,
            timeTechnical: 0,
            timeESG: 0,
            numberranking: 0,
            showPreferredBidders: false,
            showContractToSendLegal: false,
            showContractToSendESG: false,
            showContractToSendTechnical: false,
            contractUploadUrl: '',
            searchpreferredBidders: '',
            selectedServiceCategoryLineESG: '',
            selectedServiceCategoryLineLegal: '',
            selectedServiceCategoryLineTechnical: '',
            selectedRFQSubTypeLineTechnical: '',
            selectedRFQTypeLineTechnical: '',
            selectedRFQSubTypeLineLegal: '',
            selectedRFQTypeLineLegal: '',
            selectedRFQSubTypeLineESG: '',
            selectedRFQTypeLineESG: '',
            selectTimeLegal: undefined,
            selectTimeTechnical: undefined,
            selectTimeESG: undefined,
            ascending: true,
            showPreview: false,
            showReviewQuotes: false,
            selectTimeFrameworkLegal: 'Days',
            selectTimeFrameworkTechnical: 'Days',
            selectTimeFrameworkESG: 'Days',
            showTimeLegal: false,
            showTimeTechnical: false,
            showTimeESG: false,
            pageNumber: 1,  // default to page 1
            sortBy: 'alphabetically',
            rfQNo: "",
            showPagination: false,
            errorMessage: '',
            id: '',
            idPreferredBidders: '',
            creationDate: '',
            selectedBidResponseLegal: '',
            selectedBidResponseESG: '',
            selectedBidResponseTechnical: '',
            invitationDateLegal: undefined,
            invitationDateESG: undefined,
            invitationDateTechnical: undefined,
            expirationDateESG: undefined,
            expirationDateTechnical: undefined,
            expirationDateLegal: undefined,
            showBidSubmitandValueLegal: false,
            showBidSubmitandValueTechnical: false,
            showBidSubmitandValueESG: false,
            showUploadModal: false,
            contractNoteURL: "",
            serviceCategory: [],
            serviceCategoryLineLegal: [],
            serviceCategoryLineESG: [],
            serviceCategoryLineTechnical: [],
            getRequisitionLinesbyReqId: [],
            getRequisition: [],
            requestor: '',
            businessUnit: undefined,
            department: undefined,
            businessUnitId: undefined,
            departmentId: undefined,
            description: '',
            interval: "",
            companyOverview: '',
            projectDescription: '',
            rfqStatus: 'open',
            requestoremail: '',
            scopeofWorkLegal: '',
            scopeofWorkTechnical: '',
            scopeofWorkESG: '',
            errorMessageId: '',
            example: '',
            preferredBiddersSelected: [],
            visible: true,
            nominatedBiddersLegal: [],
            nominatedBiddersESG: [],
            nominatedBiddersTechnical: [],
            checkServiceLineCategoryLegal: '',
            checkServiceLineCategoryESG: '',
            checkServiceLineCategoryTechnical: '',
            selectAllBiddersLegal: false,
            selectAllBiddersTechnical: false,
            selectAllBiddersESG: false,
            disableSendRFQLegalBtn: true,
            disableSendRFQTechnicalBtn: true,
            disableSendRFQESGBtn: true,
            disableResetBtnESG: false,
            disableResetBtnLegal: false,
            disableResetBtnTechnical: false,
            disablePreferredBidderBtnLegal: false,
            disablePreferredBidderBtnTechnical: false,
            disablePreferredBidderBtnESG: false,
            disableFieldGeneral: false,
            disableFieldTechnical: false,
            disableFieldESG: false,
            disableFieldLegal: false,
            showJustification: false,
            disableEditContractTechnical: false,
            disableEditContractESG: false,
            disableEditContractLegal: false,
            loadingUpload: false,
            bidderResponseLegal: [],
            bidderResponseTechnical: [],
            bidderResponseESG: [],
            preferredBidders: [],
            notifications: [],
            preferenceJustificationTechnical: '',
            preferenceJustificationESG: '',
            preferenceJustificationLegal: '',
            negotiatedBidValueLegal: '',
            negotiatedBidValueTechnical: '',
            negotiatedBidValueESG: '',
            WinnerbidderIdLegal: '',
            WinnerbidderIdTechnical: '',
            WinnerbidderIdESG: '',
            SelectedWinnerbidderIdLegal: '',
            SelectedWinnerbidderIdESG: '',
            SelectedWinnerbidderIdTechnical: '',
            SelectedWinnerbidderIdTechnicalName: '',
            SelectedWinnerbidderIdESGName: '',
            SelectedWinnerbidderIdLegalName: '',
            RequisitionLinesLegal: [],
            RequisitionLinesTechnical: [],
            RequisitionLinesESG: [],
            selectPurchContractBtnId: '',
            progressStatusLegal: '',
            progressStatusTechnical: '',
            progressStatusESG: '',
            preferredBidderId: '',
            errorMessageUpload: '',
            searchValue: '',
            disableJustificationLegal: false,
            disableJustificationESG: false,
            disableJustificationTechnical: false,
            disableCompleteReqBtn: true,
            contractIdLegal: '',
            contractIdTechnical: '',
            contractIdESG: '',
            contractIdESG: '',
            rfqType: '',
            rfqSubType: '',
        };
    },

    async created() {
        const id = this.$route.params.id
        this.getRequisition = await requisitionsServices.getRequisitions();
        this.serviceCategoryLineLegal = await administrationsService.getServiceLine(1)
        this.serviceCategoryLineTechnical = await administrationsService.getServiceLine(2)
        this.serviceCategoryLineESG = await administrationsService.getServiceLine(3)
        let requisition = this.getRequisition.find(o => o.id === id)
        this.requestor = requisition.requestedFullName
        this.rfQNo = id
        this.requestoremail = requisition.requestedBy
        this.businessUnit = requisition.businessUnitShortCode
        this.department = requisition.departmentShortCode
        this.businessUnitId = requisition.businessUnitId
        this.departmentId = requisition.departmentId
        this.projectDescription = requisition.projectDescription
        this.description = requisition.description
        this.companyOverview = requisition.companyOverview
        this.creationDate = requisition.createdDate.slice(0, 10).replace(/-/g, '-')
        this.serviceCategory = await administrationsService.getServiceCategory()
        this.getRequisitionLinesbyReqId = await requisitionsServices.getRequisitionLinesbyReqid(this.rfQNo);
        this.RequisitionLinesLegal = this.getRequisitionLinesbyReqId.find(o => o.serviceCategoryId === 1)
        this.RequisitionLinesTechnical = this.getRequisitionLinesbyReqId.find(o => o.serviceCategoryId === 2)
        this.RequisitionLinesESG = this.getRequisitionLinesbyReqId.find(o => o.serviceCategoryId === 3)
        this.scopeofWorkLegal = this.RequisitionLinesLegal.scopeOfWork
        this.progressStatusLegal = this.RequisitionLinesLegal.progressStatus
        this.selectedRFQTypeLineLegal = this.RequisitionLinesLegal.rfqType
        this.selectedRFQSubTypeLineLegal = this.RequisitionLinesLegal.rfqSubType

        this.notifications = await notificationServices.getNotifications(stores.signedInUserEmail)
        this.rfqType = await settingsService.getRFQTypes()
        const subtype = await settingsService.getRFQSubTypes()
        const objWithIdIndex = subtype.findIndex((obj) => obj.description === 'Internal Sub Cat');
        subtype.splice(objWithIdIndex, 1);
        this.rfqSubType = subtype
        //serviceCteogry Line
        this.selectedServiceCategoryLineLegal = this.RequisitionLinesLegal.serviceCategoryLineId
        this.selectedServiceCategoryLineTechnical = this.RequisitionLinesTechnical.serviceCategoryLineId
        this.selectedServiceCategoryLineESG = this.RequisitionLinesESG.serviceCategoryLineId


        this.scopeofWorkTechnical = this.RequisitionLinesTechnical.scopeOfWork
        this.progressStatusTechnical = this.RequisitionLinesTechnical.progressStatus
        this.selectedRFQTypeLineTechnical = this.RequisitionLinesTechnical.rfqType
        this.selectedRFQSubTypeLineTechnical = this.RequisitionLinesTechnical.rfqSubType


        this.scopeofWorkESG = this.RequisitionLinesESG.scopeOfWork
        this.progressStatusESG = this.RequisitionLinesESG.progressStatus
        this.selectedRFQTypeLineESG = this.RequisitionLinesESG.rfqType
        this.selectedRFQSubTypeLineESG = this.RequisitionLinesESG.rfqSubType
        await this.checkServiceLineidLegal()
        await this.checkServiceLineidTechnical()
        await this.checkServiceLineidESG()


        //time framework
        this.selectTimeFrameworkTechnical = this.RequisitionLinesTechnical.expirationDurationUnit
        this.selectTimeFrameworkLegal = this.RequisitionLinesLegal.expirationDurationUnit
        this.selectTimeFrameworkESG = this.RequisitionLinesESG.expirationDurationUnit


        //expiration time duration
        this.selectTimeLegal = this.RequisitionLinesLegal.expirationDuration
        this.selectTimeTechnical = this.RequisitionLinesTechnical.expirationDuration
        this.selectTimeESG = this.RequisitionLinesESG.expirationDuration

        this.expirationDateLegal = this.RequisitionLinesLegal.expirationDateTime;
        this.expirationDateTechnical = this.RequisitionLinesTechnical.expirationDateTime
        this.expirationDateESG = this.RequisitionLinesESG.expirationDateTime

        this.invitationDateLegal = this.RequisitionLinesLegal.invitationSentDateTime
        this.invitationDateTechnical = this.RequisitionLinesTechnical.invitationSentDateTime
        this.invitationDateESG = this.RequisitionLinesESG.expirationDateTime


        if (this.invitationDateESG != null && this.expirationDateESG != null && this.invitationDateESG != new Date('1970-01-01T02:00:00.000Z').toJSON()) {
            this.timeFunctionESG()
            this.showTimeESG = true
            this.disableFieldGeneral = true
            this.disableFieldESG = true
            this.disableSendRFQESGBtn = true
            this.disableResetBtnESG = true
        }
        if (this.invitationDateTechnical != null && this.expirationDateTechnical != null && this.invitationDateTechnical != new Date('1970-01-01T02:00:00.000Z').toJSON()) {
            this.timeFunctionTechnical()
            this.showTimeTechnical = true
            this.disableFieldGeneral = true
            this.disableFieldTechnical = true
            this.disableSendRFQTechnicalBtn = true
            this.disableResetBtnTechnical = true

        }

        if (this.invitationDateLegal != null && this.expirationDateLegal != null && this.invitationDateLegal != new Date('1970-01-01T02:00:00.000Z').toJSON()) {
            this.timeFunctionLegal()
            this.showTimeLegal = true
            this.disableFieldGeneral = true
            this.disableFieldLegal = true
            this.disableSendRFQLegalBtn = true
            this.disableResetBtnLegal = true
        }


        //get Selected bidders by ServiceCategory
        let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
        this.nominatedBiddersLegal = nominatedBidders.filter(o => o.serviceCategoryId == 1)
        this.nominatedBiddersTechnical = nominatedBidders.filter(o => o.serviceCategoryId == 2)
        this.nominatedBiddersESG = nominatedBidders.filter(o => o.serviceCategoryId == 3)
        if (this.progressStatusTechnical == "In Progress" && this.nominatedBiddersTechnical.length > 0 && this.invitationDateTechnical == null) {
            this.disableSendRFQTechnicalBtn = false
        }

        if (this.progressStatusLegal == "In Progress" && this.nominatedBiddersLegal.length > 0 && this.invitationDateLegal == null) {
            this.disableSendRFQLegalBtn = false
        }

        if (this.progressStatusESG == "In Progress" && this.nominatedBiddersESG.length > 0 && this.invitationDateESG == null) {
            this.disableSendRFQESGBtn = false
        }

        if (this.progressStatusTechnical == "Completed" && this.nominatedBiddersTechnical.length > 0 && this.invitationDateTechnical == null) {
            this.disableCompleteReqBtn = false
        }

        if (this.progressStatusLegal == "Completed" && this.nominatedBiddersLegal.length > 0 && this.invitationDateLegal == null) {
            this.disableCompleteReqBtn = false
        }

        if (this.progressStatusESG == "Completed" && this.nominatedBiddersESG.length > 0 && this.invitationDateESG == null) {
            this.disableCompleteReqBtn = false
        }

        //disable buttons
        this.disableButtonsESG()
        this.disableButtonsTechnical()
        this.disableButtonsLegal()

        let isSubmissionAvailableLegal = this.nominatedBiddersLegal.find(o => o.bidSubmissionStatus == true)
        let isSubmissionAvailableESG = this.nominatedBiddersESG.find(o => o.bidSubmissionStatus == true)
        let isSubmissionAvailableTechnical = this.nominatedBiddersTechnical.find(o => o.bidSubmissionStatus == true)

        //get BidderId Winner
        if (this.selectedServiceCategoryLineLegal < 8 && this.timeLegal < 0 && this.nominatedBiddersLegal.length > 0 && isSubmissionAvailableLegal != undefined) {
            this.getBiddersQuoteLegal()
        }

        if (this.selectedServiceCategoryLineTechnical < 8 && this.timeTechnical < 0 && this.nominatedBiddersTechnical.length > 0 && isSubmissionAvailableTechnical != undefined) {
            this.getBiddersQuoteTechnical()
        }

        if (this.selectedServiceCategoryLineESG < 8 && this.timeESG < 0 && this.nominatedBiddersESG.length > 0 && isSubmissionAvailableESG != undefined) {
            this.getBiddersQuoteESG()
        }

        let purchContract = await purchaseContractService.getContracts()
        if (purchContract.filter(o => o.requisitionId == this.rfQNo)) {
            let contractbyReqId = purchContract.filter(o => o.requisitionId == this.rfQNo)
            if (contractbyReqId.find(o => o.serviceCategoryLineId === this.selectedServiceCategoryLineESG)) {
                this.contractIdESG = (contractbyReqId.find(o => o.serviceCategoryLineId === this.selectedServiceCategoryLineESG)).id
                this.disableEditContractESG = true

            }
            if (contractbyReqId.find(o => o.serviceCategoryLineId === this.selectedServiceCategoryLineLegal)) {
                this.contractIdLegal = (contractbyReqId.find(o => o.serviceCategoryLineId === this.selectedServiceCategoryLineLegal)).id
                console.log(this.contractIdLegal)
                this.disableEditContractLegal = true
            }
            if (contractbyReqId.find(o => o.serviceCategoryLineId === this.selectedServiceCategoryLineTechnical)) {
                this.contractIdTechnical = (contractbyReqId.find(o => o.serviceCategoryLineId === this.selectedServiceCategoryLineTechnical)).id
                this.disableEditContractTechnical = true
            }
        }


        this.disableJustificationLegal = true,
            this.disableJustificationESG = true,
            this.disableJustificationTechnical = true,
            this.disableCompleteReqBtn = true,
            this.disableSendRFQLegalBtn = true,
            this.disableSendRFQTechnicalBtn = true,
            this.disableSendRFQESGBtn = true,
            this.disableResetBtnESG = true,
            this.disableResetBtnLegal = true,
            this.disableResetBtnTechnical = true,
            this.disablePreferredBidderBtnLegal = true,
            this.disablePreferredBidderBtnTechnical = true,
            this.disablePreferredBidderBtnESG = true,
            this.disableFieldGeneral = true,
            this.disableFieldTechnical = true,
            this.disableFieldESG = true,
            this.disableFieldLegal = true,
            this.showJustification = true,
            this.disableEditContractTechnical = true,
            this.disableEditContractESG = true,
            this.disableEditContractLegal = true
    },

    computed: {
        vModelItems() {
            return Object.entries(state.value);
        },
        pageCountLegal() {
            let l = this.nominatedBiddersLegal.length,
                s = this.size;
            return Math.ceil(l / s);
        },

        pageCountTechnical() {
            let l = this.nominatedBiddersTechnical.length,
                s = this.size;
            return Math.ceil(l / s);
        },

        pageCountESG() {
            let l = this.nominatedBiddersESG.length,
                s = this.size;
            return Math.ceil(l / s);
        },

        indexStart() {
            return (this.pageNumber - 1) * this.size;
        },
        indexEnd() {
            return this.indexStart + this.size;
        },
        filteredPreferredBidders() {
            let contracts = this.preferredBidders

            // Process search input
            if (this.searchValue != '' && this.searchValue) {
                contracts = contracts.filter((item) => {
                    return item.id
                        .toLowerCase()
                        .includes(this.searchValue.toLowerCase()) ||
                        item.bidderName.toLowerCase().includes(this.searchValue.toLowerCase())
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
            return contracts
        },

        filteredbidderResponse() {
            if (this.id == 1) {
                this.getBiddersQuoteLegal()
                var contracts = this.bidderResponseLegal
            }
            else if (this.id == 2) {
                this.getBiddersQuoteESG()
                var contracts = this.bidderResponseESG
            }

            else if (this.id == 3) {
                this.getBiddersQuoteTechnical()
                var contracts = this.bidderResponseTechnical
            }

            // Sort by alphabetical order
            contracts = contracts.sort((a, b) => {
                if (this.sortBy == 'alphabetically') {
                    let fa = a.bidValue, fb = b.bidValue
                    if (fa < fb) {
                        return -1
                    }
                    if (fa > fb) {
                        return 1
                    }
                    return 0
                }
            })
            if (!this.ascending) {
                contracts.reverse()
            }
            return contracts
        },

        filteredBiddersLegal() {
            this.disableButtonsLegal()
            let contracts = this.nominatedBiddersLegal
            if (contracts.length > 0 && this.invitationDateLegal == null) {
                this.disableSendRFQLegalBtn = false
            }
            // Sort by alphabetical order
            contracts = contracts.sort((a, b) => {
                if (this.sortBy == 'alphabetically') {
                    let fa = a.bidderId.toLowerCase(), fb = b.bidderId.toLowerCase()

                    if (fa < fb) {
                        return -1
                    }
                    if (fa > fb) {
                        return 1
                    }
                    return 0
                }
            })
            if (!this.ascending) {
                contracts.reverse().slice(this.indexStart, this.indexEnd)
            }
            return contracts.slice(this.indexStart, this.indexEnd)
        },

        filteredBiddersESG() {
            this.disableButtonsESG()
            let contracts = this.nominatedBiddersESG
            if (contracts.length > 0 && this.invitationDateESG == null) {
                this.disableSendRFQESGBtn = false
            }

            // Sort by alphabetical order
            contracts = contracts.sort((a, b) => {
                if (this.sortBy == 'alphabetically') {
                    let fa = a.bidderId.toLowerCase(), fb = b.bidderId.toLowerCase()

                    if (fa < fb) {
                        return -1
                    }
                    if (fa > fb) {
                        return 1
                    }
                    return 0
                }
            })
            if (!this.ascending) {
                contracts.reverse().slice(this.indexStart, this.indexEnd)
            }
            return contracts.slice(this.indexStart, this.indexEnd)
        },

        filteredBiddersTechnical() {
            this.disableButtonsTechnical()
            let contracts = this.nominatedBiddersTechnical
            if (contracts.length > 0 && this.invitationDateTechnical == null) {
                this.disableSendRFQTechnicalBtn = false
            }
            // Sort by alphabetical order
            contracts = contracts.sort((a, b) => {
                if (this.sortBy == 'alphabetically') {
                    let fa = a.bidderId.toLowerCase(), fb = b.bidderId.toLowerCase()

                    if (fa < fb) {
                        return -1
                    }
                    if (fa > fb) {
                        return 1
                    }
                    return 0
                }
            })
            if (!this.ascending) {
                contracts.reverse().slice(this.indexStart, this.indexEnd)
            }
            return contracts.slice(this.indexStart, this.indexEnd)
        }
    },
    methods: {
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

        onReady4(editor) {
            const toolbarContainer = document.querySelector('.document-editor__toolbar4');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        },

        onReady5(editor) {
            const toolbarContainer = document.querySelector('.document-editor__toolbar5');
            toolbarContainer.appendChild(editor.ui.view.toolbar.element);
        },

        async getBiddersbyServiceCategoryLineIdLegal() {
            if (this.selectedServiceCategoryLineLegal === '') {
                return this.errorMessage = 'fill in service category line'
            }
            this.preferredBiddersSelected = []
            this.idPreferredBidders = 1
            this.preferredBidders = await biddersService.getBiddersbyServiceCategoryLineId(this.selectedServiceCategoryLineLegal)
            this.showPreferredBidders = !this.showPreferredBidders
        },

        async getBiddersbyServiceCategoryLineIdTechnical() {
            if (this.selectedServiceCategoryLineTechnical == '') {
                return this.errorMessage = 'fill in service category line'
            }
            this.preferredBiddersSelected = []
            this.idPreferredBidders = 3
            this.preferredBidders = await biddersService.getBiddersbyServiceCategoryLineId(this.selectedServiceCategoryLineTechnical)
            this.showPreferredBidders = !this.showPreferredBidders
        },

        async getBiddersbyServiceCategoryLineIdESG() {
            if (this.selectedServiceCategoryLineESG == '') {
                return this.errorMessage = 'fill in service category line'
            }
            this.preferredBiddersSelected = []
            this.idPreferredBidders = 2
            this.preferredBidders = await biddersService.getBiddersbyServiceCategoryLineId(this.selectedServiceCategoryLineESG)
            this.showPreferredBidders = !this.showPreferredBidders
            console.log(this.preferredBidders)
        },

        async getRequisitionLines() {
            this.getRequisitionLinesbyReqId = await requisitionsServices.getRequisitionLinesbyReqid(this.rfQNo);

            this.RequisitionLinesLegal = this.getRequisitionLinesbyReqId.find(o => o.serviceCategoryId === 1)
            this.invitationDateLegal = this.RequisitionLinesLegal.invitationSentDateTime
            this.expirationDateLegal = this.RequisitionLinesLegal.expirationDateTime

            this.RequisitionLinesTechnical = this.getRequisitionLinesbyReqId.find(o => o.serviceCategoryId === 2)
            this.invitationDateTechnical = this.RequisitionLinesTechnical.invitationSentDateTime
            this.expirationDateTechnical = this.RequisitionLinesTechnical.expirationDateTime

            this.RequisitionLinesESG = this.getRequisitionLinesbyReqId.find(o => o.serviceCategoryId === 3)
            this.invitationDateESG = this.RequisitionLinesESG.invitationSentDateTime
            this.expirationDateESG = this.RequisitionLinesESG.expirationDateTime
        },
        async checkServiceLineidLegal() {
            if (this.serviceCategoryLineLegal != [] && this.selectedServiceCategoryLineLegal < 8) {
                this.checkServiceLineCategoryLegal = (this.serviceCategoryLineLegal.find(o => o.id === this.selectedServiceCategoryLineLegal)).subCategoryName
            }
        },

        async checkServiceLineidTechnical() {
            if (this.serviceCategoryLineTechnical != [] && this.selectedServiceCategoryLineTechnical < 8) {
                this.checkServiceLineCategoryTechnical = (this.serviceCategoryLineTechnical.find(o => o.id === this.selectedServiceCategoryLineTechnical)).subCategoryName
            }
        },
        async checkServiceLineidESG() {
            if (this.serviceCategoryLineESG != [] && this.selectedServiceCategoryLineESG < 8) {
                this.checkServiceLineCategoryESG = (this.serviceCategoryLineESG.find(o => o.id === this.selectedServiceCategoryLineESG)).subCategoryName
            }
        },
        async saveRFQLineLegal() {
            if (this.scopeofWorkLegal.length < 10 || this.selectTimeLegal < 1 || this.selectTimeLegal == undefined || this.selectTimeFrameworkLegal.length < 2 || this.selectedServiceCategoryLineLegal.length < 2) {
                this.errorMessageId = 1
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            if (this.selectedRFQTypeLineLegal == 'Internal') {
                this.selectedRFQSubTypeLineLegal = 1
            }
            let updateGeneral = await requisitionsServices.updateRequisition(this.requestoremail, this.description, this.rfQNo, this.companyOverview, this.projectDescription)
            let ps = await requisitionsServices.updateRequisitionLine(this.rfQNo, 1, this.scopeofWorkLegal, this.selectTimeLegal, this.selectTimeFrameworkLegal, this.requestoremail, this.selectedServiceCategoryLineLegal, this.selectedRFQTypeLineLegal, this.selectedRFQSubTypeLineLegal);
            this.checkServiceLineidLegal()
            this.generatePDFLegal()
            if (ps && updateGeneral) {
                toast.success("Service Category Legal Saved Succesfully");
            }
            setTimeout(async () => {
                this.getRequisitionLinesbyReqId = await requisitionsServices.getRequisitionLinesbyReqid(this.rfQNo);
                this.RequisitionLinesLegal = this.getRequisitionLinesbyReqId.find(o => o.serviceCategoryId === 1)
                this.progressStatusLegal = this.RequisitionLinesLegal.progressStatus
                if (this.progressStatusLegal == "In Progress") {
                    this.disableSendRFQLegalBtn = false
                }
            }, 2000);
        },

        async saveRFQLineTechnical() {
            if (this.scopeofWorkTechnical.length < 10 || this.selectTimeTechnical < 1 || this.selectTimeTechnical == undefined || this.selectTimeFrameworkTechnical.length < 2 || this.selectedServiceCategoryLineTechnical.length < 2) {
                this.errorMessageId = 3
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            if (this.selectedRFQTypeLineTechnical == 'Internal') {
                this.selectedRFQSubTypeLineTechnical = 1
            }
            let updateGeneral = await requisitionsServices.updateRequisition(this.requestoremail, this.description, this.rfQNo, this.companyOverview, this.projectDescription)
            let ps = await requisitionsServices.updateRequisitionLine(this.rfQNo, 2, this.scopeofWorkTechnical, this.selectTimeTechnical, this.selectTimeFrameworkTechnical, this.requestoremail, this.selectedServiceCategoryLineTechnical, this.selectedRFQTypeLineTechnical, this.selectedRFQSubTypeLineTechnical);
            this.checkServiceLineidTechnical()
            this.generatePDFTechnical()
            if (ps && updateGeneral) {
                toast.success("Service Category Technical Saved Succesfully");
            }
            setTimeout(async () => {
                this.getRequisitionLinesbyReqId = await requisitionsServices.getRequisitionLinesbyReqid(this.rfQNo);
                this.RequisitionLinesTechnical = this.getRequisitionLinesbyReqId.find(o => o.serviceCategoryId === 2)
                this.progressStatusTechnical = this.RequisitionLinesTechnical.progressStatus
                if (this.progressStatusTechnical == "In Progress") {
                    this.disableSendTechnicalBtn = false
                }
            }, 2000);
        },


        async saveRFQLineESG() {
            if (this.scopeofWorkESG.length < 10 || this.selectTimeESG < 1 || this.selectTimeESG == undefined || this.selectTimeFrameworkESG.length < 2 || this.selectedServiceCategoryLineESG.length < 2) {
                this.errorMessageId = 2
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            if (this.selectedRFQTypeLineESG == 'Internal') {
                this.selectedRFQSubTypeLineESG = 1
            }
            let updateGeneral = await requisitionsServices.updateRequisition(this.requestoremail, this.description, this.rfQNo, this.companyOverview, this.projectDescription)
            let ps = await requisitionsServices.updateRequisitionLine(this.rfQNo, 3, this.scopeofWorkESG, this.selectTimeESG, this.selectTimeFrameworkESG, this.requestoremail, this.selectedServiceCategoryLineESG, this.selectedRFQTypeLineESG, this.selectedRFQSubTypeLineESG);
            this.checkServiceLineidESG()
            this.generatePDFESG()
            if (ps && updateGeneral) {
                toast.success("Service Category ESG Saved Succesfully");
            }
            setTimeout(async () => {
                this.getRequisitionLinesbyReqId = await requisitionsServices.getRequisitionLinesbyReqid(this.rfQNo);
                this.RequisitionLinesESG = this.getRequisitionLinesbyReqId.find(o => o.serviceCategoryId === 3)
                this.progressStatusESG = this.RequisitionLinesESG.progressStatus
                if (this.progressStatusESG == "In Progress") {
                    this.disableSendRFQESGBtn = false
                }
            }, 2000);
        },

        nextPage() {
            this.pageNumber++;
        },
        prevPage() {
            this.pageNumber--;
        },
        async submitFile(id) {
            if (id == 1) {
                LegalEngagementLetter.exportPdfDownload(this.contentLegal)
            }

            else if (id == 2) {
                ESGEngagementLetter.exportPdfDownload(this.contentESG)
            }

            if (id == 3) {
                TechnicalEngagementLetter.exportPdfDownload(this.contentTechnical)
            }
            this.errorMessageUpload = ''
            setTimeout(async () => {
                let contractUpload = await uploadRequest.UploadContractDocument(stores.storesBlob)
                this.contractUploadUrl = contractUpload
                this.createWinnerPurchaseContract(id)

            }, 2000);
            this.example = stores.storesBlob;
            this.loadingUpload = true
        },

        async createLineAllBiddersLegal() {
            if (this.selectedServiceCategoryLineLegal > 7) {
                this.errorMessageId = 1
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            let ps = requisitionsServices.createRequisitionLineAllBidders(this.requestoremail, this.rfQNo, this.selectedServiceCategoryLineLegal);
            this.selectAllBiddersLegal = false;
            setTimeout(async () => {
                let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
                this.nominatedBiddersLegal = nominatedBidders.filter(o => o.serviceCategoryId == 1)
                if (ps && this.nominatedBiddersLegal.length > 0) {
                    this.disableSendRFQLegalBtn = false
                }
            }, 2000);
        },

        async createLineAllBiddersTechnical() {
            if (this.selectedServiceCategoryLineTechnical > 7) {
                this.errorMessageId = 3
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            let ps = requisitionsServices.createRequisitionLineAllBidders(this.requestoremail, this.rfQNo, this.selectedServiceCategoryLineTechnical);
            this.selectAllBiddersTechnical = false;
            setTimeout(async () => {
                let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
                this.nominatedBiddersTechnical = nominatedBidders.filter(o => o.serviceCategoryId == 2)
                if (ps && this.nominatedBiddersTechnical.length > 0) {
                    this.disableSendRFQTechnicalBtn = false
                }
            }, 2000);
        },

        async createLineAllBiddersESG() {
            if (this.selectedServiceCategoryLineESG > 7) {
                this.errorMessageId = 2
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            let ps = requisitionsServices.createRequisitionLineAllBidders(this.requestoremail, this.rfQNo, this.selectedServiceCategoryLineESG);
            this.selectAllBiddersESG = false;
            setTimeout(async () => {
                let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
                this.nominatedBiddersESG = nominatedBidders.filter(o => o.serviceCategoryId == 3)
                if (ps && this.nominatedBiddersLegal.length > 0) {
                    this.disableSendRFQESGBtn = false
                }
            }, 2000);
        },

        async createLineSelectedBiddersESG() {
            if (this.selectedServiceCategoryLineESG > 7) {
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            let ps = requisitionsServices.createSelectedLineBidders(this.rfQNo, this.selectedServiceCategoryLineESG, this.requestoremail, this.preferredBiddersSelected.toString());
            this.showPreferredBidders = false;
            setTimeout(async () => {
                let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
                this.nominatedBiddersESG = nominatedBidders.filter(o => o.serviceCategoryId == 3)
                if (ps && this.nominatedBiddersESG.length > 0) {
                    this.disableSendRFQESGBtn = false
                }
            }, 2000);
        },

        async createLineSelectedBiddersTechnical() {
            if (this.selectedServiceCategoryLineTechnial > 7) {
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            let ps = requisitionsServices.createSelectedLineBidders(this.rfQNo, this.selectedServiceCategoryLineTechnical, this.requestoremail, this.preferredBiddersSelected.toString());
            this.showPreferredBidders = false;
            setTimeout(async () => {
                let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
                this.nominatedBiddersTechnical = nominatedBidders.filter(o => o.serviceCategoryId == 2)
                if (ps && this.nominatedBiddersTechnical.length > 0) {
                    this.disableSendRFQTechnicalBtn = false
                }
            }, 2000);
        },

        async createLineSelectedBiddersLegal() {
            if (this.selectedServiceCategoryLineLegal > 7) {
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            this.preferredBiddersSelected.toString()
            let ps = requisitionsServices.createSelectedLineBidders(this.rfQNo, this.selectedServiceCategoryLineLegal, this.requestoremail, this.preferredBiddersSelected.toString());
            this.showPreferredBidders = false;
            setTimeout(async () => {
                let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
                this.nominatedBiddersLegal = nominatedBidders.filter(o => o.serviceCategoryId == 1)
                if (ps && this.nominatedBiddersLegal.length > 0) {
                    this.disableSendRFQLegalBtn = false
                }
            }, 2000);
        },


        async resetLineBiddersLegal() {
            let ps = requisitionsServices.createResetRequisitionLinesBidderStatus(this.rfQNo, this.selectedServiceCategoryLineLegal)
            setTimeout(async () => {
                let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
                this.nominatedBiddersLegal = nominatedBidders.filter(o => o.serviceCategoryId == 1)
                if (ps) {
                    this.disablePreferredBidderBtnLegal = false
                    this.disableSendRFQLegalBtn = true

                }
            }, 2000);
        },

        async resetLineBiddersESG() {
            let ps = requisitionsServices.createResetRequisitionLinesBidderStatus(this.rfQNo, this.selectedServiceCategoryLineESG)
            setTimeout(async () => {
                let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
                this.nominatedBiddersESG = nominatedBidders.filter(o => o.serviceCategoryId == 3)
                if (ps) {
                    this.disablePreferredBidderBtnESG = false
                    this.disableSendRFQESGBtn = true
                }
            }, 2000);
        },

        async resetLineBiddersTechnical() {
            let ps = requisitionsServices.createResetRequisitionLinesBidderStatus(this.rfQNo, this.selectedServiceCategoryLineTechnical)
            setTimeout(async () => {
                let nominatedBidders = await requisitionsServices.getRequisitionBiddersbyRfqId(this.rfQNo)
                this.nominatedBiddersTechnical = nominatedBidders.filter(o => o.serviceCategoryId == 2)
                if (ps) {
                    this.disablePreferredBidderBtnTechnical = false
                    this.disableSendRFQTechnicalBtn = true
                }
            }, 2000);
        },

        async notifyBiddersLegal() {
            if (this.scopeofWorkLegal.length < 10 || this.selectTimeLegal < 1 || this.selectTimeLegal == undefined || this.selectTimeFrameworkLegal.length < 2 || this.selectedServiceCategoryLineLegal.length < 2) {
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            if (this.nominatedBiddersLegal.length < 1) {
                return this.errorMessage = "Please select Bidders"
            }
            this.disableFieldGeneral = true
            this.disableFieldLegal = true
            this.disableSendRFQLegalBtn = true
            let biddersServiceLineMap = this.nominatedBiddersLegal.map(({ bidderId, requisitionId, id, serviceCategoryLineId, bidSubmissionStatus, serviceCategoryId, documentFileName, resetStatus, lastModifiedDate, lastModifiedBy, createdDate, createdBy, comments, bidderName, bidValue, ...rest }) => ({ ...rest }))
            let bidderEmailfromSelectedbidders = biddersServiceLineMap.map(function (item) {
                return item.primaryEmailAddress;
            });
            let biddersServiceLineMapName = this.nominatedBiddersLegal.map(({ bidderId, requisitionId, id, serviceCategoryLineId, bidSubmissionStatus, serviceCategoryId, documentFileName, resetStatus, lastModifiedDate, lastModifiedBy, createdDate, createdBy, comments, bidValue, primaryEmailAddress, ...rest }) => ({ ...rest }))
            let bidderNamefromSelectedbidders = biddersServiceLineMapName.map(function (item) {
                return item.bidderName;
            });
            let sendnom = await requisitionsServices.sendRFQToNominatedBidders(this.rfQNo, 1, this.requestoremail)

            for (let i = 0; i < bidderEmailfromSelectedbidders.length; i++) {
                await emailService.sendBidInvite(bidderEmailfromSelectedbidders[i], bidderNamefromSelectedbidders[i], `Invite to ${ this.rfQNo } Bid`, this.rfQNo, bidderNamefromSelectedbidders[i], '', new Date().toJSON(), '', 'procurement@infracredit.ng', 'Procurement Team')
            }
            if (sendnom) {
                toast.success("RFQ Sent to Selected Legal Bidders");
                this.disableResetBtnLegal = true
            }
            setTimeout(async () => {
                this.getRequisitionLines().then(this.timeFunctionLegal)
            }, 2000);
        },

        async notifyBiddersESG() {
            if (this.scopeofWorkESG.length < 10 || this.selectTimeESG < 1 || this.selectTimeESG == undefined || this.selectTimeFrameworkESG.length < 2 || this.selectedServiceCategoryLineESG.length < 2) {
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            if (this.nominatedBiddersESG.length < 1) {
                return this.errorMessage = "Please select Bidders"
            }

            let biddersServiceLineMap = this.nominatedBiddersESG.map(({ bidderId, requisitionId, id, serviceCategoryLineId, bidSubmissionStatus, serviceCategoryId, documentFileName, resetStatus, lastModifiedDate, lastModifiedBy, createdDate, createdBy, comments, bidderName, bidValue, ...rest }) => ({ ...rest }))
            let bidderEmailfromSelectedbidders = biddersServiceLineMap.map(function (item) {
                return item.primaryEmailAddress;
            });
            let biddersServiceLineMapName = this.nominatedBiddersESG.map(({ bidderId, requisitionId, id, serviceCategoryLineId, bidSubmissionStatus, serviceCategoryId, documentFileName, resetStatus, lastModifiedDate, lastModifiedBy, createdDate, createdBy, comments, bidValue, primaryEmailAddress, ...rest }) => ({ ...rest }))
            console.log(this.nominatedBiddersESG)
            let bidderNamefromSelectedbidders = biddersServiceLineMapName.map(function (item) {
                return item.bidderName;
            });
            let sendnom = await requisitionsServices.sendRFQToNominatedBidders(this.rfQNo, 3, this.requestoremail)


            for (let i = 0; i < bidderEmailfromSelectedbidders.length; i++) {
                await emailService.sendBidInvite(bidderEmailfromSelectedbidders[i], bidderNamefromSelectedbidders[i], `Invite to ${ this.rfQNo } Bid`, this.rfQNo, bidderNamefromSelectedbidders[i], '', new Date().toJSON(), '', 'procurement@infracredit.ng', 'Procurement Team')
            }
            if (sendnom) {
                toast.success("RFQ Sent to Selected ESG Bidders");
                this.disableResetBtnESG = true

            }
            this.disableSendRFQESGBtn = true
            this.disableFieldESG = true
            this.disableFieldGeneral = true

            setTimeout(async () => {
                this.getRequisitionLines().then(this.timeFunctionESG)
            }, 2000);
        },

        async notifyBiddersTechnical() {
            if (this.scopeofWorkTechnical.length < 10 || this.selectTimeTechnical < 1 || this.selectTimeTechnical == undefined || this.selectTimeFrameworkTechnical.length < 2 || this.selectedServiceCategoryLineTechnical.length < 2) {
                return this.errorMessage = "Please fill in all fields appropraitely"
            }
            if (this.nominatedBiddersTechnical.length < 1) {
                return this.errorMessage = "Please select Bidders"
            }
            this.disableSendRFQTechnicalBtn = true
            let biddersServiceLineMap = this.nominatedBiddersTechnical.map(({ bidderId, requisitionId, id, serviceCategoryLineId, bidSubmissionStatus, serviceCategoryId, documentFileName, resetStatus, lastModifiedDate, lastModifiedBy, createdDate, createdBy, comments, bidderName, bidValue, ...rest }) => ({ ...rest }))
            let bidderEmailfromSelectedbidders = biddersServiceLineMap.map(function (item) {
                return item.primaryEmailAddress;
            });
            let biddersServiceLineMapName = this.nominatedBiddersTechnical.map(({ bidderId, requisitionId, id, serviceCategoryLineId, bidSubmissionStatus, serviceCategoryId, documentFileName, resetStatus, lastModifiedDate, lastModifiedBy, createdDate, createdBy, comments, bidValue, primaryEmailAddress, ...rest }) => ({ ...rest }))
            let bidderNamefromSelectedbidders = biddersServiceLineMapName.map(function (item) {
                return item.bidderName;
            });
            let sendnom = await requisitionsServices.sendRFQToNominatedBidders(this.rfQNo, 2, this.requestoremail)

            for (let i = 0; i < bidderEmailfromSelectedbidders.length; i++) {
                await emailService.sendBidInvite(bidderEmailfromSelectedbidders[i], bidderNamefromSelectedbidders[i], `Invite to ${ this.rfQNo } Bid`, this.rfQNo, bidderNamefromSelectedbidders[i], '', new Date().toJSON(), '', 'procurement@infracredit.ng', 'Procurement Team')
            }
            this.disableFieldGeneral = true
            this.disableFieldTechnical = true
            if (sendnom) {
                toast.success("RFQ Sent to Selected Technical Bidders");
                this.disableResetBtnTechnical = true
            }
            setTimeout(async () => {
                this.getRequisitionLines().then(this.timeFunctionTechnical)
            }, 2000);
        },


        timeFunctionLegal() {
            let expirationDateLegals = this.RequisitionLinesLegal.expirationDateTime
            let expireDateLegal = new Date(expirationDateLegals).getTime();
            this.expirationDateLegal = new Date(expireDateLegal + 2 * 60 * 60 * 1000).toJSON()
            let invitationDatesLegal = this.RequisitionLinesLegal.invitationSentDateTime
            let inviteDateLegal = new Date(invitationDatesLegal).getTime();
            this.invitationDateLegal = new Date(inviteDateLegal + 2 * 60 * 60 * 1000).toJSON()


            this.showTimeLegal = true
            this.disabled = true
            const nowDate = new Date().getTime();
            const now = new Date(nowDate + 1 * 60 * 60 * 1000)
            const check = new Date(this.expirationDateLegal);
            this.timeLegal = check - now
            if (this.timeLegal < 0) {
                this.showBidSubmitandValueLegal = true
            }
            this.errorMessage = ""
        },

        timeFunctionESG() {
            let expirationDateESGs = this.RequisitionLinesESG.expirationDateTime
            let expireDateESG = new Date(expirationDateESGs).getTime();
            this.expirationDateESG = new Date(expireDateESG + 2 * 60 * 60 * 1000).toJSON()
            let invitationDatesESG = this.RequisitionLinesESG.invitationSentDateTime
            let inviteDateESG = new Date(invitationDatesESG).getTime();
            this.invitationDateESG = new Date(inviteDateESG + 2 * 60 * 60 * 1000).toJSON()
            this.showTimeESG = true
            this.disabled = true
            const nowDate = new Date().getTime();
            const now = new Date(nowDate + 1 * 60 * 60 * 1000)
            const check = new Date(this.expirationDateESG);
            this.timeESG = check - now
            if (this.timeESG < 0) {
                this.showBidSubmitandValueESG = true
            }
            this.errorMessage = ""
        },

        timeFunctionTechnical() {
            let expirationDateTechnicals = this.RequisitionLinesTechnical.expirationDateTime
            let expireDateTechnical = new Date(expirationDateTechnicals).getTime();
            this.expirationDateTechnical = new Date(expireDateTechnical + 2 * 60 * 60 * 1000).toJSON()
            let invitationDatesTechnical = this.RequisitionLinesTechnical.invitationSentDateTime
            let inviteDateTechnical = new Date(invitationDatesTechnical).getTime();
            this.invitationDateTechnical = new Date(inviteDateTechnical + 2 * 60 * 60 * 1000).toJSON()
            this.showTimeTechnical = true
            this.disabled = true
            const nowDate = new Date().getTime();
            const now = new Date(nowDate + 1 * 60 * 60 * 1000)
            const check = new Date(this.expirationDateTechnical);
            this.timeTechnical = check - now
            if (this.timeTechnical < 0) {
                this.showBidSubmitandValueTechnical = true
            }
            this.errorMessage = ""
        },

        generatePDFLegal() {
            LegalDDRFQTemplate.exportPdfTemplate(this.companyOverview, this.projectDescription, this.scopeofWorkLegal, this.selectTimeLegal, this.selectTimeFrameworkLegal)
            this.showPreview = true
        },

        generatePDFESG() {
            ESGRFQTemplate.exportPdfTemplate(this.companyOverview, this.projectDescription, this.scopeofWorkESG, this.selectTimeESG, this.selectTimeFrameworkESG)
            this.showPreview = true
        },

        generatePDFTechnical() {
            TechnicalRFQTemplate.exportPdfTemplate(this.companyOverview, this.projectDescription, this.scopeofWorkTechnical, this.selectTimeTechnical, this.selectTimeFrameworkTechnical)
            this.showPreview = true
        },

        disableButtonsLegal() {
            if (this.nominatedBiddersLegal.length >= 1) {
                this.disablePreferredBidderBtnLegal = true
            }
            else {
                this.disablePreferredBidderBtnLegal = false
                this.disableResetBtnLegal = false
            }
        },

        disableButtonsESG() {
            if (this.nominatedBiddersESG.length >= 1) {
                this.disablePreferredBidderBtnESG = true
            }
            else {
                this.disablePreferredBidderBtnESG = false
                this.disableResetBtnESG = false
            }
        },

        disableButtonsTechnical() {
            if (this.nominatedBiddersTechnical.length >= 1) {
                this.disablePreferredBidderBtnTechnical = true

            }
            else {
                this.disablePreferredBidderBtnTechnical = false
                this.disableResetBtnTechnical = false
            }
        },

        async reviewQuotes(id) {
            this.showReviewQuotes = true
            this.id = id
            this.filteredbidderResponse
        },

        async uploadContractforWinner(id) {
            this.showUploadModal = true
            this.selectPurchContractBtnId = id
            this.selectPurchContractBtnId
        },

        async getBiddersQuoteLegal() {
            this.bidderResponseLegal = await requisitionsServices.getBiddersQuote(this.rfQNo, this.selectedServiceCategoryLineLegal)
            if (this.bidderResponseLegal.find(o => o.preferredWinner === "Preferred Winner")) {
                let bidderDets = this.bidderResponseLegal.find(o => o.preferredWinner === "Preferred Winner")
                this.WinnerbidderIdLegal = bidderDets.bidderId
                // this.SelectedWinnerbidderIdLegal 
                this.selectedBidResponseLegal = bidderDets.bidderId
                let bidders = await biddersService.getBidders()
                this.SelectedWinnerbidderIdLegal = (bidders.find(o => o.id === bidderDets.bidderId)).primaryEmailAddress
                this.SelectedWinnerbidderIdLegalName = (bidders.find(o => o.id === bidderDets.bidderId)).bidderName
                this.preferenceJustificationLegal = bidderDets.preferenceJustification
                this.negotiatedBidValueLegal = bidderDets.negotiatedBidValue
                this.disableJustificationLegal = true
                this.disableUploadContractLegal = false
                console.log(`WinnerbidderIdLegal ${ this.WinnerbidderIdLegal } `)

            }
            else {
                let bidderDets = this.bidderResponseLegal.find(o => o.autoRankWinner === "Winner")
                this.WinnerbidderIdLegal = bidderDets.bidderId
                let bidders = await biddersService.getBidders()
                this.SelectedWinnerbidderIdLegal = (bidders.find(o => o.id === bidderDets.bidderId)).primaryEmailAddress
                this.SelectedWinnerbidderIdLegalName = (bidders.find(o => o.id === bidderDets.bidderId)).bidderName
                this.disableUploadContractLegal = false
                console.log(`WinnerbidderIdLegal ${ this.WinnerbidderIdLegal } `)
            }
        },

        async getBiddersQuoteTechnical() {
            this.bidderResponseTechnical = await requisitionsServices.getBiddersQuote(this.rfQNo, this.selectedServiceCategoryLineTechnical)
            if (this.bidderResponseTechnical.find(o => o.preferredWinner === "Preferred Winner")) {
                let bidderDets = this.bidderResponseTechnical.find(o => o.preferredWinner === "Preferred Winner")
                this.WinnerbidderIdTechnical = bidderDets.bidderId
                this.selectedBidResponseTechnical = bidderDets.bidderId
                let bidders = await biddersService.getBidders()
                this.SelectedWinnerbidderIdTechnical = (bidders.find(o => o.id === bidderDets.bidderId)).primaryEmailAddress
                this.SelectedWinnerbidderIdTechnicalName = (bidders.find(o => o.id === bidderDets.bidderId)).bidderName
                this.preferenceJustificationTechnical = bidderDets.preferenceJustification
                this.negotiatedBidValueTechnical = bidderDets.negotiatedBidValue
                this.disableJustificationTechnical = true
                this.disableUploadContractTechnical = false
                console.log(`WinnerbidderIdTechnical ${ this.WinnerbidderIdTechnical } `)
            }
            else {
                let bidderDets = this.bidderResponseTechnical.find(o => o.autoRankWinner === "Winner")
                this.WinnerbidderIdTechnical = bidderDets.bidderId
                let bidders = await biddersService.getBidders()
                this.SelectedWinnerbidderIdTechnical = (bidders.find(o => o.id === bidderDets.bidderId)).primaryEmailAddress
                this.SelectedWinnerbidderIdTechnicalName = (bidders.find(o => o.id === bidderDets.bidderId)).bidderName
                this.disableUploadContractTechnical = false
                console.log(`WinnerbidderIdTechnical ${ this.WinnerbidderIdTechnical } `)
            }
        },

        async getBiddersQuoteESG() {
            this.bidderResponseESG = await requisitionsServices.getBiddersQuote(this.rfQNo, this.selectedServiceCategoryLineESG)
            if (this.bidderResponseESG.find(o => o.preferredWinner === "Preferred Winner")) {
                let bidderDets = this.bidderResponseESG.find(o => o.preferredWinner === "Preferred Winner")
                this.WinnerbidderIdESG = bidderDets.bidderId
                this.selectedBidResponseESG = bidderDets.bidderId
                let bidders = await biddersService.getBidders()
                this.SelectedWinnerbidderIdESG = (bidders.find(o => o.id === bidderDets.bidderId)).primaryEmailAddress
                this.SelectedWinnerbidderIdESGName = (bidders.find(o => o.id === bidderDets.bidderId)).bidderName
                this.preferenceJustificationESG = bidderDets.preferenceJustification
                this.negotiatedBidValueESG = bidderDets.negotiatedBidValue
                this.disableJustificationESG = true
                this.disableUploadContractESG = false
                console.log(`WinnerbidderIdESG ${ this.WinnerbidderIdESG } `)

            }
            else {
                let bidderDets = this.bidderResponseESG.find(o => o.autoRankWinner === "Winner")
                this.WinnerbidderIdESG = bidderDets.bidderId
                let bidders = await biddersService.getBidders()
                this.SelectedWinnerbidderIdESG = (bidders.find(o => o.id === bidderDets.bidderId)).primaryEmailAddress
                this.SelectedWinnerbidderIdESGName = (bidders.find(o => o.id === bidderDets.bidderId)).bidderName
                this.disableUploadContractESG = false
                console.log(`WinnerbidderIdESG ${ this.WinnerbidderIdESG } `)
            }
        },

        async selectasPreferredWinner() {
            if (this.id == 1) {
                let ps = await requisitionsServices.updatepreferredWinner(this.rfQNo, this.selectedServiceCategoryLineLegal, this.selectedBidResponseLegal, this.preferenceJustificationLegal, this.requestoremail, this.negotiatedBidValueLegal)
                setTimeout(async () => {
                    this.disableJustificationLegal = true
                    this.getBiddersQuoteLegal()
                }, 2000);
            }
            else if (this.id == 2) {
                let ps = await requisitionsServices.updatepreferredWinner(this.rfQNo, this.selectedServiceCategoryLineESG, this.selectedBidResponseESG, this.preferenceJustificationESG, this.requestoremail, this.negotiatedBidValueESG)
                setTimeout(async () => {
                    this.disableJustificationESG = true
                    this.getBiddersQuoteTechnical()
                }, 2000);
            }
            else if (this.id == 3) {
                let ps = await requisitionsServices.updatepreferredWinner(this.rfQNo, this.selectedServiceCategoryLineTechnical, this.selectedBidResponseTechnical, this.preferenceJustificationTechnical, this.requestoremail, this.negotiatedBidValueTechnical)
                setTimeout(async () => {
                    this.disableJustificationTechnical = true
                    this.getBiddersQuoteESG()
                }, 2000);
            }
        },

        clearInput() {
            this.example = ''
            this.contractUploadUrl = ''
            this.loadingUpload = false
        },

        clearModal() {
            this.errorMessageUpload = ''
            this.example = ''
            this.contractUploadUrl = ''
            this.showUploadModal = false
            this.loadingUpload = false
        },

        async notifyWinner() {
            if (this.id == 1) {
                await emailService.sendBidWinner(this.SelectedWinnerbidderIdLegal, this.SelectedWinnerbidderIdLegalName, `Notification of Bid won`, this.rfQNo, this.SelectedWinnerbidderIdLegalName, '', new Date().toJSON(), '', 'procurement@infracredit.ng', 'Procurement Team')
                await notificationServices.createNotification(this.SelectedWinnerbidderIdLegal, this.rfQNo, `You have Won ${ this.rfQNo }, please proceed to download contract`, "RFQ Winner Notification")
                this.showReviewQuotes = false
                toast.success("Winner Notified Succesfully");
            }
            else if (this.id == 2) {
                await emailService.sendBidWinner(this.SelectedWinnerbidderIdESG, this.SelectedWinnerbidderIdESGName, `Notification of Bid won`, this.rfQNo, this.SelectedWinnerbidderIdESGName, '', new Date().toJSON(), '', 'procurement@infracredit.ng', 'Procurement Team')
                await notificationServices.createNotification(this.SelectedWinnerbidderIdESG, this.rfQNo, `You have Won ${ this.rfQNo }, please proceed to download contract`, "RFQ Winner Notification")
                this.showReviewQuotes = false
                toast.success("Winner Notified Succesfully");
            }
            else if (this.id == 3) {
                await emailService.sendBidWinner(this.SelectedWinnerbidderIdTechnical, this.SelectedWinnerbidderIdTechnicalName, `Notification of Bid won`, this.rfQNo, this.SelectedWinnerbidderIdTechnicalName, '', new Date().toJSON(), '', 'procurement@infracredit.ng', 'Procurement Team')
                await notificationServices.createNotification(this.SelectedWinnerbidderIdTechnical, this.rfQNo, `You have Won ${ this.rfQNo }, please proceed to download contract`, "RFQ Winner Notification")
                this.showReviewQuotes = false
                toast.success("Winner Notified Succesfully");
            }
        },
        async notifyLosers() {
            let bidLosers = this.nominatedBiddersESG.filter(o => o.primaryEmailAddress !== this.SelectedWinnerbidderIdESG)
            let biddersServiceLineMap = bidLosers.map(({ bidderId, requisitionId, id, serviceCategoryLineId, bidSubmissionStatus, serviceCategoryId, documentFileName, resetStatus, lastModifiedDate, lastModifiedBy, createdDate, createdBy, comments, bidderName, bidValue, ...rest }) => ({ ...rest }))
            let bidderEmailfromSelectedbidders = biddersServiceLineMap.map(function (item) {
                return item.primaryEmailAddress;
            });
            let biddersServiceLineMapName = bidLosers.map(({ bidderId, requisitionId, id, serviceCategoryLineId, bidSubmissionStatus, serviceCategoryId, documentFileName, resetStatus, lastModifiedDate, lastModifiedBy, createdDate, createdBy, comments, bidValue, primaryEmailAddress, ...rest }) => ({ ...rest }))
            let bidderNamefromSelectedbidders = biddersServiceLineMapName.map(function (item) {
                return item.bidderName;
            });

            for (let i = 0; i < bidderEmailfromSelectedbidders.length; i++) {
                var sendnom = await emailService.sendBidLosers(bidderEmailfromSelectedbidders[i], bidderNamefromSelectedbidders[i], `Information on ${ this.rfQNo } Bid`, this.rfQNo, bidderNamefromSelectedbidders[i], '', new Date().toJSON(), '', 'procurement@infracredit.ng', 'Procurement Team')
            }
            if (sendnom) {
                toast.success("Unsuccessful Bidders Notified");
            }
        },
        async createWinnerPurchaseContract(id) {
            if (id == 1) {
                const subtype = await settingsService.getRFQSubTypes()
                const obj = subtype.filter(o => o.id == this.selectedRFQSubTypeLineLegal);
                const requisitionSubType = obj[0].description

                let ps = await purchaseContractService.createBiddersContracts(this.rfQNo, this.selectedServiceCategoryLineLegal, this.projectDescription, this.scopeofWorkLegal, this.WinnerbidderIdLegal, this.contractUploadUrl, this.contractNoteURL, this.requestoremail, this.negotiatedBidValueLegal, requisitionSubType, this.description)
                this.clearModal()
                this.contractIdLegal = ps.id
                if (ps) {
                    this.disableUploadContractLegal = true
                    toast.success(`Purchase Contract ${ this.contractIdLegalCreated } Succuessfully \nClick View to view Contract and Notify winner`);
                }
            }
            else if (id == 2) {
                const subtype = await settingsService.getRFQSubTypes()
                const obj = subtype.filter(o => o.id == this.selectedRFQSubTypeLineESG);
                const requisitionSubType = obj[0].description

                let ps = await purchaseContractService.createBiddersContracts(this.rfQNo, this.selectedServiceCategoryLineESG, this.projectDescription, this.scopeofWorkESG, this.WinnerbidderIdESG, this.contractUploadUrl, this.contractNoteURL, this.requestoremail, this.negotiatedBidValueESG, requisitionSubType, this.description)
                this.clearModal()
                this.contractIdESG = ps.id
                if (ps) {
                    this.disableUploadContractESG = true
                    toast.success(`Purchase contract ${ this.disableUploadContractESG } Succuessfully \nClick View to view Contract and Notify winner`);
                }
            }
            else if (id == 3) {
                const subtype = await settingsService.getRFQSubTypes()
                const obj = subtype.filter(o => o.id == this.selectedRFQSubTypeLineESG);
                const requisitionSubType = obj[0].description

                let ps = await purchaseContractService.createBiddersContracts(this.rfQNo, this.selectedServiceCategoryLineTechnical, this.projectDescription, this.scopeofWorkTechnical, this.WinnerbidderIdTechnical, this.contractUploadUrl, this.contractNoteURL, this.requestoremail, this.negotiatedBidValueTechnical, requisitionSubType, this.description)
                this.clearModal()
                this.contractIdTechnical = ps.id
                if (ps) {
                    this.disableUploadContractTechnical = true
                    toast.success(`Purchase contract ${ this.contractIdTechnical } Succuessfully \nClick View to view Contract and Notify winner`);
                }
            }
        },
        navigatetoNotification(id, type) {
            if (type == 'Bid Submission') {
                this.$router.push(`/ rfqedit / ${ id } `)
            }

            else if (type == 'Signed Contract Upload') {
                this.$router.push(`/ purchcontractdetails / ${ id } `)
            }
        },
        async completeRFQ() {
            let ps = await requisitionsServices.completeRequisition(this.requestoremail, this.rfQNo)
            let contractsM = await purchaseContractService.getContracts()
            this.purchcontracts = contractsM.filter(o => o.id === stores.contractNo)
            if (this.purchcontracts[0].status == 'Executed') {
                this.disableCompleteContract = true
            }
        },
        navigateContractLegal() {
            this.$router.push(`/ purchcontractdetails / ${ this.contractIdLegal } `)
        },

        navigateContractTechnical() {
            this.$router.push(`/ purchcontractdetails / ${ this.contractIdTechnical } `)
        },

        navigateContractESG() {
            this.$router.push(`/ purchcontractdetails / ${ this.contractIdESG } `)
        },

        downloadSupportingDocumentt(filename) {
            var link = document.createElement("a");
            link.download = "filename";
            link.target = "_blank";
            link.href = `https://eprocureapi.infracredit.ng/infraUpload/DownloadSupportDocument?filename=${filename}`
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
}
}
</script>


<style lang="scss" scoped>
.sandbox {
    margin: 20px 50px;
    font-family: 'Roboto';
}

.accordion-button:not(.collapsed) {
    color: inherit;
    background-color: #227CBF;
    color: white;
}

.accordion-button:not(.collapsed)::after {
    filter: brightness(0%) invert(100%);
}

.regularBtn {
    background-color: #47B65C;
    font-size: 12px;
    line-height: 20px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 8px 12px;
    border-radius: 6px;
    color: white;

    &:hover {
        background: #FFFFFF;
        color: #47B65C;
        border: 1px solid #47B65C;
    }
}

.fullpage2 {
    width: 100%;
    padding-top: 200px;
    background: #FAFAFB;
}

.topBotton_ {
    display: flex;
    width: 100%;
    gap: 7px;
    margin: 20px 0px;
    flex-direction: row;
    padding: 20px 20px 0px 0px;
}

.topBotton_2 {
    display: flex;
    width: 100%;
    gap: 7px;
    flex-direction: column;
    padding: 20px 20px 0px 0px;
}

.topBotton2_ {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 7px;
    padding: 20px 20px 0px 0px;
    justify-content: center;
}

input {
    width: 100vw;
}

input:disabled {
    background: #dddddd;
}

textarea:disabled {
    background: #dddddd;
}

.main_1 {
    width: 830px;
    min-width: 100%;
    height: 830px;
    overflow: auto;
}

.reviewQuoteTable {
    margin-left: 10px;
}

.topButton1_ {
    font-size: 12px;
    height: 20px;
    border-radius: 10px;
    font-weight: 300;
    width: 121px;
    justify-content: center;
    padding: 15px;
    background: #FFFFFF;
    border: 1px solid #227CBF;
    font-family: Roboto;
    color: #227CBF;
}

.topButton785_ {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px;
    width: 18vw;
    height: 40px;
    background: #FFFFFF;
    border: 1px solid #227CBF;
    border-radius: 50px;
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 0.85rem;
    color: #227CBF;
}

.topButtonU_ {
    width: 18vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px;
    height: 40px;
    background: #FFFFFF;
    border: 1px solid #227CBF;
    border-radius: 50px;
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 0.85rem;
    color: #227CBF;
}

.topButton785_:hover,
.topButton1_:hover,
.topButtonU_:hover {
    background-color: #47B65C;
    color: #FFFFFF;
    border: none;
}

button:hover {
    cursor: pointer;
}

button:disabled,
button:disabled:hover {
    background-color: #afafaf;
    color: #000000;
    border: none;
    cursor: context-menu;
}

.general_ {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
}


.Rfq_ {
    align-items: flex-start;
    padding-top: 20px;
    width: 100%;
}

.rfqtableHeader_ {
    padding: 10px 20px;
    width: 100%;
    background: #FFFFFF;
    align-items: center;
    display: grid;
    grid-template-columns: 1fr 2.5fr 1fr 1fr;
    grid-gap: 80px;
    width: 100%;
    color: black
}

.rfqtableHeader2_ {
    padding: 10px 10px;
    width: 100%;
    color: #000000;
    background: #FFFFFF;
    align-items: center;
    display: grid;
    grid-template-columns: 0.8fr 1.5fr 0.9fr 0.7fr 1.5fr 1.2fr;
    grid-gap: 0px;
}

.tableHeader_ {
    display: flex;
    flex-direction: row;
    gap: 5px;
}

.sortIcon_ {
    cursor: pointer;
}

.tableHeadertext_ {
    font-family: Roboto;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    margin-bottom: 0px;
    color: #808080;
    text-align: left;
}

.tablerowtext1_ {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    width: 100%;
    font-size: 16px;
    line-height: 19px;
    margin-left: 20px;
    margin-bottom: 0px;
    color: #000000;
    text-align: left;
}

.tablerowtext_ {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    margin-bottom: 0px;
    width: 100%;
    font-size: 16px;
    line-height: 19px;
    color: #000000;
    text-align: left;
}

.textarea_ {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    gap: 71px;
    width: 100%;
    height: 100px;
    border: 0.5px solid #808080;
    border-radius: 5px;
    resize: none;
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
    height: 240px !important;
    border: 0.5px solid #808080;
    border-radius: 5px;
}

.textarea23_ {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px;
    gap: 71px;
    margin-left: 10px;
    width: 55rem;
    resize: none;
    height: 115px;
    border: 0.5px solid #808080;
    border-radius: 5px;
}

.table {
    border-spacing: 40px;
}

.justifcationHeader {
    color: black;
    margin: 10px auto -5px auto;
    font-weight: bold;
    font-size: 18px;
    font-family: "Roboto";
}

.justifcationSubHeader {
    color: black;
    margin: 0px auto;
    font-weight: bold;
    font-size: 14px;
    display: flex;
    flex-direction: row;
    gap: 15px;
}

.justifcationSubHeader p {
    margin-top: 8px;
    font-family: "Roboto";

}

.justificationLine {
    color: black;
    margin: 0px auto;
    font-weight: 300;
    font-size: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    vertical-align: middle;
}

.justificationLine p {
    font-family: "Roboto";
    margin: 0px auto -8px auto;
    font-weight: 450;
    align-items: center;
    justify-content: center;
    justify-items: center;
    font-size: 15px;
}

.justificationButton {
    margin: 0px auto;
    font-weight: bold;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    gap: 15px;
}

.rfqstatus_,
.rfqstatus_1,
.rfqstatus3_ {
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

.rfqstatus3_ {
    width: 193px;
}

.headerBox {
    flex-direction: row;
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 130px;
}

.rfqstatus_,
.rfqstatus3_ {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    background-image: url('../../assets/images/arrow_right.svg');
    background-repeat: no-repeat;
    background-position-x: 96%;
    background-position-y: 13px;
}

.rfqstatus_1 {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: transparent;
    background-repeat: no-repeat;
    background-position-x: 96%;
    background-position-y: 13px;
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

.ckeditor {
    margin-top: -15px;
    width: 100% !important;
    min-height: 200px !important;
    max-width: 42vw !important;
}

.ckeditor2 {
    width: 100% !important;
    min-height: 100px !important;
    max-width: 27vw !important;
}

.document-editor__toolbar1,
.document-editor__toolbar2,
.document-editor__toolbar3,
.document-editor__toolbar4,
.document-editor__toolbar5 {
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

.ckeditor2:disabled {
    background: #bfbfbf;
}

.generalInput73_ {
    box-sizing: border-box;
    align-items: center;
    padding: 10px;
    gap: 71px;
    width: 15rem;
    height: 35px;
    border: 0.5px solid #000000;
    border-radius: 5px;
    margin-left: 10px;
    font-family: 'Roboto';
    font-weight: 300;
    font-size: 12px;
    line-height: 14px;
    color: #000000;
}

.generalInput234_ p {
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 1.1vw;
    margin-bottom: 0px;
}

.generalInput234_ input {
    align-items: center;
    padding: 10px;
    height: 35px;
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 1vw;
    border-radius: 10px;
    background-color: #47B65C !important;
    width: 9vw;
    line-height: 14px;
    color: white;
}

.generalInput235_,
.generalInput236 {
    margin-top: -20px;
}

.generalInput235_ p {
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 1.1vw;
    margin-bottom: 0px;
}

.generalInput235_ input {
    align-items: center;
    padding: 10px;
    height: 35px;
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 1vw;
    border-radius: 10px;
    background-color: #FF0000 !important;
    width: 8vw;
    line-height: 14px;
    color: white;
}


.generalInput236 p {
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 1.1vw;
    margin-bottom: 0px;
}

.generalInput236 input {
    align-items: center;
    padding: 10px;
    height: 35px;
    font-family: 'Roboto';
    font-weight: 400;
    font-size: 1vw;
    border-radius: 10px;
    background-color: #FFBF00 !important;
    width: 9vw;
    line-height: 14px;
    color: white;
}

.generalInput213_ textarea {
    width: 27.3vw;
}

.generalInput213_ {
    margin-bottom: 10px;
}

.general2_ {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
    width: 100%;
}

button .legal_ {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    padding: 10px 0px 10px 0px;
}

.checkboxDiv {
    border: 1px solid black;
    height: 250px;
    overflow-y: scroll;
    padding: 10px;
}

.v-checkbox {
    margin-top: -5px !important;
    margin-bottom: -30px !important;
}

.fileUploaded {
    display: flex;
    flex-direction: row;
    gap: 12px;
}

.bidderlist6_ {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 5px;
}

.legalTop_ {
    width: 100%;
    display: grid;
    grid-template-columns: 1.3fr 1fr 1fr;
    grid-gap: 10px;
}

.legalTop_ p {
    color: black
}

.lineTop_ {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 5px;
    width: 300px;
    height: 120px;
}

.breadcrumbs_ {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 10px;
    width: 100%;
    height: 15px;
}

.breadcrumbs_ p {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 14px;
    color: #808080;
    margin-bottom: 0px;
}

.category785_ {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    margin: 0px auto;
}

.category785_ p {
    margin-bottom: -10px;
    color: black
}

.frame12348_ {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 22vw;
}

.frame12349_ {
    display: flex;
    flex-direction: row;
    gap: 20px;
    width: 22vw;
}

.category785_ input {
    align-items: center;
    padding: 10px;
    height: 40px;
    border: 0.5px solid #000000;
    border-radius: 5px;
    width: 22vw;
}

.category785_ select {
    width: 17vw;
    border: 1px #000000 solid;
}

.tableV_ {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: -20px;
    gap: 10px;
    width: 100%;
    border-bottom: 2px solid #FAFAFB;
}

.tableV_ p {
    margin-bottom: 0px;
}

.tableV_ h3 {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;
    margin-left: -15px;
    color: #47B65C;
}

.paginationButtons {
    justify-content: flex-end;
    align-self: flex-end;
    padding: 20px;
    display: flex;
    margin-right: 45px;
    margin-top: -30px;
}

.paginationButton {
    background-color: #FFFFFF;
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

.modal_ {
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

.modal5,
.modal6 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px;
    gap: 20px;
    position: relative;
    width: 640px;
    height: 512.81px;
    background: #FAFAFB;
    border-radius: 10px;
}

.modal4 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 30px 30px 30px;
    gap: 20px;
    position: relative;
    width: 980px;
    height: 582.81px;
    background: #FAFAFB;
    border-radius: 10px;
}

.modal5 {
    width: 840px;
    height: 612.81px;
}

.modal6 {
    width: 840px;
    height: 650.81px;
}

.frame_ {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 890px;
    height: 69px;
}

.frame_ h3 {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 29px;
    color: #47B65C;
    margin-bottom: 0px;
}

.frame_ p {
    font-family: Roboto;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    margin-bottom: 0px;
    color: #47B65C;
}

.tableframe_ {
    display: flex;
    overflow-y: scroll;
    flex-direction: column;
    align-items: flex-start;
    padding: 5px 0px 0px 0px;
    gap: 20px;
    width: 920px;
    height: 295.81px;
    background: #FFFFFF;
    overflow: auto;
    border-radius: 10px;
}

.midsect_ {
    width: 100%;
}

.headerBox input {
    align-items: center;
    border: 1px #000000 solid;
    padding: 0px 20px;
    width: 100%;
    height: 40px;
}

.midsect_ h3 {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 29px;
    text-align: center;
    color: #282828;
}

.headerBox h4 {
    margin-top: 5px;
    font-size: 20px;
    width: 100%
}

.modal_ img {
    margin-top: 5px;
}

.bidderlist_ {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;
    width: 410px;
    height: 75px;
    margin: 5px auto;
}

.bidderlist_ label {
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    text-align: center;
    line-height: 24px;
    color: #000000;
}

select {
    border: 5px yellow solid;

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

.modals5_ {
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    width: 553.49px;
    border-radius: 10px;
    height: 230px;
}

.modals63_ {
    width: 853.49px;
    height: 480px;
    background-color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
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
    background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%) !important;
    transition: 0.7s;
}

.loginBtn_ {
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
    color: white !important;
}

.topBotton31_ {
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 7px;
    flex-direction: row;
    padding: 20px 20px 0px 0px;
}

.topBotton4_ {
    display: flex;
    width: 100%;
    justify-content: center;
    gap: 7px;
    flex-direction: row;
    padding-top: 10px;
}


@media (max-width: 1251px) {
    .frame12348_ {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 19vw;
    }
}

@media (max-width: 1050px) {
    .frame12348_ {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 22vw;
    }
}

@media (max-width: 857px) {
    .topButtonU_ {
        width: 12rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 15px;
        height: 40px;
        background: #FFFFFF;
        border: 1px solid #227CBF;
        border-radius: 50px;
        font-family: 'Roboto';
        font-size: 1.5vw;
        font-weight: 400;
        color: #227CBF;
    }
}
</style>