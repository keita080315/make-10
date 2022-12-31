import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignIn from '../views/SignIn.vue';
import Room from "../views/Room.vue";
import Result from "../views/Result.vue";
import WaitMatch from "../views/WaitMatch.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: "/about",
      name: "about",
      meta: { requiresAuth: true },
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/signIn",
      name: "SignIn",
      component: SignIn,
    },
    {
      path: "/room/:roomId",
      name: "room",
      component: Room,
      meta: { requiresAuth: true },
    },
    {
      path: "/result",
      name: "result",
      component: Result,
      meta: { requiresAuth: true },
    },
    {
      path: "/wait/:docId",
      name: "waitMatch",
      component: WaitMatch,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    // 認証状態を取得
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        next()
      } else {
        // 認証されていない場合、認証画面へ
        next({ name: 'SignIn' })
      }
    })
  } else {
    next()
  }
})

export default router;
