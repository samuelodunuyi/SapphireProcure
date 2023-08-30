import getAccessToken from '../store/checker'
import store from '../store/authStore'
import config from '../config/index';

import axios from 'axios'

const createDepartment = axios.create({
    baseURL: '${config.apiurl}/settings/createdepartments',
    json: true,
    method: 'POST'
})

const createBusinessUnit = axios.create({
    baseURL: '${config.apiurl}/settings/createbusinessunits',
    json: true,
    method: 'POST'
})

const createRFQTypes = axios.create({
    baseURL: '${config.apiurl}/settings/createrfqtype',
    json: true,
    method: 'POST'
})

export default {

    async createDepartments(shortCode, departmentDescription) {
        return createDepartment({
            data: {
                ShortCode: shortCode,
                LastModifiedBy: store.state.signedInUseremail,
                DepartmentDescription: departmentDescription,
            },
        }).then(req => {
            console.log(req.data)
            return req.data
        }).catch(err => console.log(err))
    },

    async createBusinessUnits(shortCode, businessUnitDescription) {
        return createBusinessUnit({
            data: {
                ShortCode: shortCode,
                LastModifiedBy: store.state.signedInUseremail,
                BusinessUnitDescription: businessUnitDescription,
            },
        }).then(req => {
            console.log(req.data)
            return req.data
        }).catch(err => console.log(err))
    },


    async createRFQType(typeCode, description, lastmodifiedBy) {
        return createRFQTypes({
            data: {
                typeCode: typeCode,
                description: description,
                lastmodifiedBy: lastmodifiedBy
            },
        }).then(req => {
            console.log(req.data)
            return req.data
        }).catch(err => console.log(err))
    },

    async getRFQTypes() {
        try {
            let response = await fetch(`${config.apiurl}/settings/getrfqtype`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async getRFQSubTypes() {
        try {
            let response = await fetch(`${config.apiurl}/settings/getrfqsubtype`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async getBusinessUnits() {
        try {
            let response = await fetch(`${config.apiurl}/settings/getbusinessunits/1`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async editBusinessUnits() {
        try {
            let response = await fetch(`${config.apiurl}/settings/editbusinessunits`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },


    async deleteBusinessUnits(id) {
        try {
            let response = await fetch(`${config.apiurl}/settings/deletebusinessunits/${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },


    async getDepartments() {
        try {
            let response = await fetch(`${config.apiurl}/settings/getdepartments/1`, {
            });
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },


    

    async editDepartments() {
        try {
            let response = await fetch("${config.apiurl}/settings/editdepartments");
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },


    async deletedepartments(id) {
        try {
            await fetch(`${config.apiurl}/settings/deletedepartments/${id}`, {
                method: 'DELETE',
                headers:{
                'Content-Type': 'application/json'
                },
                body: {
                    data
                }
            }).then(id=>{
                return id;
            });
        }catch (error) {
            console.log(error)
        }
    },
}