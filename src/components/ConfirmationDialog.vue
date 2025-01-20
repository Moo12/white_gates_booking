<template>
    <div class="modal-overlay">
      <div class="modal">
        <h2>{{ title }}</h2>
        <p>{{ question }}</p>
        <div class="modal-buttons">
          <button @click="confirmAction">Yes</button>
          <button @click="cancelAction">No</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, toRefs } from "vue";
  
  export default defineComponent({
    name: "Confirmation",
    props: {
      title: {
        type: String,
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
    },
    emits: ["confirmed", "cancelled"],
    setup(props, { emit }) {
      const { title, question } = toRefs(props);
  
      // Method to handle the confirm action
      const confirmAction = () => {
        emit("confirmed");
      };
  
      // Method to handle the cancel action
      const cancelAction = () => {
        emit("cancelled");
      };
  
      return {
        title,
        question,
        confirmAction,
        cancelAction,
      };
    },
  });
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
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    text-align: center;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  
  </style>
  