import axios from 'axios'
import config from '../config/index';


const sendBidInvitation = axios.create({
    baseURL: `${config.apiurl}/emails/sendBIdInvitation`,
    json: true,
    method: 'POST'
})

const sendBidLoser = axios.create({
    baseURL: `${config.apiurl}/emails/sendLosersNotification`,
    json: true,
    method: 'POST'
})

const sendBidSubmit = axios.create({
    baseURL: `${config.apiurl}/emails/sendBidSubmission`,
    json: true,
    method: 'POST'
})

const sendBidWinners = axios.create({
    baseURL: `${config.apiurl}/emails/sendBidWinner`,
    json: true,
    method: 'POST'
})


const sendContractSignatures = axios.create({
    baseURL: `${config.apiurl}/emails/sendContractSignature`,
    json: true,
    method: 'POST'
})

const sendSignedContractUploads = axios.create({
    baseURL: `${config.apiurl}/emails/sendSignedContractUpload`,
    json: true,
    method: 'POST'
})


const sendExecutedContractUploads = axios.create({
    baseURL: `${config.apiurl}/emails/sendExecutedContractUpload`,
    json: true,
    method: 'POST'
})

const sendBidderOnboardings = axios.create({
    baseURL: `${config.apiurl}/emails/sendBidderOnboarding`,
    json: true,
    method: 'POST'
})

