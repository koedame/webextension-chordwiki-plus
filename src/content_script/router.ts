import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 参考: https://qiita.com/hshota28/items/765cf903f055754f7557#dynamic-import
function loadView(view: string) {
  return () => import(/* webpackChunkName: "view-[request]" */ `./pages/${view}.vue`);
}

export default new Router({
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: loadView('Home'),
    },
    {
      path: '/ranking.html',
      name: 'ranking',
      component: loadView('Ranking'),
    },
    {
      path: '/ranking101.html',
      name: 'ranking101',
      component: loadView('Ranking101'),
    },
    {
      path: '/wiki.cgi',
      // 参考: https://stackoverflow.com/questions/44797824/matching-query-param-in-vue-routes
      beforeEnter(to, from, next) {
        if (to.query.c === 'view') {
          next({ name: 'song', query: to.query });
        }
      },
    },
    {
      path: '/wiki.cgi',
      name: 'song',
      component: loadView('Song'),
    },
  ],
});
