import axios from 'axios'
import config from '../config/index';


const createBidderPerformance = axios.create({
  baseURL: `${config.apiurl}/ratings/createbidderperformances`,
  json: true,
  method: 'POST'
})

const getBidderPerformancesByContractIdx = axios.create({
    baseURL: `${config.apiurl}/ratings/getBidderPerformancesByContractId`,
    json: true,
    method: 'POST'
  })
export default {

  async createBidderPerformances(bidContractId, bidderId, rfqRequestedUserId, criteriaId, score) {
    return createBidderPerformance({
      data: {
        bidContractId: bidContractId,
        bidderId: bidderId,
        rfqRequestedUserId: rfqRequestedUserId,
        criteriaId: criteriaId,
        score: score
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },


  async editBidderPerformances(id, score) {
    fetch(`${config.apiurl}/ratings/editBidderPerformances`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        score: score,
      })
    })
      .then(response => {
        response.json()
      })
  },

  async getBidderPerformancesByContractId(bidContractId, rfqRequestedUserId) {
    return getBidderPerformancesByContractIdx({
      data: {
          bidContractId: bidContractId,
          rfqRequestedUserId: rfqRequestedUserId,
      },
    }).then(req => {
      return req.data
    }).catch(err => console.log(err))
  },


  async getBidderPerformancesByBidderId(id) {
    try {
      let response = await fetch(`${config.apiurl}/ratings/getBidderPerformancesByBidderId/${id}`);
      this.posts = await response.json();
      return this.posts
    } catch (error) {
      console.log(error)
    }
  },

}