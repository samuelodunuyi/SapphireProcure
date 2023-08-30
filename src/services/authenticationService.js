import { PublicClientApplication } from '@azure/msal-browser';
import store from '../store/authStore'
import Emitter from 'tiny-emitter';
import router from '../router';
import administrationsService from '../services/administrationsService'
import { useCounterStore } from "../store/piniaStore"
import pinia from "../store/store";

const stores = useCounterStore(pinia);

export default {
    msalInstance: new PublicClientApplication(store.state.msalConfig),
    emitter: new Emitter(),

    async SignIn() {
        await this.msalInstance
            .loginPopup({})
            .then(async () => {
                const myAccounts = this.msalInstance.getAllAccounts();
                this.account = myAccounts[0];

                // const request = {
                //     scopes: ["user.read"],
                //     account: this.account,
                //   };
                // const msalInstance = new PublicClientApplication(store.state.msalConfig);
                // try {
                //     let tokenResponse = await msalInstance.acquireTokenSilent(request);
                //     store.commit('setAccessToken', tokenResponse.accessToken);
                //     stores.accessToken = tokenResponse.accessToken
                //     console.log(stores.accessToken)
                // } catch (error) {
                //     console.error('Silent token acquisition failed. Using interactive mode');
                //     let tokenResponse = await msalInstance.acquireTokenPopup(request);
                //     console.log(`Access token acquired via interactive auth ${tokenResponse.accessToken}`)
                //     store.commit('setAccessToken', tokenResponse.accessToken);
                //     stores.accessToken = tokenResponse.accessToken
                // }
                // stores.signedInUserRole = (await administrationsService.getLoggedInUserRoles(myAccounts[0].username)).roleName
                stores.signedInUserRole = (await administrationsService.getLoggedInUserRoles(myAccounts[0].username)).roleName
                stores.signedInUserEmail = myAccounts[0].username


                this.emitter.emit('login', this.account);
                if (stores.signedInUserRole == 'Bidder') {
                    router.replace('/bidders')
                }
                else if (stores.signedInUserRole == 'IT Admin' || stores.signedInUserRole == 'Procurement Admin' || stores.signedInUserRole == 'Finance Admin' || stores.signedInUserRole == 'Management') {
                    router.replace('/')
                }
                else if (stores.signedInUserRole == 'Basic') {
                    router.replace('/basichome')
                }
            })
            .catch(error => {
                console.error(`error during authentication: ${error}`);
            });
    },
    async SignOut() {
        await this.msalInstance
            .logoutPopup({})
            .then(() => {
                this.emitter.emit('logout', 'logging out');
                stores.signedInUserEmail = ''
                stores.signedInUserRole = ''
                this.account = undefined
                router.push('/login')
            })
            .catch(error => {
                console.error(error);
            });
    },
}