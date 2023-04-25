<template>
  <div
    ref="column"
    class="warped-grid-column">
    <WarpedGrid
      v-for="(grid, i) in grids"
      ref="canvases"
      :key="`warped-grid-canvas-${i}`"
      :animation-active="activeGrids.includes(i)"
      :style="{ top: `${i * gridHeight}px` }"
      class="warp-animation" />
  </div>
</template>

<script>
// ====================================================================== Import
import WarpedGrid from '@/components/warped-grid'

// =================================================================== Functions
const calculateColumnHeight = (instance) => {
  const column = instance.$refs.column
  const grids = Math.ceil(column.clientHeight / instance.gridHeight)
  if (instance.grids !== grids) {
    instance.grids = grids
  }
  const canvases = instance.$refs.canvases
  const active = instance.activeGrids
  if (Array.isArray(canvases)) {
    const len = instance.grids || 0
    for (let i = 0; i < len; i++) {
      const canvas = canvases[i]
      if (canvas) {
        const rect = canvas.$el.getBoundingClientRect()
        const top = rect.top
        const bottom = top + rect.height
        if (bottom > 0 && top < window.innerHeight) {
          if (!active.includes(i)) {
            active.push(i)
            instance.activeGrids = active
          }
        } else {
          if (active.includes(i)) {
            instance.activeGrids = active.filter(n => n !== i)
          }
        }
      }
    }
  }
}

// ====================================================================== Export
export default {
  name: 'WarpedGridColumn',

  components: {
    WarpedGrid
  },

  data () {
    return {
      scroll: false,
      gridHeight: 1121,
      grids: false,
      activeGrids: [0]
    }
  },

  mounted () {
    this.$nextTick(() => {
      calculateColumnHeight(this)
      this.scroll = this.$throttle(() => { calculateColumnHeight(this) }, 50)
      window.addEventListener('scroll', this.scroll)
    })
  },

  beforeDestroy () {
    if (this.scroll) { window.removeEventListener('scroll', this.scroll) }
  }
}

</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.warped-grid-column {
  position: relative;
  height: calc(100% + 1rem + 3px);
  width: 1121px;
  overflow: hidden;
}

.warp-animation {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
