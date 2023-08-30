import axios from 'axios'
import config from '../config/index';


const createRole = axios.create({
    baseURL: `${config.apiurl}/administrations/createroles`,
    json: true,
    method: 'POST'
})

const createServiceCategoryLines = axios.create({
    baseURL: `${config.apiurl}/administrations/createServiceCategoryLine`,
    json: true,
    method: 'POST'
})
const createUser = axios.create({
    baseURL: `${config.apiurl}/administrations/createUsers`,
    json: true,
    method: 'POST'
})


export default {

    async getUserTypes() {
        try {
            let response = await fetch(`${config.apiurl}/administrations/getUserTypes`, {
            });
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },


    async getRoles() {
        try {
            let response = await fetch(`${config.apiurl}/administrations/getRoles`, {

            });
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async createRoles(name, description, userType) {
        return createRole({
            data: {
                name: name,
                description: description,
                userType: userType
            },
        }).then(req => {
            console.log(req.data)
            return req.data
        }).catch(err => console.log(err))
    },

    async createServiceCategoryLine(serviceCategoryId, subCategoryName ) {
        return createServiceCategoryLines({
            data: {
                serviceCategoryId: serviceCategoryId,
                subCategoryName: subCategoryName,
            },
        }).then(req => {
            console.log(req.data)
            return req.data
        }).catch(err => console.log(err))
    },

    async editRoles(id, names, descr, userTypes) {
        fetch(`${config.apiurl}/administrations/editRoles/?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                name: names,
                description: descr,
                userType: userTypes,
            })
        })
            .then(response => {
                response.json()
            })
    },

    async deleteRoles(id) {
        try {
            await fetch(`${config.apiurl}/administrations/deleteRoles?id=${id}`, {
                method: 'DELETE'
            }).catch(err => console.log(err))
        }
        catch (err) {
            console.log(err)
        }
    },


    async getUserRoles() {
        try {
            let response = await fetch(`${config.apiurl}/administrations/getuserroles`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async getLoggedInUser(id) {
        try {
            let response = await fetch(`${config.apiurl}/administrations/getloginuserdetails/${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async createUsers(userId, userFullNames, roleId, jobTitle, phoneNumber, address, departmentId, businessUnitId) {
        return createUser({
            data: {
                userId: userId,
                userFullName: userFullNames,
                roleId: roleId,
                jobTitle: jobTitle,
                phoneNumber: phoneNumber,
                address: address,
                departmentId: departmentId,
                businessUnitId: businessUnitId
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
            ;

    },

    async editUser(emailAddress, FullName, userRoleId, jobTitle, phoneNumber, address, department, businessUnit) {
        fetch(`${config.apiurl}/administrations/editUsers/?id=${emailAddress}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: emailAddress,
                userFullName: FullName,
                jobTitle: jobTitle,
                phoneNumber: phoneNumber,
                address: address,
                roleId: userRoleId,
                departmentId: department,
                businessUnitId: businessUnit,
            })
        })
            .then(response => {
                response.json()
            })
    },

    async getLoggedInUserRoles(id) {
        try {
            let response = await fetch(`${config.apiurl}/administrations/getLoginUserDetails/${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async getServiceCategory() {
        try {
            let response = await fetch(`${config.apiurl}/administrations/getservicecategories`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async getServiceLine(id) {
        try {
            let response = await fetch(`${config.apiurl}/administrations/getservicelines/${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async getMenus() {
        try {
            let response = await fetch(`${config.apiurl}/administrations/getmenus`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },

    async createRoleMenus() {
        try {
            let response = await fetch(`${config.apiurl}/administrations/createrolemenus`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },
    async deleteUsers(id) {
        try {
            let response = await fetch(`${config.apiurl}/administrations/deleteUsers/${id}`, { method: 'DELETE' });
            this.posts = response.status;
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },
    async getRoleMenuPermissions(id) {
        try {
            let response = await fetch(`${config.apiurl}/administrations/getrolemenupermissions?id=${id}`);
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },
}