const sendUserOnboardings = axios.create({
    baseURL: `${config.apiurl}/emails/sendUserOnboarding`,
    json: true,
    method: 'POST'
})
export default {
    async sendBidInvite(RecipientEmailAddress, RecipientName, Subject, rfqId, bidderName, rfqDescription, rfqExpirationDateTime, contractNo, ccEmailAddress1, ccName1, ccEmailAddress2, ccEmailAddress3, ccEmailAddress4) {
            return sendBidInvitation({
            data: {
                RecipientEmailAddress: RecipientEmailAddress,
                RecipientName: RecipientName,
                Subject: Subject,
                rfqId: rfqId,
                bidderName: bidderName,
                rfqDescription: rfqDescription,
                rfqExpirationDateTime: rfqExpirationDateTime,
                contractNo: contractNo,
                ccAddresses: [{
                    ccEmail: ccEmailAddress1,
                    ccName: ccName1
                },
                {
                    ccEmail: ccEmailAddress2,
                    ccName: RecipientName
                },
                {
                    ccEmail: ccEmailAddress3,
                    ccName: RecipientName
                },
                {
                    ccEmail: ccEmailAddress4,
                    ccName: RecipientName
                }]
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
    },


    async sendBidLosers(RecipientEmailAddress, RecipientName, Subject, rfqId, bidderName, rfqDescription, rfqExpirationDateTime, contractNo, ccEmailAddress, ccName) {
        return sendBidLoser({
           data: {
               RecipientEmailAddress: RecipientEmailAddress,
               RecipientName: RecipientName,
               Subject: Subject,
               rfqId: rfqId,
               bidderName: bidderName,
               rfqDescription: rfqDescription,
               rfqExpirationDateTime: rfqExpirationDateTime,
               contractNo: contractNo,
               ccAddresses: [{
                   ccEmail: ccEmailAddress,
                   ccName: ccName
               }]
           },
       }).then(req => {
           return req.data
       }).catch(err => console.log(err))
   },


    async sendBidSubmission(RecipientEmailAddress, RecipientName, Subject, rfqId, bidderName, rfqDescription, rfqExpirationDateTime, contractNo, ccEmailAddress, ccName) {
        return sendBidSubmit({
            data: {
                RecipientEmailAddress: RecipientEmailAddress,
                RecipientName: RecipientName,
                Subject: Subject,
                rfqId: rfqId,
                bidderName: bidderName,
                rfqDescription: rfqDescription,
                rfqExpirationDateTime: rfqExpirationDateTime,
                contractNo: contractNo,
                ccAddresses: [{
                    ccEmail: ccEmailAddress,
                    ccName: ccName
                }]
                },
        }).then(req => {
            console.log(req.status)
            return req.data
        }).catch(err => console.log(err))
    },


    async sendBidWinner(RecipientEmailAddress, RecipientName, Subject, rfqId, bidderName, rfqDescription, rfqExpirationDateTime, contractNo, ccAddress, ccName) {
            return sendBidWinners({
            data: {
                RecipientEmailAddress: RecipientEmailAddress,
                RecipientName: RecipientName,
                Subject: Subject,
                rfqId: rfqId,
                bidderName: bidderName,
                rfqDescription: rfqDescription,
                rfqExpirationDateTime: rfqExpirationDateTime,
                contractNo: contractNo,
                ccAddresses: [{
                    ccEmail: ccAddress,
                    ccName: ccName
                }]
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
    },


    async sendContractSignature(RecipientEmailAddress, RecipientName, Subject, rfqId, bidderName, rfqDescription, rfqExpirationDateTime, contractNo, ccEmailAddress, ccName) {
        return sendContractSignatures({
            data: {
                RecipientEmailAddress: RecipientEmailAddress,
                RecipientName: RecipientName,
                Subject: Subject,
                rfqId: rfqId,
                bidderName: bidderName,
                rfqDescription: rfqDescription,
                rfqExpirationDateTime: rfqExpirationDateTime,
                contractNo: contractNo,
                ccAddresses: [{
                    ccEmail: ccEmailAddress,
                    ccName: ccName
                }]
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
    },


    async sendSignedContractUpload(RecipientEmailAddress, RecipientName, Subject, rfqId, bidderName, rfqDescription, rfqExpirationDateTime, contractNo, ccEmailAddress, ccName) {
        return sendSignedContractUploads({
            data: {
                RecipientEmailAddress: RecipientEmailAddress,
                RecipientName: RecipientName,
                Subject: Subject,
                rfqId: rfqId,
                bidderName: bidderName,
                rfqDescription: rfqDescription,
                rfqExpirationDateTime: rfqExpirationDateTime,
                contractNo: contractNo,
                ccAddresses: [{
                    ccEmail: ccEmailAddress,
                    ccName: ccName
                }]
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
    },

    async sendExecutedContractUpload(RecipientEmailAddress, RecipientName, Subject, rfqId, bidderName, rfqDescription, rfqExpirationDateTime, contractNo, ccEmailAddress, ccName) {
        return sendExecutedContractUploads({
            data: {
                RecipientEmailAddress: RecipientEmailAddress,
                RecipientName: RecipientName,
                Subject: Subject,
                rfqId: rfqId,
                bidderName: bidderName,
                rfqDescription: rfqDescription,
                rfqExpirationDateTime: rfqExpirationDateTime,
                contractNo: contractNo,
                ccAddresses: [{
                    ccEmail: ccEmailAddress,
                    ccName: ccName
                }]
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
    },

    async sendBidderOnboarding(RecipientEmailAddress, RecipientName, Subject) {
        return sendBidderOnboardings({
            data: {
                EmailAddress: RecipientEmailAddress,
                BidderName: RecipientName,
                Subject: Subject,
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
    },

    async sendUserOnboarding(RecipientEmailAddress, RecipientName, Subject, rfqId, bidderName, rfqDescription, rfqExpirationDateTime, contractNo, ccEmailAddress, ccName) {
        return sendUserOnboardings({
            data: {
                RecipientEmailAddress: RecipientEmailAddress,
                RecipientName: RecipientName,
                Subject: Subject,
                rfqId: rfqId,
                bidderName: bidderName,
                rfqDescription: rfqDescription,
                rfqExpirationDateTime: rfqExpirationDateTime,
                contractNo: contractNo,
                ccAddresses: [{
                    ccEmail: ccEmailAddress,
                    ccName: ccName
                }]
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
    },
}