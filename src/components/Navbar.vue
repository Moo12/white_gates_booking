<template>
    <div class="navbar">
        <nav>
            <img src = '@/assets/logo.png'>
            <h1><router-link :to="{name: 'Home'}">WhiteGates</router-link></h1>
            
            <div class="links">
                <div v-if="user">
                    <router-link class="btn" :to="{name: 'Book'}">Book Now</router-link>
                    <router-link class="btn" :to="{name: 'MyBookings'}">Bookings</router-link>
                    <router-link class="btn" :to="{name: 'Rooms'}">Rooms</router-link>
                    <span>hi here {{user.displayName}}</span>
                    <router-link v-if="user.isAdmin"  class="btn" :to="{name: 'AdminLayout'}">Admin</router-link>
                    <button  @click="handleLogout">Logout</button>

                </div>
                <div v-else>
                    <router-link class="btn" :to="{name: 'Signup'}">Signup</router-link>
                    <router-link  class="btn" :to="{name: 'Login'}">Login</router-link>
                </div>
            </div>

        </nav>
    </div>
  
</template>

<script>
import getUser from '@/composables/getUser';
import useLogout from '@/composables/useLogout'
import { useRouter } from 'vue-router'


export default {
    setup(){
        const { error, logout } = useLogout()
        const { user } = getUser()
        const router = useRouter()

        const handleLogout = async () => {
            await logout()

            console.log('user logged out')

            router.push({name: 'Login'}) 
        }

        return { user, handleLogout }

    }
}
</script>

<style scoped>
.navbar{
    padding: 16px;
    margin-bottom: 60px;
    background: white;
}

nav{
    display: flex;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

nav h1{
    margin-left: 20px;
}

nav .links{
    margin-left: auto
}

nav .links a, button{
    margin-left: 16px;
    font-size: 10px; 
}

nav img{
    max-height: 60px;
}

span{
    font-size: 14px;
    display: inline-block;
    margin-left: 16px;
    padding-left: 16px;
    border-left: 1px solid #eee;
}
</style>