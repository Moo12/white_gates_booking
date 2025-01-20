import { ref, onUnmounted } from 'vue'
import { projectFireStore } from '../firebase/config'

const getCollection = (collection) => {

  const documents = ref(null)
  const error = ref(null)


  // register the firestore collection reference
  let collectionRef = projectFireStore.collection(collection).orderBy('createdAt')

  if (collectionRef){
    console.log('collectionRef ', collectionRef.value)
  }
  // if (query){
  //    collectionRef = collectionRef.where(...query)
  //    console.log('query: ', query )
  //   }

  const unsub = collectionRef.onSnapshot(snap => {
  let results = []

  snap.docs.forEach(doc => {
  // must wait for the server to create the timestamp & send it back
    doc.data().createdAt && results.push({...doc.data(), id: doc.id})
  });

  console.log('documents: results ', results )
    
  // update values
  documents.value = results
  error.value = null
  }, err => {
  console.log(err.message)
  documents.value = null
  error.value = 'could not fetch the data'
  })

   // Cleanup listener on component unmount
   onUnmounted(() => {
     //   onInvalidate(() => unsub());
    unsub()
  })

  return { error, documents }
}

export default getCollection