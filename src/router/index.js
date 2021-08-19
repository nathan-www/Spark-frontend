import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: "Spark - Privacy-first Video Meetings"
    }
  },
  {
    path: '/account/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: "Spark - Login"
    }
  },
  {
    path: '/account/token/:token',
    name: 'Token',
    component: () => import('../views/Token.vue'),
    meta: {
      title: "Spark - Login"
    }
  },
  {
    path: '/meetings',
    name: 'Meetings',
    component: () => import('../views/Meetings.vue'),
    meta: {
      title: "Spark - Your Meetings"
    }
  },
  {
    path: '/meeting/:meeting_id',
    name: "Meeting",
    component: () => import('../views/Meeting.vue'),
    meta: {
      title: "Spark - Meeting"
    }
  },
  {
    path: '/terms',
    name: "Terms",
    component: () => import('../views/Terms.vue'),
    meta: {
      title: "Spark - Terms of Service"
    }
  },
  {
    path: '/privacy',
    name: "Privacy",
    component: () => import('../views/Privacy.vue'),
    meta: {
      title: "Spark - Privacy Policy"
    }
  },
  {
    path: '/:join_link(\[a-f0-9-]{10,}\)',
    name: "JoinByLink",
    component: () => import('../views/JoinByLink.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: "404",
    component: () => import('../views/404.vue'),
    meta: {
      title: "Spark - Not Found"
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if(previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
  .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router
