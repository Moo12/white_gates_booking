import { ref } from 'vue'
import { projectAuth } from '../firebase/config'
import { projectFireStore } from '@/firebase/config'

import useCollection from '@/composables/useCollection'


const error = ref(null)
const isPending = ref(false)

const signup = async (signupMethod, email, password, displayName, isAdmin = true) => {
  error.value = null
  isPending.value = true

  try {

    let res
    if ( signupMethod === 'EmailPassword'){
        res = await projectAuth.createUserWithEmailAndPassword(email, password)
        if (!res) {
          throw new Error('Could not complete signup')
        }
    }
    else if (signupMethod === 'GoogleSignup'){
        console.log('GoogleSignup')
        const provider = new projectAuth.GoogleAuthProvider();

        res = await signInWithPopup(auth, provider);

    }
    else {
        throw new Error('Un supported signup method')  
    }

    if (!res) {
        throw new Error('Could not complete signup')
    }

    await res.user.updateProfile({ displayName, isAdmin})
    error.value = null
    isPending.value = false

     // Save additional data in Firestore
    console.log("line 42")

    const { error: errorCollection, addDoc } = useCollection('users')

    addDoc({
      displayName,
      isAdmin,
      email: res.user.email
    }, res.user.uid)
  
    return res
  }
  catch(err) {
    isPending.value = false
    console.log(err.message)
    error.value = err.message
  }
}

const useSignup = () => {
  return { error, signup, isPending }
}

export default useSignup