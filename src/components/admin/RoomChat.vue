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
import { reactive, onMounted, ref } from "vue";
import getDocument from "@/composables/getDocument";
import ImageCarousel from "@/components/ImageCarousel.vue";

export default {
  name: "RoomModal",
  props: {
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
    const fileError = ref(null);
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

      // Watch for changes in amenitiesDoc
      if (amenitiesDoc.value) {
        amenities.splice(0, amenities.length, ...amenitiesDoc.value.options);
      }
      // Watch for changes in roomStatusDoc
      if (roomStatusDoc.value) {
        roomStatus.splice(0, roomStatus.length, ...roomStatusDoc.value.options);
      }

      // Handle errors
      if (errorAmenities.value) console.error("Error fetching amenities:", errorAmenities.value);
      if (errorRoomStatus.value) console.error("Error fetching room statuses:", errorRoomStatus.value);
    };

    const handleImageUpload = (e) => {
      fileError.value = null;
      const selectedFiles = Array.from(e.target.files); // Handle multiple files
      const validFiles = selectedFiles.filter(
        (file) => file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type)
      );

      if (validFiles.length) {
        imagesfiles.value = [];
        imagesfiles.value.push(...validFiles);
      } else {
        formErrors.pictures = "Please select valid files (PNG or JPEG).";
      }
    };

    const saveRoom = () => {
      emit("save", { imageFiles: imagesfiles.value, room: props.room });
    };

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

      if (imagesfiles.value.length === 0) {
        formErrors.pictures = "At least one picture is required.";
        valid = false;
      } else {
        formErrors.pictures = "";
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
.error {
  color: red;
  font-size: 12px;
}
button:disabled {
  background-color: gray;
  cursor: not-allowed;
}
</style>
