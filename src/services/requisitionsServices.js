import axios from 'axios'
import config from '../config/index';

const createRequisition = axios.create({
  baseURL: `${config.apiurl}/requisitions/createrequisitions`,
  json: true,
  method: 'POST'
})

const createAllLineBidder = axios.create({
  baseURL: `${config.apiurl}/requisitions/createRequisitionLineAllBidders`,
  json: true,
  method: 'POST'
})

const createSelectedLineBidder = axios.create({
  baseURL: `${config.apiurl}/requisitions/createRequisitionSelectedBidders`,
  json: true,
  method: 'POST'
})

const createRequisitionLine = axios.create({
  baseURL: `${config.apiurl}/requisitions/createRequisitionLines`,
  json: true,
  method: 'POST'
})

const createResetRequisitionLineBidderStatus = axios.create({
  baseURL: `${config.apiurl}/requisitions/createResetRequisitionLineBidderStatus`,
  json: true,
  method: 'POST'
})

const sendRFQToNominatedBidder = axios.create({
  baseURL: `${config.apiurl}/requisitions/sendFRQToNominatedBidders`,
  json: true,
  method: 'POST'
})

const updatepreferredWinners = axios.create({
  baseURL: `${config.apiurl}/requisitions/updatePreferredWinner`,
  json: true,
  method: 'POST'
})

const getBiddersQuotes = axios.create({
  baseURL: `${config.apiurl}/requisitions/getbiddersquotes`,
  json: true,
  method: 'POST'
})

const completeRequisitionD = axios.create({
  baseURL: `${config.apiurl}/requisitions/completeRequisition`,
  json: true,
  method: 'POST'
})

export default {

  async createRequisitions(requisitionDate, requestedBy, description, departmentId, businessUnitId, companyOverview, projectDescription, createdBy, createdDate) {
    return createRequisition({
      data: {
        requisitionDate: requisitionDate,
        requestedBy: requestedBy,
        description: description,
        departmentId: departmentId,
        businessUnitId: businessUnitId,
        companyOverview: companyOverview,
        projectDescription: projectDescription,
        createdBy: createdBy,
        createdDate: createdDate
      },
    }).then(req => {
      console.log(req.status)
      return req.data
    }).catch(err => console.log(err))
  },


  async createRequisitionLines(requisitionId, serviceCategoryId, ScopeOfWork, expirationDuration, ExpirationDurationUnit, createdBy) {
    return createRequisitionLine({
      data: {
        RequisitionId: requisitionId,
        ServiceCategoryId: serviceCategoryId,
        ScopeOfWork: ScopeOfWork,
        ExpirationDuration: expirationDuration,
        ExpirationDurationUnit: ExpirationDurationUnit,
        CreatedBy: createdBy,
      },
    }).then(req => {
      console.log(req.status)
      return req.data
    }).catch(err => console.log(err))
  },


  async createRequisitionLineAllBidders(createdBy, requisitionId, serviceCategoryLineId) {
    return createAllLineBidder({
      data: {
        CreatedBy: createdBy,
        RequisitionId: requisitionId,
        serviceCategoryLineId: serviceCategoryLineId,
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },


  async createSelectedLineBidders(requisitionId, serviceCategoryLineId, createdBy, bidderId) {
    return createSelectedLineBidder({
      data: {
        CreatedBy: createdBy,
        RequisitionId: requisitionId,
        bidderId: bidderId,
        serviceCategoryLineId: serviceCategoryLineId,
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },


  async completeRequisition(ModifiedBy, RequisitionId) {
    return completeRequisitionD({
      data: {
        ModifiedBy: ModifiedBy,
        RequisitionId: RequisitionId
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },

  async createResetRequisitionLinesBidderStatus(requisitionId, serviceCategoryLineId) {
    return createResetRequisitionLineBidderStatus({
      data: {
        RequisitionId: requisitionId,
        serviceCategoryLineId: serviceCategoryLineId,
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },


  async sendRFQToNominatedBidders(requisitionId, serviceCategoryLineId, modifiedBy) {
    return sendRFQToNominatedBidder({
      data: {
        requisitionId: requisitionId,
        serviceCategoryId: serviceCategoryLineId,
        modifiedBy: modifiedBy,
      },
    }).then(req => {
      return req.status
    }).catch(err => console.log(err))
  },

  async deleteRfq(id) {
    try {
        let response = await fetch(`${config.apiurl}/requisitions/deleteRequisition/${id}`, { method: 'DELETE' });
        this.posts = response.status;
        return this.posts
    } catch (error) {
        console.log(error)
    }
},
  async getBiddersQuote(requisitionId, serviceCategoryLineId) {
    return getBiddersQuotes({
      data: {
        requisitionId: requisitionId,
        ServiceCategoryLineId: serviceCategoryLineId,
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },

  async updateRequisitionLine(requisitionId, serviceCategoryId, scopeOfWork, expirationDuration, expirationDurationUnit, modifiedBy, serviceCategoryLineId, rfqType, rfqSubType) {
    fetch(`${config.apiurl}/requisitions/updaterequisitionlines`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requisitionId: requisitionId,
        serviceCategoryId: serviceCategoryId,
        scopeOfWork: scopeOfWork,
        expirationDuration: expirationDuration,
        expirationDurationUnit: expirationDurationUnit,
        modifiedBy: modifiedBy,
        modifiedDate: new Date().toJSON(),
        serviceCategoryLineId: serviceCategoryLineId,
        rfqType: rfqType,
        rfqSubType: rfqSubType,
      })
    })
      .then(response => {
        response.json()
      })
  },


  async updateRequisition(modifiedBy, description, requisitionId, companyOverview, projectDescription) {
    fetch(`${config.apiurl}/requisitions/updateRequisitions`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        modifiedBy: modifiedBy,
        description: description,
        requisitionId: requisitionId,
        companyOverview: companyOverview,
        projectDescription: projectDescription,
      })
    })
      .then(response => {
        response.json()
      })
  },

  async getRequisitions() {
    try {
      let response = await fetch(`${config.apiurl}/Requisitions/`);
      this.posts = await response.json();
      return this.posts
    } catch (error) {
      console.log(error)
    }
  },


  async getRequisitionBiddersbyRfqId(id) {
    try {
      let response = await fetch(`${config.apiurl}/requisitions/getrequisitionbiddersbyreqid/${id}`);
      this.posts = await response.json();
      return this.posts
    } catch (error) {
      console.log(error)
    }
  },

  async getRequisitionLinesbyReqid(id) {
    try {
      let response = await fetch(`${config.apiurl}/requisitions/getrequisitionlinesbyreqid/${id}`);
      this.posts = await response.json();
      return this.posts
    } catch (error) {
      console.log(error)
    }
  },


  async getRequisitionsbyId(id) {
    try {
      let response = await fetch(`${config.apiurl}/Requisitionsbyid/${id}`);
      this.posts = await response.json();
      return this.posts
    } catch (error) {
      console.log(error)
    }
  },

  async updatepreferredWinner(requisitionId, serviceCategoryLineId, bidderId, preferenceJustification, preferenceSubmittedUserId, negotiatedBidValue) {
    return updatepreferredWinners({
      data: {
        requisitionId: requisitionId,
        serviceCategoryLineId: serviceCategoryLineId,
        bidderId: bidderId,
        preferenceJustification: preferenceJustification,
        PreferenceSubmitedUserId: preferenceSubmittedUserId,
        NegotiatedBidValue: negotiatedBidValue, 
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },

}