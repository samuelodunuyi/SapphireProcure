import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      msalConfig: {
        auth: {
          clientId: 'ecb7c8d4-c00f-414e-b1e1-f76fb94080f5',
          authority: "https://login.microsoftonline.com/3d1d815e-5346-4244-9f7b-62b78fb742b1",

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
