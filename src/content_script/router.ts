import Vue from 'vue';
import Router from 'vue-router';

//@ts-ignore
import Song from './pages/Song';
//@ts-ignore
import Home from './pages/Home';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/wiki.cgi',
      // 参考: https://stackoverflow.com/questions/44797824/matching-query-param-in-vue-routes
      beforeEnter(to, from, next) {
        if (to.query.c === 'view') {
          next({ name: 'Song', query: to.query });
        }
      },
    },
    {
      path: '/wiki.cgi',
      name: 'Song',
      component: Song,
    },
  ],
});
