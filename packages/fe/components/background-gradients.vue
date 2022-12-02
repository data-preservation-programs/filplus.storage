<template>
  <div class="background-gradients">

    <svg
      width="1007"
      height="1789"
      viewBox="0 0 1007 1789"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="top-path">
      <path
        d="M737 75L891 324.5L880.5 828.5L550 1355.5L-29.5 1689M136.5 75L405.5 388L395.5 764L245.5 1060.5L-29.5 1266.5"
        stroke-width="230" />
    </svg>

    <svg
      v-for="i in paths"
      :key="`gradient-path-${i}`"
      width="1401"
      height="2171"
      viewBox="0 0 1401 2171"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      :class="['repeated-path', { rotate: i !== 1}]"
      :style="{ top: `${(i - 1) * offset}px` }">
      <path
        d="M1138 42L1274.5 392.5L1285 828L1066.5 1407.5L647.5 1843L22.5 2137.5"
        stroke-width="230" />
    </svg>

  </div>
</template>

<script>
// ====================================================================== Import
import Throttle from 'lodash/throttle'
// =================================================================== Functions
const getRepeatedPathAmount = (instance) => {
  const footer = document.getElementById('site-footer')
  if (footer) {
    const rect = footer.getBoundingClientRect()
    const num = Math.max(1, Math.ceil((rect.top - 2171) / instance.offset))
    if (instance.paths !== num) {
      instance.paths = num
    }
  }
}

// ====================================================================== Export
export default {
  name: 'BackgroundGradients',

  data () {
    return {
      paths: 1,
      offset: 470,
      resize: false
    }
  },

  mounted () {
    getRepeatedPathAmount(this)
    this.resize = Throttle(() => { getRepeatedPathAmount(this) }, 10)
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy () {
    if (this.resize) {
      window.removeEventListener('resize', this.resize)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.background-gradients {
  position: absolute;
  width: toRem(1440);
  left: calc(50vw - 720px);
  filter: blur(1.5rem);
  svg {
    filter: blur(1.5rem);
    path {
      stroke: $swamp;
    }
  }
}

.top-path {
  transform: translateY(-5rem);
}

.repeated-path {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(5deg) translateX(3rem);
  &.rotate {
    transform: rotate(20deg) translate(10rem, 200px);
  }
}
</style>
