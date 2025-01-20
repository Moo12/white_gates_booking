<template>
    <div class="admin-navbar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
            <router-link class="btn" to="/admin">Dashboard</router-link>
        </li>
        <li >
          <router-link class="btn" to="/admin/manage-booking">Manage Bookings</router-link>
        </li>
        <li>
          <router-link class="btn" to="/admin/manage-availability">Update Availability</router-link>
        </li>
        <li>
          <router-link class="btn" to="/admin/manage-rooms">Manage Rooms</router-link>
        </li>
        <li>
          <router-link class="btn" to="/admin/manage-availability">Update Pricing</router-link>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "AdminNavbar",
  };
  </script>
  
  <style scoped>
  .admin-navbar {
    width: 250px;
    background-color: #f4f4f4;
    padding: 20px;
    border-right: 1px solid #ddd;
    height: 100vh;
  }
  
  .admin-navbar h2 {
    margin-bottom: 20px;
    font-size: 18px;
    text-align: center;
  }
  
  .admin-navbar ul {
    list-style-type: none;
    padding: 0;
  }
  
  .admin-navbar li {
    margin: 10px 0;
  }
  </style>
  