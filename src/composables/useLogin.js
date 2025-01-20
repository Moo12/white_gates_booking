import { ref } from 'vue'
import { projectAuth} from '../firebase/config'
// import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const error = ref(null)
const isPending = ref(null)

const login = async (email, password, loginMethod) => {

    try{
        let res
        if ( loginMethod === 'EmailPAssword'){
            console.log('EmailPAssword')
            res = await projectAuth.signInWithEmailAndPassword(email, password)

        }
        else if (loginMethod === 'GoogleSignIn'){
            console.log('GoogleSignIn')
            const provider = new projectAuth.GoogleAuthProvider();
            res = await projectAuth.signInWithPopup(auth, provider);

            console.log("Google user:", result.user);
        }
        error.value = null
        isPending.value = false
        return res
    }
    catch(err){
        isPending.value = false
        console.log(err.message)
        error.value = "incorrect Login credentials"
    }
}

const useLogin = () => {
    return { error, isPending, login} 
}

export default useLogin