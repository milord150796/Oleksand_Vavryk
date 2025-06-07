import { createRouter, createWebHistory } from 'vue-router';
import PostsList from '../views/PostsList.vue';
import PostDetails from '../views/PostDetails.vue';

const routes = [
  {
    path: '/',
    name: 'PostsList',
    component: PostsList,
  },
  {
    path: '/post/:id',
    name: 'PostDetails',
    component: PostDetails
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;