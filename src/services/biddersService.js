import axios from 'axios'
import config from '../config/index';


const createBidder = axios.create({
    baseURL: `${config.apiurl}/bidders/createBidderWithServiceCategories`,
    json: true,
    method: 'POST'
})


export default {
    async createBidders(bidderNumber, bidderTINNumber, bidderName, dateModified, bidderStatus, address1, bidderCity, bidderState, contactPerson, bidderPhoneNumber, bidderEmail, selectedPaymentType, selectedServiceType, selected, alternativeEmail1, alternativeEmail2, alternativeEmail3) {
        return createBidder({
            data: {
                id: bidderNumber,
                bidderName: bidderName,
                address: address1,
                city: bidderCity,
                postalCode: "",
                stateId: bidderState,
                countryId: "",
                contactName: contactPerson,
                primaryContactNumber: bidderPhoneNumber,
                primaryEmailAddress: bidderEmail,
                tinNumber: bidderTINNumber,
                paymentTermId: selectedPaymentType,
                serviceCategoryId: selectedServiceType,
                createdBy: bidderEmail,
                lastModifiedBy: dateModified,
                createdDate: new Date().getDates,
                lastModifiedDate: dateModified,
                ServiceCategoryLineId: selected,
                alternativeEmail1: alternativeEmail1,
                alternativeEmail2: alternativeEmail2,
                alternativeEmail3: alternativeEmail3
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
            ;

    },


    async getBidders() {
        try {
            let response = await fetch(`${config.apiurl}/bidders/getbidders`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async editBidders(bidderNumber, bidderTINNumber, bidderName, dateModified, bidderStatus, address1, bidderCity, bidderState, contactPerson, bidderPhoneNumber, bidderEmail, selectedPaymentType, selectedServiceType, selected, alternativeEmail1, alternativeEmail2, alternativeEmail3) {
        fetch(`${config.apiurl}/bidders/editBidders/?id=${bidderNumber}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: bidderNumber,
                bidderName: bidderName,
                address: address1,
                city: bidderCity,
                postalCode: " ",
                stateId: bidderState,
                countryId: " ",
                contactName: contactPerson,
                primaryContactNumber: bidderPhoneNumber,
                primaryEmailAddress: bidderEmail,
                tinNumber: bidderTINNumber,
                paymentTermId: selectedPaymentType,
                serviceCategoryId: selectedServiceType,
                createdBy: bidderEmail,
                lastModifiedBy: bidderEmail,
                lastModifiedDate: dateModified,
                ServiceCategoryLineId: selected,
                alternativeEmail1: alternativeEmail1,
                alternativeEmail2: alternativeEmail2,
                alternativeEmail3: alternativeEmail3
            })
        })
            .then(response => {
                response.json()
            }).catch(error => console.log(error))
    },

    async getBiddersbyServiceCategoryid(id) {
        try {
            let response = await fetch(`${config.apiurl}/bidders/getbiddersbyservicecategoryid/${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },


    async getBiddersbyServiceCategoryLineId(id) {
        try {
            let response = await fetch(`${config.apiurl}/bidders/getbidderbyservicecategorylineid/${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async getBiddersWithPerformanceScoresbyServiceCategoryLineId(id) {
        try {
            let response = await fetch(`${config.apiurl}/bidders/getBiddersWithPerformanceScoresbyServiceCategoryLineId/${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },


    async deleteBidders(id) {
        try {
            let response = await fetch(`${config.apiurl}/bidders/deletebidders/${id}`, { method: 'DELETE' });
            this.posts = response.status;
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async getServiceLine(id) {
        try {
            let response = await fetch(`${config.apiurl}/bidders/getBidderServiceCategoryLines/${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }

    },

    async getBidderRequisitionsById(id) {
        try {
            let response = await fetch(`${config.apiurl}/bidders/getBidderRequisitionsById/${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async editBidValues(requisitionId, bidderId, bidValue, comments, lastModifiedDate, documentFileName, bidderContactPersonName, bidderContactPersonEmail, bidderContactPersonPhone) {
        fetch(`${config.apiurl}/bidders/editBidValues`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requisitionId: requisitionId,
                bidderId: bidderId,
                bidValue: bidValue,
                comments: comments,
                lastModifiedBy: lastModifiedDate,
                documentFileName: documentFileName,
                bidderContactPersonName: bidderContactPersonName,
                bidderContactPersonEmail: bidderContactPersonEmail,
                bidderContactPersonPhone: bidderContactPersonPhone
            }),
        }).then(response => { return response.status })
    },
}