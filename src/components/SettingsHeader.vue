<script setup>
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
const router = useRouter();

</script>

<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Aladin">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
  <div class="MainHead">
    <div class="topItems">
      <div class="tabmenu">
        <RouterLink to="/settings" active-class="active" class="inactive" v-if="$route.path == '/settings'">Users</RouterLink>
        <RouterLink to="/settings" class="inactive" v-else>Users</RouterLink>
        <RouterLink to="/settings/userRolesSetting" active-class="active" class="inactive">Roles</RouterLink>
        <!-- <RouterLink to="/settings/usermenus" active-class="active" class="inactive">Role Menus</RouterLink> -->
        <RouterLink to="/settings/department" active-class="active" class="inactive">Departments</RouterLink>
        <RouterLink to="/settings/businessUnit" active-class="active" class="inactive">Business Units</RouterLink>
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

</style>
