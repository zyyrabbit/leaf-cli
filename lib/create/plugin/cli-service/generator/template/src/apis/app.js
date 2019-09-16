import http from '@/apis';

export let getApp = function() {
  return http.get('/test')
}

export default {
  getApp
}