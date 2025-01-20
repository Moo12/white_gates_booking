<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>{{ room.id ? 'Edit Room' : 'Create New Room' }}</h2>
      <form @submit.prevent="saveRoom">
        <div>
          <label for="name">Room Name</label>
          <input v-model="room.name" type="text" id="name" placeholder="Room Name" required />
          <div v-if="formErrors.name" class="error">{{ formErrors.name }}</div>
        </div>
        
        <div>
          <label>Amenities</label>
          <div class="checkbox-group">
            <label class="checkbox-label" v-for="amenity in amenities" :key="amenity">
              <input type="checkbox"  :value="amenity" v-model="room.amenities" /> {{ amenity }}
            </label>
          </div>
          <div v-if="formErrors.amenities" class="error">{{ formErrors.amenities }}</div>
        </div>
        
        <div>
          <label for="capacity">Capacity</label>
          <input v-model.number="room.capacity" type="number" id="capacity" required />
          <div v-if="formErrors.capacity" class="error">{{ formErrors.capacity }}</div>
        </div>
        
        <div>
          <label for="description">Description</label>
          <textarea v-model="room.description" id="description"></textarea>
          <div v-if="formErrors.description" class="error">{{ formErrors.description }}</div>
        </div>
        
        <div class="checkbox-group">
          <label for="status">Status</label>
          <select v-model="room.status" id="status">
            <option v-for="status in roomStatus" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
          <div v-if="formErrors.status" class="error">{{ formErrors.status }}</div>
        </div>
        
        <div>
          <label for="type">Room Type</label>
          <select v-model="room.type" id="type">
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
          </select>
          <div v-if="formErrors.type" class="error">{{ formErrors.type }}</div>
        </div>
        
        <div>
          <label for="pictures">Pictures</label>
          <input type="file" id="pictures" @change="handleImageUpload" multiple accept="image/*" />
          <div v-if="formErrors.pictures" class="error">{{ formErrors.pictures }}</div>
        </div>

        <div>
          <ImageCarousel :images="room.pictures" />
        </div>

        <button :disabled="isSubmitDisabled" type="submit">Save Room</button>
        <button @click="closeModal" type="button">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, ref, computed, watchEffect } from "vue";
import getDocument from "@/composables/getDocument";
import ImageCarousel from "@/components/ImageCarousel.vue"

export default {
  name: "RoomModal",
  props:{
    room: {
      type: Object,
      required: true,
    },
  },
  components: {
    ImageCarousel,
  },
  emits: ["close", "save"],
  setup(props, { emit }) {
    
    const amenities = reactive([]);
    const roomStatus = reactive([]);

    const fileError = ref(null)
    const imagesfiles = ref([]);
    const formErrors = reactive({
      name: "",
      amenities: "",
      capacity: "",
      description: "",
      status: "",
      type: "",
      pictures: "",
    });
    const isPending = ref(false);

    const fetchOptions = async () => {
    // Fetch amenities and room status options
    const { error: errorAmenities, document: amenitiesDoc } = getDocument("metadata", "amenities");
    const { error: errorRoomStatus, document: roomStatusDoc } = getDocument("metadata", "room-status");

    // Handle errors
    if (errorAmenities.value) console.error("Error fetching amenities:", errorAmenities.value);
    if (errorRoomStatus.value) console.error("Error fetching room statuses:", errorRoomStatus.value);

    // Watch for changes in amenitiesDoc and update amenities array
    watchEffect(() => {
      if (amenitiesDoc.value && amenitiesDoc.value.options) {
        amenities.splice(0, amenities.length, ...amenitiesDoc.value.options);
      }
    });

    // Watch for changes in roomStatusDoc and update roomStatus array
    watchEffect(() => {
      if (roomStatusDoc.value && roomStatusDoc.value.options) {
        roomStatus.splice(0, roomStatus.length, ...roomStatusDoc.value.options);
      }
    });
  };

  // Handle image upload

  const types = ['image/png', 'image/jpeg', 'image/jpg']
  
  const handleImageUpload = (e) => {
    fileError.value = null;
    

    const selectedFiles = Array.from(e.target.files); // Handle multiple files
    const validFiles = selectedFiles.filter(
        (file) => file && types.includes(file.type)
    );

    if (validFiles.length) {
      imagesfiles.value = []
      imagesfiles.value.push(...validFiles); // Add only new valid files
    }
    else{
      console.log('vald files number', validFiles.length)
      formErrors.pictures = "Please select valid files (PNG or JPEG).";
    }
  };


  // Save room (emit to parent component)
  const saveRoom = () => {
    console.log(props.room, imagesfiles.value)
    emit("save", { imageFiles: imagesfiles.value, room: props.room});
  };

  // Close modal (emit to parent component)
  const closeModal = () => {
    emit("close");
  };

  // Validation function for all fields
  const validateForm = () => {
    let valid = true;

    // Validate each field and update formErrors
    if (!props.room.name) {
      formErrors.name = "Room Name is required.";
      valid = false;
    } else {
      formErrors.name = "";
    }

    if (props.room.amenities.length === 0) {
      formErrors.amenities = "At least one amenity must be selected.";
      valid = false;
    } else {
      formErrors.amenities = "";
    }

    if (props.room.capacity <= 0) {
      formErrors.capacity = "Capacity must be greater than 0.";
      valid = false;
    } else {
      formErrors.capacity = "";
    }

    if (!props.room.description) {
      formErrors.description = "Description is required.";
      valid = false;
    } else {
      formErrors.description = "";
    }

    if (!props.room.status) {
      formErrors.status = "Status is required.";
      valid = false;
    } else {
      formErrors.status = "";
    }

    if (!props.room.type) {
      formErrors.type = "Room type is required.";
      valid = false;
    } else {
      formErrors.type = "";
    }

    return valid;
  };
  // Disable submit button if the form is invalid
  const isSubmitDisabled = computed(() => !validateForm());

  onMounted(fetchOptions);

  return {
    amenities,
    roomStatus,
    formErrors,
    saveRoom,
    closeModal,
    handleImageUpload,
    isSubmitDisabled,
  };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  max-height: 90vh; /* Limits the height of the modal */
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* Add scrolling if content overflows */
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input, textarea, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* Style the checkbox group */
.checkbox-group {
  display: flex;
  flex-direction: column; /* Align items vertically */
  gap: 1px; /* Add space between each checkbox */
  align-items: flex-start; /* Align all checkboxes to the left */
}

/* Style the checkbox label */
.checkbox-label {
  display: flex; /* Align checkbox and label text on the same line */
  align-items: center; /* Vertically align the checkbox and text */
  cursor: pointer; /* Make the label clickable */
  justify-items: left;
}

/* Optional: Style the checkbox itself */
.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  color: pink;
  margin-right: 8px; /* Space between the checkbox and the label */
}
</style>
