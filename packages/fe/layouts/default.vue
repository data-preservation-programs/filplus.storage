<template>
  <div class="main-container">

    <Toaster />

    <SiteHeader />

    <nuxt />

    <SiteFooter />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import Toaster from '@/modules/toaster/components/toaster'

// ====================================================================== Export
export default {
  name: 'LayoutDefault',

  components: {
    SiteHeader,
    SiteFooter,
    Toaster
  },

  data () {
    return {
      socket: false,
      networkErrorToastId: false
    }
  },

  computed: {
    ...mapGetters({
      account: 'auth/account'
    })
  },

  watch: {
    async account (accountAfter, accountBefore) {
      if (accountAfter.hasOwnProperty('_id') && !accountBefore.hasOwnProperty('_id')) {
        await this.$connectWebsocket(this, () => {
          this.joinUserWebsocketRoom(accountAfter)
        })
      }
    }
  },

  async created () {
    await this.$store.dispatch('general/getBaseData', 'general')
  },

  async mounted () {
    // Scroll to hash
    this.$nextTick(() => {
      const hash = this.$route.hash.replace('#', '')
      if (hash) {
        const element = document.getElementById(hash) || document.querySelector(`[data-id='${hash}']`)
        if (element) {
          this.$scrollToElement(element, 200, -100)
        }
      }
    })
    // Initialize global connections
    await this.$connectWebsocket(this, () => {
      if (this.account) {
        this.joinUserWebsocketRoom(this.account)
      }
      this.socket.emit('join-room', 'global')
      this.socket.on('cron|app-version-changed|payload', (message) => {
        this.$toaster.add({
          type: 'toast',
          category: 'success',
          message
        })
      })
      this.socket.on('module|kyc-updated|payload', (account) => {
        if (this.account) {
          this.setAccount(account)
        }
      })
      this.socket.on('disconnect', async () => {
        this.networkErrorToastId = await this.$toaster.add({
          type: 'toast',
          category: 'error',
          message: '❗️ Disconnected, trying to reconnect...',
          timeout: Infinity
        })
      })
      this.$toaster.replace(this.networkErrorToastId, {
        id: this.networkErrorToastId,
        type: 'toast',
        category: 'success',
        message: '...and we\'re back! 🚀',
        timeout: 2000
      })
      this.networkErrorToastId = false
    })
    // Check to see if saved form exists in localStorage
    if (this.$ls.get('form__filplus_application')) {
      this.setSavedFormExistsStatus(true)
    }
  },

  methods: {
    ...mapActions({
      setSavedFormExistsStatus: 'form/setSavedFormExistsStatus',
      setAccount: 'auth/setAccount'
    }),
    joinUserWebsocketRoom (account) { // every user joins their own room upon logging in
      this.socket.emit('join-room', account._id)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.main-container {}
</style>
