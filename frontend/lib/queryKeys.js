export const queryKeys = {
  posts: {
    all: ['posts'],
    lists: () => [...queryKeys.posts.all, 'list'],
    list: (page, limit, search) => [...queryKeys.posts.lists(), { page, limit, search }],
    infiniteLists: () => [...queryKeys.posts.lists(), 'infinite'],
    infiniteList: (limit, search) => [...queryKeys.posts.infiniteLists(), { limit, search }],
    mine: (page, limit) => [...queryKeys.posts.all, 'mine', { page, limit }],
    infiniteMine: (limit) => [...queryKeys.posts.all, 'mine', 'infinite', { limit }],
    details: () => [...queryKeys.posts.all, 'detail'],
    detail: (id) => [...queryKeys.posts.details(), id],
    comments: (postId) => [...queryKeys.posts.all, postId, 'comments'],
  },
  auth: {
    profile: ['auth', 'profile'],
  },
  admin: {
    all: ['admin'],
    stats: () => [...queryKeys.admin.all, 'stats'],
    users: () => [...queryKeys.admin.all, 'users'],
    posts: () => [...queryKeys.admin.all, 'posts'],
    comments: () => [...queryKeys.admin.all, 'comments'],
  },
};
