import store from './authStore'
import authenticationService from '../services/authenticationService';
export default {

    async getAccessToken() {
        // remove incase of errors
        await authenticationService.msalInstance.initialize();


        let request = {
          account: authenticationService.msalInstance.getAllAccounts()[0],
          scope: ['User.write'],
        };
  
        try {
            if(msalInstance.getAllAccounts()[0]){
          const tokenResponse = await authenticationService.msalInstance.acquireTokenSilent(request);
          store.commit('setAccessToken', tokenResponse.accessToken);
          return tokenResponse.accessToken
        }
        } catch (error) {
          console.error('Silent token acquisition failed. Using interactive mode');
          let tokenResponse = await authenticationService.msalInstance.acquireTokenPopup(request);
          store.commit('setAccessToken', tokenResponse.accessToken);
        }
        
      },
}
