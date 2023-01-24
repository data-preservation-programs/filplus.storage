<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'

// ====================================================================== Export
export default {
  name: 'Logout',

  methods: {
    ...mapActions({
      logout: 'auth/logout'
    })
  },

  render () {
    return this.$scopedSlots.default({
      logout: this.logout
    })
  }
}
</script>
