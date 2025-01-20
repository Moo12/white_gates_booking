import { ref } from 'vue'
import { projectAuth } from '../firebase/config'
import { projectFireStore } from '@/firebase/config'


// refs
const user = ref(projectAuth.currentUser)

// auth changes
projectAuth.onAuthStateChanged(async (_user) => {
  console.log('User state change. Current user is:', _user)
  user.value = _user


  if(_user){
    const userDoc = await projectFireStore.collection('users').doc(_user.uid).get()
      if (userDoc.exists) {
        user.value = { ..._user, ...userDoc.data() } // Merge auth data with Firestore data
      }
  }

});

const getUser = () => {
  return { user } 
}

export default getUser