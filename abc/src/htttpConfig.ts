const handlers = {
  200: response => response,
  401: (response, app) => {
    app.router.push({
      name: 'login'
    })
  },
  default: (error, app) => {
    return Promise.reject(error);
  }
}

export default {
  config: {
    baseURL: '/',
    withCredentials: true
  },
  handlers,
}
