import Vue from 'vue';
import Router from 'vue-router';

//@ts-ignore
import SongPage from './pages/Song';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
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
      component: SongPage,
    },
  ],
});
