<script setup>
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
const router = useRouter();
const navigateToNewRFQ = () => {
  router.push('/newrfq')
}
</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Aladin">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
  <div class="MainHead">
    <div class="topItems">
      <div class="tabmenu">
        <RouterLink to="/rfqs" active-class="active" class="inactive" v-if="$route.path == '/rfqs'">My Requisitions</RouterLink>
        <RouterLink to="/rfqs" class="inactive" v-else>My Requisitions</RouterLink>
        <RouterLink to="/rfqs/teamReq" active-class="active" class="inactive">All Requisitions</RouterLink>
      </div>
      <div>
        <button @click="navigateToNewRFQ" class="rfqbtn" v-if="$route.path == '/rfqs'">
          Create new RFQ
        </button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.MainHead {
  width: 100%;
}

.inactive {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  font-family: Roboto;
  text-decoration: none;
  color: #808080;
}

.active {
  color: #227CBF;
  border-bottom: 1.8px solid #227CBF;
  padding-bottom: 14px;
  cursor: default;
}

.tabmenu {
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 45px;
}

.topItems {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 44px;
  width: 100%;
}

.rfqbtn {
  font-family: Roboto;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #FFFFFF;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 10px;
  border: none;
  cursor: pointer;
  width: 200px;
  height: 40px;
  background: linear-gradient(90deg, #227CBF 0%, #47B65C 100%);
  border-radius: 50px;
}

.rfqbtn:hover{
  background: linear-gradient(90deg, #47B65C 0%, #227CBF 100%);
  transition: 0.7s;
}

</style>
