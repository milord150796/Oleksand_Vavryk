import { defineStore } from 'pinia';

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    commentsByPostId: {}, // Зберігаємо коментарі за postId
  }),
  actions: {
    async fetchCommentsForPost(postId) {
      if (!this.commentsByPostId[postId]) {
        console.log(`Коментарі: ${postId}...`);
        const response = await fetch(`https://dummyjson.com/comments/post/${postId}`);
        const data = await response.json();
        console.log(data);
        this.commentsByPostId[postId] = data.comments;
      } else {
        console.log(`вже існує такий продукт  ${postId} в магазині.`);
      }
    },
    async addComment(postId, body, userId = 131) { // userId за замовчуванням 1
      console.log('додати новий коментарь...');
      const response = await fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: body,
          postId: postId,
          userId: userId,
        }),
      });
      const newComment = await response.json();

      // Додаємо новий коментар до існуючого списку для цього посту
      if (!this.commentsByPostId[postId]) {
        this.commentsByPostId[postId] = [];
      }
      this.commentsByPostId[postId].unshift(newComment); // Додаємо на початок списку
    },
  },
});