import { createRouter, createWebHistory } from 'vue-router'
import LoginAuth from '../views/general/LoginAuth.vue'
import HomeView from '../views/OtherUsers_/Home.vue'
import TeamReq from '../views/OtherUsers_/TeamRequisitions.vue'
import MyReq from '../views/OtherUsers_/MyRequisitions.vue'
import NewRfq from '../views/general/NewRFQView.vue'
import PurchContract from '../views/OtherUsers_/PurchaseContracts.vue'
import PurchContractBidder from '../views/Bidders/PurchaseContracts.vue'
import PurchContractDet from '../views/general/PurchaseContractDetails.vue'
import Settings from '../views/OtherUsers_/Settings.vue'
import userRolesSetting from '../views/OtherUsers_/UserRoles.vue'
import AdminUsers from '../views/OtherUsers_/AdminUsers.vue'
import biddersList from '../views/OtherUsers_/BiddersList.vue'
import requestforquotes from '../views/OtherUsers_/requestforQuotes.vue'
import authenticationService from '../services/authenticationService';
import BusinessUnit from '../views/OtherUsers_/BusinessUnit.vue'
import Department from '../views/OtherUsers_/Department.vue'
import report from '../views/OtherUsers_/Report.vue'
import rfqBids from '../views/Bidders/rfqBids.vue'
import rfqResponse from '../views/Bidders/RfqResponse.vue'
import BiddersHome from '../views/Bidders/BiddersHome.vue'
import BasicHomeView from '../views/basicrequestor/BasicRequestorHome.vue'
import PurchContractHome from '../views/basicrequestor/PurchaseContracts.vue'
import ratingBasic from '../views/basicrequestor/RatingBasic.vue'
import EditRfq from '../views/general/EditRFQView.vue'
import ViewRfq from '../views/general/ViewRFQView.vue'
import RateBidders from '../views/general/rateBidders.vue'
import biddersProfile from '../views/Bidders/biddersProfile.vue'
import { useCounterStore } from "../store/piniaStore"
import pinia from "../store/store";
const stores = useCounterStore(pinia);

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginAuth
    },
    
    {
      path: "/settings",
      name: 'settings',
      component: Settings,
      children:[
        {
          path: '', 
          name: 'settings',
          component: AdminUsers
        },
        

        {
          path: 'userRolesSetting',
          name: 'userRolesSetting',
          component: userRolesSetting
        },

        {
          path: 'department',
          name: 'department',
          component: Department
        },

        {
          path: 'businessUnit',
          name: 'businessUnit',
          component: BusinessUnit
        },

      ]
    },

    {
      path: '/biddersList',
      name: 'biddersList',
      component: biddersList
    },

    {
      path: '/PurchContractHome',
      name: 'PurchContractHome',
      component: PurchContractHome
    },

    {
      path: '/ratingBasic',
      name: 'ratingBasic',
      component: ratingBasic
    },

    {
      path: '/reviewVendor',
      name: 'reviewVendor',
      component: RateBidders
    },

    {
      path: '/rfqs',
      component: requestforquotes,
      children: [
        {
          path: '',
          name: 'MyReq',
          component: MyReq
        },

        {
          path: 'teamreq',
          name: 'teamreq',
          component: TeamReq
        },
      ]
    },


     {
      path: '/',
      name: 'home',
      component: HomeView
    },

    {
      path: '/basichome',
      name: 'basichome',
      component: BasicHomeView
    },


    {
      path: '/newrfq',
      name: 'newrfq',
      component: NewRfq
    },


    {
      path: '/viewRfq/:id',
      name: 'ViewRfq',
      component: ViewRfq
    },

    {
      path: "/rfqedit/:id",  
      name: "rfqedit",
      component: EditRfq
  },

    
    {
      path: '/purchcontract',
      name: 'purchcontract',
      component: PurchContract
    },

    {
      path: '/purchcontractBidder',
      name: 'purchcontractBidder',
      component: PurchContractBidder
    },

    {
      path: '/purchcontractdetails/:id',
      name: 'purchcontractdetails',
      component: PurchContractDet,
      meta: {requiresAuth: true}
    },

    {
      path: "/rfqresponse/:id",  
      name: 'rfqResponse',
      component: rfqResponse
    },

    {
      path: "/report",  
      name: 'report',
      component: report
    },


    {
      path: '/rfqBids',
      name: 'rfqBids',
      component: rfqBids
    },

    {
      path: '/bidders',
      name: 'Bidders',
      component: BiddersHome
    },

    {
      path: '/biddersProfile',
      name: 'biddersProfile',
      component: biddersProfile
    },

  ]
})

 router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
   const publicPages = ['/login'];
   const authRequired = !publicPages.includes(to.path);
   const auth = authenticationService.msalInstance.getAllAccounts();
   if (authRequired && auth.length==0) {
     return '/login';
   }

   else if(auth.length>0 && stores.signedInUserRole==' '){
    
   }
 });




export default router
