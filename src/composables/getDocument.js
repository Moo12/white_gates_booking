import { ref, watchEffect } from 'vue'
import { projectFireStore } from '../firebase/config'

const getDocument = (collection, id) => {

  const document = ref(null)
  const error = ref(null)

  // register the firestore Document reference
  let documentRef = projectFireStore.collection(collection).doc(id)

  const unsub = documentRef.onSnapshot(doc => {
    if (doc.data()){
      document.value = {...doc.data(), id: doc.id}
      error.value = null
    }
    else{
      error.value = 'that document doesntexist'
    }
  }, err => {
    console.log(err.message)
    error.value = 'could not fetch document'
  })

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { error, document }
}

export default getDocument