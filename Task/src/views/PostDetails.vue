<template>
  <div class="post-details-container">
    <router-link to="/" class="back-link">&larr; До списку постів</router-link>

    <div v-if="loading" class="loading-message">Завантаження поста...</div>
    <div v-else-if="!postsStore.currentPost" class="not-found-message">Пост не знайдено.</div>
    <div v-else class="post-content-section">
      <h1>{{ postsStore.currentPost.title }}</h1>
      <p class="post-body">{{ postsStore.currentPost.body }}</p>

      <hr>

      <h2>Коментарі</h2>
      <div v-if="commentsLoading" class="loading-message">Завантаження коментарів...</div>
      <div v-else-if="!commentsStore.commentsByPostId[id] || commentsStore.commentsByPostId[id].length === 0" class="no-comments-message">
        Будьте першим, хто прокоментує!
      </div>
      <div v-else class="comments-list">
        <div v-for="comment in commentsStore.commentsByPostId[id]" :key="comment.id" class="comment-item">
          <p class="comment-body">"{{ comment.body }}"</p>
          <p class="comment-author">— Автор: {{ comment.user ? comment.user.username : 'Анонім' }}</p>
        </div>
      </div>

      <div class="add-comment-section">
        <h3>Додати коментар</h3>
        <form @submit.prevent="submitComment" class="comment-form">
          <textarea
            v-model="newCommentBody"
            placeholder="Ваш коментар..."
            rows="4"
            required
            class="comment-textarea"
          ></textarea>
          <button type="submit" :disabled="submittingComment" class="submit-button">
            {{ submittingComment ? 'Надсилання...' : 'Додати коментар' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePostsStore } from '../stores/posts';
import { useCommentsStore } from '../stores/comments';

const route = useRoute();
const id = parseInt(route.params.id);

const postsStore = usePostsStore();
const commentsStore = useCommentsStore();

const loading = ref(true);
const commentsLoading = ref(true);
const newCommentBody = ref('');
const submittingComment = ref(false);

const fetchData = async () => {
  loading.value = true;
  commentsLoading.value = true;
  await postsStore.fetchPostById(id);
  await commentsStore.fetchCommentsForPost(id);
  loading.value = false;
  commentsLoading.value = false;
};

onMounted(fetchData);
watch(() => route.params.id, fetchData); // Оновлюємо дані при зміні ID в URL

const submitComment = async () => {
  if (!newCommentBody.value.trim()) return;

  submittingComment.value = true;
  try {
    // В dummyjson.com/comments/add `userId` обов'язковий. Використовуємо статичний 1.
    await commentsStore.addComment(id, newCommentBody.value);
    newCommentBody.value = ''; // Очистити поле після надсилання
  } catch (error) {
    console.error('Error adding comment:', error);
    alert('Помилка при додаванні коментаря. Спробуйте ще раз.');
  } finally {
    submittingComment.value = false;
  }
};
</script>

<style scoped>
.post-details-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 25px;
  background-color: #fefefe;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-link {
  display: inline-block;
  margin-bottom: 25px;
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #0056b3;
}

.loading-message, .not-found-message {
  text-align: center;
  font-size: 1.3em;
  color: #666;
  padding: 40px 0;
}

.not-found-message {
  color: #dc3545;
}

.post-content-section h1 {
  font-size: 2.5em;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.post-body {
  font-size: 1.1em;
  line-height: 1.8;
  color: #444;
  margin-bottom: 30px;
  text-align: justify;
}

hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 40px 0;
}

h2 {
  font-size: 2em;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
}

.no-comments-message {
  text-align: center;
  font-style: italic;
  color: #777;
  margin-bottom: 30px;
}

.comments-list {
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.comment-item {
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.comment-item:last-child {
  margin-bottom: 0;
}

.comment-body {
  font-style: italic;
  color: #333;
  line-height: 1.6;
  margin-bottom: 8px;
}

.comment-author {
  text-align: right;
  font-size: 0.9em;
  color: #666;
  font-weight: bold;
}

.add-comment-section {
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 30px;
}

.add-comment-section h3 {
  font-size: 1.7em;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.comment-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
  resize: vertical;
  min-height: 100px;
  box-sizing: border-box; /* Важливо для коректної ширини з padding */
}

.comment-textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 6px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease, opacity 0.2s ease;
  align-self: flex-end; /* Вирівнювання кнопки по правому краю */
}

.submit-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}
</style>