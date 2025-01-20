import { ref } from 'vue'
import { projectFireStore } from '@/firebase/config'

const useDocument = (collection, id) => {

  const error = ref(null)
  const isPending = ref(false)

  let docRef = projectFireStore.collection(collection).doc(id)

  const deleteDoc = async () => {
    isPending.value = true
    error.value = null
    try{
      const res = await docRef.delete()
      isPending.value = false
    }
    catch(err){
      console.log(err)
      isPending.value = false
      error.value = "could not delete the document"
    }
  }

  const updateDoc = async(updates) => {
    isPending.value = true
    error.value = null
    try{
      const res = await docRef.update(updates)
      isPending.value = false
    }
    catch(err){
      console.log(err)
      isPending.value = false
      error.value = "could not update the document"
    }

  }

  return { error, deleteDoc, isPending, updateDoc }

}

export default useDocument