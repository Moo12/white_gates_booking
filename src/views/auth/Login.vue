<template>
    <form @submit.prevent="loginWithEmail">
        <h4>Login</h4>
        <input type="email" placeholder="Email" v-model:="email">
        <input type="password" placeholder="Password" v-model:="password">
        <div class="error" v-if="error">{{ error }}</div>
        <button v-if="!isPending">Log In</button>
        <button v-else disabled>Loading</button>
        <p>Or login with:</p>

        <!-- Social Logins -->
        <button @click.prevent="loginWithGoogle">Login with Google</button>
    </form>
</template>

<script>
import useLogin from '@/composables/useLogin';
import { ref } from 'vue';
import { useRouter } from 'vue-router'


export default {
    setup(){
        const email = ref('')
        const password = ref('')

        const { error, isPending, login } = useLogin()
        const router = useRouter()

        const LoginHandler = async (loginMethod) => {
            const res = await login(email.value, password.value, loginMethod)

            if (!error.value){
                console.log('user logged in')
                router.push( { name: 'Home' } )
            }
        }

        const loginWithEmail = async () => {
            LoginHandler('EmailPAssword')
        }


        const loginWithGoogle = async() => {
            LoginHandler('GoogleSignIn')
        }

        return { loginWithEmail, loginWithGoogle, password, email, error, isPending }
    }
}
</script>

<style>

</style>