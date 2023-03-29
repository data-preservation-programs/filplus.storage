<template>
  <div :class="['toast', category, { unpopping } ]">

    <div class="panel-top">

      <div class="icon">
        <IconCheckmark
          v-if="category === 'success'"
          fill="white" />
        <IconCaution
          v-if="category === 'caution' || category === 'error'"
          fill="white" />
      </div>

      <div class="message">
        {{ message }}
      </div>

    </div>

    <div v-if="submessages" class="submessages">
      <div
        v-for="(submessage, index) in submessages"
        :key="index"
        class="submessage">
        {{ submessage }}
      </div>
    </div>

  </div>
</template>

<script>
// ===================================================================== Imports
import Config from '@/nuxt.config'

import IconCheckmark from '@/components/icons/checkmark'
import IconCaution from '@/components/icons/caution'

// ====================================================================== Export
export default {
  name: 'Toast',

  components: {
    IconCheckmark,
    IconCaution
  },

  props: {
    toast: {
      type: Object,
      required: true
    }
  },

  data: function () {
    return {
      unpopping: false
    }
  },

  computed: {
    id () {
      return this.toast.id
    },
    category () {
      return this.toast.category
    },
    message () {
      return this.toast.message
    },
    defaultTimeout () {
      return Config.toaster.timeout
    },
    submessages () {
      return this.toast.submessages
    },
    timeout () {
      return this.toast.timeout || this.defaultTimeout || 5000
    }
  },

  mounted () {
    const unpopTimeout = this.timeout - 250
    const timeout = setTimeout(() => {
      this.$toaster.remove(this.id)
      clearTimeout(timeout)
    }, this.timeout)
    const unpop = setTimeout(() => {
      this.unpopping = true
      clearTimeout(unpop)
    }, unpopTimeout)
  }
}
</script>

<style lang="scss" scoped>
$toastSuccess: green;
$toastCaution: darkorange;
$toastError: red;

// ///////////////////////////////////////////////////////////////////// General
.toast {
  position: relative;
  animation: poppingToast 250ms ease-in-out forwards;
  @include shadow1;
  width: 30rem;
  overflow: hidden;
  @include customMaxMQ (32rem) {
    width: 100%;
  }
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
  &.unpopping {
    animation: unpoppingToast 250ms ease-in-out forwards;
  }
}

.panel-top {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.icon {
  margin-right: 1rem;
  @include customMaxMQ (32rem) {
    display: none;
  }
  .caution-svg-icon {
    width: 1.125rem;
  }
  .checkmark-svg-icon {
    width: 1rem;
  }
}

// ///////////////////////////////////////////////////////////////////// Message
.message {
  font-size: inherit;
  line-height: 1;
  text-align: center;
}

.submessages {
  margin-top: 1rem;
}

.submessage {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-align: center;
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
}

// ////////////////////////////////////////////////////////////////// Animations
@keyframes poppingToast {
  from { top: -6rem; }
  to { top: 0; }
}

@keyframes unpoppingToast {
  from { top: 0; }
  to { top: -6rem; }
}

</style>
