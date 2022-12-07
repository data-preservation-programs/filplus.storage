<template>
  <Transition name="liftoff">
    <div
      v-if="open"
      :class="['modal-container', { open }]">

      <Overlay type="noise" />

      <slot></slot>

    </div>
  </Transition>
</template>

<script>
// ====================================================================== Import
import Overlay from '@/components/overlay'

// =================================================================== Functions
const setBodyClasses = (instance) => {
  if (instance.open) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
}

// ====================================================================== Export
export default {
  name: 'NavModal',

  components: {
    Overlay
  },

  props: {
    open: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  watch: {
    open () {
      setBodyClasses(this)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.modal-container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  transition: opacity 0.5s ease;
  animation-fill-mode: forwards;
  &.open {
    animation: landing 300ms cubic-bezier(0.4, 0.0, 0.2, 1.0);
  }
}

// ////////////////////////////////////////////////////////////////// Animations
@keyframes landing {
  from {
    transform: scale(1.1);
    opacity: 0.0;
  }
  to {
    transform: scale(1.0);
    opacity: 1.0;
  }
}

.liftoff-leave-active {
  transform: scale(1.0);
  opacity: 1.0;
}

.liftoff-leave-to {
  transform: scale(1.1);
  opacity: 0.0;
}
</style>
