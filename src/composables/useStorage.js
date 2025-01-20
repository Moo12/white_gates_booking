import { projectStorage } from "@/firebase/config";
import { ref } from 'vue'


const useStorage = () => {
    const error = ref(null)
    const url = ref(null)
    const filePath = ref(null)


    const uploadImage = async (file, roomId) => {
        filePath.value = `rooms/${roomId}/${file.name}`

        const storageRef = projectStorage.ref(filePath.value)

        try{
            const res = await storageRef.put(file)
            url.value = await res.ref.getDownloadURL()
        }catch(err){
            console.log(err.message)
            error.value = err.message
        }
    }

    const deleteImage = async(path) => {
        const storageRef = projectStorage.ref(path)

        try{
            await storageRef.delete()
        }
        catch(err){
            error.value = err.message

            console.log(err.message)
        }
    }

    return {url, error, filePath, uploadImage, deleteImage}
}

export default useStorage