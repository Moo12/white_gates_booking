<template>
    <div class="admin-layout">
      <AdminNavbar />
      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </template>
  
  <script>
  import AdminNavbar from "@/components/admin/AdminNavbar.vue";
  
  export default {
    name: "AdminLayout",
    components: {
      AdminNavbar,
    },
  };
  </script>
  
  <style scoped>
  .admin-layout {
    display: flex;
  }
  
  .admin-content {
    flex: 1; /* Take up the remaining space beside the navbar */
    padding: 20px;
    overflow-y: auto; /* Add scrolling if content overflows */
  }
  </style>
  