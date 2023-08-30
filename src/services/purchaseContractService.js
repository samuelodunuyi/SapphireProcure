import axios from 'axios'
import config from '../config/index';

const createBiddersContract = axios.create({
  baseURL: `${config.apiurl}/contracts/createBiddersContracts`,
  json: true,
  method: 'POST'
})
//remove s for both below
const uploadSignedContractBid = axios.create({
  baseURL: `${config.apiurl}/Contracts/uploadSignedContract`,
  json: true,
  method: 'POST'
})

const uploadFullySignedContractBid = axios.create({
  baseURL: `${config.apiurl}/Contracts/uploadExecutedContract`,
  json: true,
  method: 'POST'
})

const requestBidderSignContact = axios.create({
  baseURL: `${config.apiurl}/Contracts/requestBidderToSignContact`,
  json: true,
  method: 'POST'
})

const createBidContractComment = axios.create({
  baseURL: `${config.apiurl}/Contracts/createBidContractComment`,
  json: true,
  method: 'POST'
})

export default {

  async createBiddersContracts(requisitionId, serviceCategoryLineId, projectDescription, scopeOfWork, bidderId, contractFileURL, contractNoteURL, createdBy, negotiatedBidValue, requisitionSubType, projectShortDescription) {
    return createBiddersContract({
      data: {
        requisitionId: requisitionId,
        serviceCategoryLineId: serviceCategoryLineId,
        projectDescription: projectDescription,
        scopeOfWork: scopeOfWork,
        bidderId: bidderId,
        contractFileURL: contractFileURL,
        contractNoteURL: contractNoteURL,
        createdBy: createdBy,
        NegotiatedBidValue: negotiatedBidValue,
        requisitionSubType: requisitionSubType,
        projectShortDescription: projectShortDescription
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },
  async createBidContractComments(bidContractId, commentDetails, createdBy, creationDateTime, lastModifiedBy, lastModifiedDateTime) {
    return createBidContractComment({
      data: {
        bidContractId: bidContractId,
        commentDetails: commentDetails,
        createdBy: createdBy,
        creationDateTime: creationDateTime,
        lastModifiedBy: lastModifiedBy,
        lastModifiedDateTime: lastModifiedDateTime
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },
  async uploadSignedContractBidder(contractId, contractDocURL, LastModifiedBy) {
    return uploadSignedContractBid({
      data: {
        contractId: contractId,
        contractDocURL: contractDocURL,
        LastModifiedBy: LastModifiedBy
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },

  async uploadFullySignedContract(contractId, contractDocURL, LastModifiedBy) {
    return uploadFullySignedContractBid({
      data: {
        contractId: contractId,
        contractDocURL: contractDocURL,
        LastModifiedBy: LastModifiedBy
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },

  async requestBidderToSignContact(BidderId, ContractId) {
    return requestBidderSignContact({
      data: {
        BidderId: BidderId,
        ContractId: ContractId,
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },


  async getContracts() {
    try {
      let response = await fetch(`${config.apiurl}/Contracts`);
      this.posts = await response.json();
      return this.posts
    } catch (error) {
      console.log(error)
    }
  },

  async getBidContractComments(id) {
    try {
      let response = await fetch(`${config.apiurl}/Contracts/getBidContractComments/${id}`);
      this.posts = await response.json();
      return this.posts
    } catch (error) {
      console.log(error)
    }
  },
  async deleteBiddersComment(id) {
    try {
      let response = await fetch(`${config.apiurl}/Contracts/deleteBidContractComment/${id}`, { method: 'DELETE' });
      this.posts = response.status;
      return this.posts
    } catch (error) {
      console.log(error)
    }
  },
  async editBidContractComments(id, bidContractId, commentDetails, createdBy, creationDateTime, lastModifiedBy, lastModifiedDateTime) {
    fetch(`${config.apiurl}/Contracts/editBidContractComments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        bidContractId: bidContractId,
        commentDetails: commentDetails,
        createdBy: createdBy,
        creationDateTime: creationDateTime,
        lastModifiedBy: lastModifiedBy,
        lastModifiedDateTime: lastModifiedDateTime
      })
    })
      .then(response => {
        response.json()
      })
  },
}