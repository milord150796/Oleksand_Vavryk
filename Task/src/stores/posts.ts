import { defineStore } from 'pinia';

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    currentPost: null,
  }),
  actions: {
    async fetchPosts() {
      if (this.posts.length === 0) {
        console.log('Отримання всіх публікацій...');
        const response = await fetch('https://dummyjson.com/posts');
        const data = await response.json();
        this.posts = data.posts;
      } else {
        console.log('в Магазині вже є публікації.');
      }
    },
    async fetchPostById(id) {
      if (!this.currentPost || this.currentPost.id !== id) {
        console.log(`Отримання публікації по ID: ${id}...`);
        const response = await fetch(`https://dummyjson.com/posts/${id}`);
        const data = await response.json();
        this.currentPost = data;
      } else {
        console.log(`Публікация ${id} готова.`);
      }
    },
  },
});