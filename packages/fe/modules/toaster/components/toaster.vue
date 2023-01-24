<template>
  <div v-if="messages" class="toaster">

    <template v-for="toast in toasts">
      <Toast
        v-if="toast"
        :key="toast.id"
        :toast="toast" />
    </template>

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Toast from '@/modules/toaster/components/toast'

// ====================================================================== Export
export default {
  name: 'Toaster',

  components: {
    Toast
  },

  computed: {
    ...mapGetters({
      messages: 'toaster/messages'
    }),
    toasts () {
      const toasts = this.messages.filter((message) => {
        if (message && message.type === 'toast') { return message }
        return false
      })
      if (toasts.length > 0) { return toasts.reverse() }
      return false
    }
  },

  watch: {
    '$route' (route) {
      this.displayToastFromQuery(route)
    }
  },

  mounted () {
    this.displayToastFromQuery(this.$route)
  },

  methods: {
    ...mapActions({
      addMessage: 'toaster/addMessage'
    }),
    displayToastFromQuery (route) {
      const query = route.query
      const toast = query.toast
      if (toast) {
        this.addMessage(JSON.parse(toast))
        this.$router.replace({ query: Object.assign({ ...query }, { toast: undefined }) })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$padding: 1rem;

// ///////////////////////////////////////////////////////////////////// General
.toaster {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: fixed;
  top: 0;
  left: 50%;
  padding-top: $padding;
  transform: translateX(-50%);
  z-index: 100000;
  @include customMaxMQ (32rem) {
    left: 0;
    width: 100%;
    padding: $padding;
    padding-bottom: 0;
    transform: none;
  }
}
</style>
