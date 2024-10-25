<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';

const userId = ref('');
const users = ref(null);
const newEmail = ref('');
const error = ref('');

const getUser = async () => {
  try {
    error.value = '';
    if (!userId.value || !/^\d+$/.test(userId.value)) {
      error.value = 'Please enter a valid user ID';
      return;
    }
    
    const response = await fetch(`http://localhost:3000/api/user/${userId.value}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    users.value = await response.json();
  } catch (e) {
    console.error('Error fetching user:', e);
    error.value = 'Error fetching user data';
  }
};

const changeEmail = async () => {
  try {
    error.value = '';
    if (!newEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail.value)) {
      error.value = 'Please enter a valid email address';
      return;
    }
    
    const response = await fetch(`http://localhost:3000/api/user/${userId.value}/change-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email: newEmail.value }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    alert(result.message);
  } catch (e) {
    console.error('Error changing email:', e);
    error.value = 'Error updating email';
  }
};
</script>

<template>
  <div id="app">
    <h1>User Dashboard</h1>
    
    <div class="error-message" v-if="error">{{ error }}</div>
    
    <div>
      <input 
        v-model="userId" 
        placeholder="Enter User ID" 
        pattern="\d+"
        title="Please enter a valid numeric ID"
      />
      <button @click="getUser" :disabled="!userId">Get User Info</button>
    </div>
    
    <div v-if="users">
      <template v-for="user in users">
        <h2>{{ user.name }}</h2>
        <p>Email: {{ user.email }}</p>
        <hr />
      </template>
    </div>
    
    <CommentSection />
    
    <form @submit.prevent="changeEmail">
      <h3>Change Email</h3>
      <input 
        v-model="newEmail" 
        type="email"
        placeholder="New Email" 
        required
      />
      <button type="submit" :disabled="!newEmail">Submit</button>
    </form>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  margin: 10px 0;
}
</style>
