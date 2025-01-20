<template>
    <form @submit.prevent="handleSubmit">
        <h4>Signup</h4>
        <input type="text" placeholder="Display Name" v-model="displayName">
        <input type="email" placeholder="Email" v-model:="email">
        <input type="password" placeholder="Password" v-model:="password">
        <div class="error" v-if="error">{{ error }}</div>
        <div v-if="!isPending">
            <button @click.prevent="signupWithEmail">Sign up</button>
            <p>Or signup with:</p>

            <!-- Social signups -->
            <button @click.prevent="signupWithGoogle">signup with Google</button>
        </div >
        <button v-else disabled>Loading</button>
    </form>
</template>

<script>
import useSignup from '@/composables/useSignup';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const email = ref('')
        const password = ref('')
        const displayName = ref('')
        const router = useRouter()

        const { error, signup, isPending } = useSignup()

        const signupHandler = async (signupMethod) => {
            console.log(signupMethod)
            const res = await signup(signupMethod, email.value, password.value, displayName.value)

            if (!error.value){
                console.log('user sign up')
                router.push( { name: 'Home' } )
            }
        };

        const signupWithEmail = async () => {
            signupHandler('EmailPassword')
        }


        const signupWithGoogle = async() => {
            signupHandler('GoogleSignup')
        }

        return { email, password, displayName, error, isPending,  signupWithEmail, signupWithGoogle} 

    }


}
</script>

<style>

</style>