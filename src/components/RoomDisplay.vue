<template>
    <div class="room-display">
      <h3><strong>Room Name:</strong>{{ room.name }}</h3>
      <p><strong>Room Description:</strong>{{ room.description }}</p>
      <p><strong>Amenities:</strong> {{ room.amenities }}</p>
      <p><strong>Capacity:</strong> {{ room.capacity }} people</p>
      <p><strong>Status:</strong> {{ room.status }}</p>
      <p><strong>Type:</strong> {{ room.type }}</p>
      <div v-if="room.pictures.length">
        <h4>Pictures</h4>
        <div class="pictures">
          <img v-for="(pic, index) in room.pictures" :key="index" :src="pic" alt="Room Picture" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "RoomDisplay",
    props: {
      room: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .room-display {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 40px;
  }

  .room-display p, .room-display h3 {
    margin-bottom: 10px;
  }
  
  .pictures img {
    width: 100px;
    margin: 5px;
  }
  </style>
  