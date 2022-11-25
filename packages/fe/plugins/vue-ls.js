import Vue from 'vue'
import Storage from 'vue-ls'

Vue.use(Storage, {
  namespace: 'slinghsot__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
})
