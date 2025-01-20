<template>
  <div class="manage-rooms">
    <h1>Manage Rooms</h1>
    <div class="room-actions">
      <button @click="openCreateModal">Create New Room</button>
    </div>

    <div v-if="rooms && rooms.length">
      <div v-for="room in rooms" :key="room.id" class="room-item">
        <RoomDisplay :room="room" />
        <button @click="openEditModal(room)">Edit</button>
        <button @click="openConfirmationModal(room.id)">Delete</button>
        <ConfirmationDialog 
        v-if="showDeleteConfirmation" 
        :title="'Confirm Deletion'" 
        :question="'Are you sure you want to delete this room?'" 
        @confirmed="handleConfirm"
        @cancelled="handleCancel"
      />
      </div>
    </div>

    <!-- Create/Edit Room Modal -->
    <RoomModal
      v-if="showModal"
      :room="editingRoom"
      @close="closeModal"
      @save="saveRoom"
    />
  </div>
</template>

<script>
import { ref, watchEffect, toRaw } from "vue";
import getCollection from "@/composables/getCollection";
import useCollection from "@/composables/useCollection";
import useDocument from "@/composables/useDocument";
import useStorage from "@/composables/useStorage";
import RoomModal from "@/components/admin/RoomModal.vue";
import RoomDisplay from "@/components/RoomDisplay.vue"; // Reusable room display component
import ConfirmationDialog from "@/components/ConfirmationDialog.vue";

export default {
  name: "ManageRooms",
  components: {
    RoomModal,
    RoomDisplay,
    ConfirmationDialog,
  },
  setup() {
    const showModal = ref(false);
    const editingRoom = ref(null);
    const isPending = ref(false)
    const showDeleteConfirmation = ref(false)
    const itemIdToDelete = ref(null);


    // Fetch rooms using getCollection
    const { error: errorGetCollection, documents: rooms } = getCollection("rooms");

    // UseCollection composable for adding new rooms
    const { error: errorUseCollection, addDoc } = useCollection("rooms");
    

    // Open modal to create a new room
    const openCreateModal = () => {
      editingRoom.value = {
        name: "",
        amenities: [],
        capacity: 0,
        description: "",
        status: [],
        type: "Standard",
        pictures: [],
      };
      showModal.value = true;
    };

    // Open modal to edit an existing room
    const openEditModal = (room) => {
      editingRoom.value = { ...room };

      console.log('urls:', room.pictures)
      showModal.value = true;
    };

    // Save room (either create or update)
    const saveRoom = async (roomData) => {
      isPending.value = true
      
      const { room, imageFiles } = roomData;
      
      
      console.log("room: ", room)
      console.log("images ", imageFiles, "size: ", imageFiles.length)
      
      const id = room.id || new Date().getTime().toString();

      let { urls, filesPath} = await uplaodImageWrapper(imageFiles, id)

      console.log("images url: ", urls, 'images path ', filesPath)

      room.pictures = [
        ...(room.pictures || []), // images Url uploaded files
        ...(urls || []), // Existing pictures (if any)
      ]

      room.picturesPath = [
        ...(room.picturesPath || []), // images file path
        ...(filesPath || []), // Existing file path (if any)
      ];

      console.log('images pictures url: ', room.pictures, 'images pictures path: ',room.picturesPath)

      if (room.id) {        
      // Edit existing room
        const { error: errorUpdate, updateDoc } = useDocument("rooms", room.id);
         await updateDoc(room);
         if (!errorUpdate.value) {
           console.log("Room updated successfully!");
         } else {
           console.error("Error updating room:", errorUpdate.value);
         }
      } else {
      // Create new room
        const newRoom = { ...room, createdAt: new Date() };
        await addDoc(newRoom, id);
        if (!errorUseCollection.value) {
          console.log("Room added successfully!");
        } else {
          console.error("Error adding room:", errorUseCollection.value);
        }
      }
      closeModal();
    };

    const uplaodImageWrapper = async (imageFiles, id) => {
      const uploadPromises = imageFiles.map(async (imageFile) => {
        const {url, filePath, uploadImage, deleteImage} = useStorage();

        console.log("Uploading image:", imageFile);
        
        await uploadImage(imageFile, id);
        console.log("Image uploaded:", filePath.value, url.value);
        
        return { url: url.value, filePath: filePath.value}; // Return the uploaded URL
      });
      
      const imagesObj = await Promise.all(uploadPromises); // Wait for all uploads to complete
      
      // Separate the objects into two arrays
      const urls = imagesObj.map(obj => obj.url);
      const filesPath = imagesObj.map(obj => obj.filePath);
  
      return { urls, filesPath};
    };

    const deleteImageWrapper = async (id) => {

      let room = rooms.value.filter(item => item.id == id )

      let roomRaw = toRaw(room[0])

      console.log('room deleting', roomRaw)

      console.log('room capacity', roomRaw.capacity)


      const deletePromises = roomRaw.picturesPath.map(async (imageFilePath) => {
        console.log("deleting image:", imageFilePath);

        const {deleteImage} = useStorage();

        await deleteImage(imageFilePath);

        return true;
      });

      const results = await Promise.all(deletePromises); // Wait for all uploads to complete
    };



    // Close modal
    const closeModal = () => {
      showModal.value = false;
      editingRoom.value = null;
    };

    // Delete room
    const deleteRoom = async (id) => {

      deleteImageWrapper(id);
      const { error: errorDelete, deleteDoc } = useDocument("rooms", id);
      await deleteDoc();
      if (!errorDelete.value) {
        console.log("Room deleted successfully!");
      } else {
        console.error("Error deleting room:", errorDelete.value);
      }
    };

    const openConfirmationModal = (roomId) => {
      itemIdToDelete.value = roomId
      showDeleteConfirmation.value = true;
    };

    const handleConfirm = () => {
      console.log("Item deleted!");
      deleteRoom(itemIdToDelete.value)

      itemIdToDelete.value = null
      showDeleteConfirmation.value = false;
    };

    const handleCancel = () => {
      console.log("delete rrom canceled.");
      itemIdToDelete.value = null
      showDeleteConfirmation.value = false;
    };

    return {
      rooms,
      showModal,
      editingRoom,
      openCreateModal,
      openEditModal,
      saveRoom,
      closeModal,
      deleteRoom,
      showDeleteConfirmation,
      openConfirmationModal,
      handleConfirm,
      handleCancel,
    };
  },
};
</script>

<style scoped>
.manage-rooms {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.room-item {
  border: 1px solid #ddd;
  padding: 15px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.room-actions {
  margin-bottom: 20px;
}
</style>
