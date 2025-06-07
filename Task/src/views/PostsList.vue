<template>
  <div class="posts-list-container">
    <h1>Список постів</h1>
    <div v-if="loading" class="loading-message">Завантаження постів...</div>
    <div v-else class="posts-grid">
      <div v-for="post in postsStore.posts" :key="post.id" class="post-card">
        <h2>{{ post.title }}</h2>
        <p>{{ post.body.substring(0, 100) }}...</p>
        <router-link :to="`/post/${post.id}`" class="details-link">Детальніше</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { usePostsStore } from '../stores/posts';

const postsStore = usePostsStore();
const loading = ref(true);

onMounted(async () => {
  await postsStore.fetchPosts();
  loading.value = false;
});
</script>

<style scoped>
.posts-list-container {
  max-width: 960px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.loading-message {
  text-align: center;
  font-size: 1.2em;
  color: #666;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.post-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-card h2 {
  font-size: 1.5em;
  color: #007bff;
  margin-top: 0;
  margin-bottom: 10px;
}

.post-card p {
  font-size: 1em;
  color: #555;
  line-height: 1.6;
  flex-grow: 1; 
  margin-bottom: 15px;
}

.details-link {
  display: inline-block;
  background-color: #28a745;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s ease;
  align-self: flex-start;
}
.details-link:hover {
  background-color: #218838;
}
</style>