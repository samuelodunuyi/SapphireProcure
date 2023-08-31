import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      msalConfig: {
        auth: {
          clientId: 'ded3f2ff-d210-4678-a453-490a10391f76',
          authority: "https://login.microsoftonline.com/2373a921-a6fe-4ee1-a785-838b208582ee",

        },
        cache: {
          cacheLocation: 'localStorage',
        },
      },
      accessToken: '',
      signedInUseremail: '',
      signedInUserRole: undefined
    };
  },
  mutations: {
    setAccessToken(state, token) {
      state.accessToken = token;
    }
  }
});

export default store;
