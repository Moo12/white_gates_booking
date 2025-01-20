<template>
    <div v-if="images && images.length" class="image-carousel">
      <button type="button" @click="prevImage" class="nav-button left">❮</button>
      <img :src="currentImage" alt="Carousel Image" class="carousel-image" />
      <button type="button" @click="nextImage" class="nav-button right">❯</button>
    </div>
    <div v-else class="no-images">No images to display</div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  
  export default {
    name: "ImageCarousel",
    props: {
      images: {
        type: Array,
        required: true,
        validator: (value) => Array.isArray(value) && value.every((img) => typeof img === "string"),
      },
    },
    setup(props) {
      const currentIndex = ref(0);
  
      const currentImage = computed(() => props.images[currentIndex.value]);
  
      const prevImage = () => {
        currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
      };
  
      const nextImage = () => {
        currentIndex.value = (currentIndex.value + 1) % props.images.length;
      };
  
      return {
        currentImage,
        prevImage,
        nextImage,
      };
    },
  };
  </script>
  
  <style scoped>
  .image-carousel {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    max-width: 600px;
    margin: auto;
  }
  
  .carousel-image {
    max-width: 100%;
    max-height: 400px;
    border: 1px solid #ddd;
    border-radius: 8px;
    object-fit: contain;
  }
  
  .nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
  }
  
  .nav-button.left {
    left: -40px;
  }
  
  .nav-button.right {
    right: -40px;
  }
  
  .nav-button:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  .no-images {
    text-align: center;
    font-size: 16px;
    color: #666;
  }
  </style>
  