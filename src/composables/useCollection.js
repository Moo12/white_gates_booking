import { ref } from 'vue'
import { projectFireStore } from '@/firebase/config'

const useCollection = (collectionName) => {

  const error = ref(null)

  // add a new document
  const addDoc = async (doc, id) => {
    error.value = null

    try {   
      const res = await projectFireStore.collection(collectionName).doc(id).set(doc)
      return res
    }
    catch(err) {
      console.log(err.message)
      error.value = 'could not send the message'
    }
  }

  return { error, addDoc }

}

export default useCollection