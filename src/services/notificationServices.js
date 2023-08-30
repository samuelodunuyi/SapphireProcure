import axios from 'axios'
import config from '../config/index';


const createNotifications = axios.create({
    baseURL: `${config.apiurl}/notifications/createnotification`,
    json: true,
    method: 'POST'
})


const createMultipleNotifications = axios.create({
    baseURL: `${config.apiurl}/notifications/createMultiNotification`,
    json: true,
    method: 'POST'
})


export default {

    async getNotifications(whom) {
        try {
            let response = await fetch(`${config.apiurl}/notifications/getnotifications/${whom}`, {
            });
            this.posts = await response.json();
            return this.posts
        } catch (error) {
            console.log(error)
        }
    },


    async createNotification(ForWhom, RecordId, Description, NotificationType) {
        return createNotifications({
            data: {
                ForWhom: ForWhom,
                RecordId: RecordId,
                Description: Description,
                NotificationType: NotificationType 
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
    },

    async createMultiNotification(ForWhom, RecordId, Description, NotificationType) {
        return createMultipleNotifications({
            data: {
                forWhom: ForWhom,
                description: Description,
                notificationType: NotificationType,
                recordId: RecordId
            },
        }).then(req => {
            return req.data
        }).catch(err => console.log(err))
    },


    async editNotifications(ForWhom, RecordId, Description, NotificationType) {
        fetch(`${config.apiurl}/notifications/editnotifications/${ForWhom}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                RecordId: RecordId,
                Description: Description,
                NotificationType: NotificationType 
            })
        })
            .then(response => {
                response.json()
            })
    },
}