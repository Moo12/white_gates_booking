<template>
    <div>
      <h2>Manage Rooms</h2>
      <!-- Form to Add New Room -->
      <form @submit.prevent="addNewRoom">
        <input v-model="room.name" placeholder="Room Name" required />
        <input v-model.number="room.price" type="number" placeholder="Price" required />
        <input v-model.number="room.capacity" type="number" placeholder="Capacity" required />
        
        <label for="amenities">Amenities:</label>
        <select v-model="selectedAmenity" id="amenities">
          <option v-for="amenity in availableAmenities" :key="amenity" :value="amenity">
            {{ amenity }}
          </option>
        </select>
        <button type="button" @click="addAmenity">Add Amenity</button>
  
        <ul>
          <li v-for="(amenity, index) in room.amenities" :key="index">
            {{ amenity }} <button type="button" @click="removeAmenity(index)">Remove</button>
          </li>
        </ul>
        
        <button type="submit">Add Room</button>
      </form>
  
      <!-- List of Existing Rooms -->
      <ul>
        <li v-for="room in rooms" :key="room.id">
          {{ room.name }} - ${{ room.price }}
          <button @click="removeRoom(room.id)">Delete</button>
        </li>
      </ul>
    </div>
  </template>
  
<script>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import useCollection from  '@/composables/useCollection'

  
  export default {
    props: ['rooms'],
    emits: ['roomAdded', 'roomDeleted'],
    setup(_, { emit }) {
      const room = ref({ name: '', price: 0, capacity: 0, amenities: [] });
      const selectedAmenity = ref('');
      const availableAmenities = ref(['WiFi', 'TV', 'AC', 'Mini Bar', 'Breakfast Included', 'Swimming Pool']);

      const router = useRouter()

      const { error, addDoc } = useCollection(`Rooms`)
  
      const addNewRoom = async () => { 

        const response = await addDoc({ ...room.value });
        emit('roomAdded');
        room.value = { name: '', price: 0, capacity: 0, amenities: [] };

        if (!error.value){
            console.log('room created succesfully')
            router.push({name: 'Admin' })
        }
        else{
            console.log('error creating room')
        }

      };
  
      const addAmenity = () => {
        if (selectedAmenity.value && !room.value.amenities.includes(selectedAmenity.value)) {
          room.value.amenities.push(selectedAmenity.value);
        }
      };
  
      const removeAmenity = (index) => {
        room.value.amenities.splice(index, 1);
      };

  
      return { room, selectedAmenity, availableAmenities, addNewRoom, addAmenity, removeAmenity };
    },
  };
  </script>
  
  <style>
  /* Styles for Rooms Form */
  </style>
  