<template>
  <div class="warped-grid-container">
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight">
    </canvas>
  </div>
</template>

<script>
// =================================================================== Functions
const initCanvas = (instance, next) => {
  const canvas = instance.$refs.canvas
  instance.ctx = canvas.getContext('2d')
  return next()
}

const gaussianSmoothStep = (x, y, r) => {
  const slope = r * 0.5
  const u = x - r
  const v = y - r
  const z = slope * Math.exp(-0.5 * (Math.pow(u / slope, 2) + Math.pow(v / slope, 2)))
  const scalar = ((r * r) - (u * u + v * v)) / (r * r)
  if (scalar < 0.0001) {
    return 0
  }
  return z * scalar
}

const renderGridOnCanvas = (instance, frame) => {
  const ctx = instance.ctx
  const params = instance.params
  const speed = params.speed
  const vertical = params.verticalLines
  const horizontal = params.horizontalLines
  const unit = params.cellWidth + params.lineWidth
  const width = unit * (vertical + 1)
  const height = unit * (horizontal + 1)
  // calculation constants
  const sv = vertical * params.resolution
  const sh = horizontal * params.resolution
  const hw = width / 2
  const z = frame * speed * Math.PI
  const dv = 1 // displacement direction (x)
  const du = 1 // displacement direction (y)
  const dx = dv * Math.cos(z) * 100 // displacement magnitude (x)
  const dy = du * Math.cos(z + speed * Math.sin(z)) * 100 // displacement magnitude (y)
  const bv = 1 // buldge direction (x)
  const bu = 1 // buldge direction (y)

  ctx.clearRect(0, 0, width, height)
  ctx.lineWidth = params.lineWidth
  ctx.strokeStyle = '#4D655F'

  for (let i = 1; i <= vertical; i++) {
    ctx.beginPath()
    const x = i * unit
    let g = gaussianSmoothStep(x + dx, 0 + dy, hw)
    ctx.moveTo(x - g * bv, 0 - g * bu)
    for (let j = 1; j <= sh; j++) {
      const y = (j / sh) * height
      g = gaussianSmoothStep(x + dx, y + dy, hw)
      ctx.lineTo(x - g * bv, y - g * bu)
    }
    ctx.stroke()
  }

  for (let i = 1; i <= horizontal; i++) {
    ctx.beginPath()
    const y = i * unit
    let g = gaussianSmoothStep(0 + dx, y + dy, hw)
    ctx.moveTo(0 - g * bv, y - g * bu)
    for (let j = 1; j <= sv; j++) {
      const x = (j / sv) * width
      g = gaussianSmoothStep(x + dx, y + dy, hw)
      ctx.lineTo(x - g * bv, y - g * bu)
    }
    ctx.stroke()
  }
}

// ====================================================================== Export
export default {
  name: 'WarpedGrid',

  props: {
    animationActive: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data () {
    return {
      ctx: false,
      frame: 0,
      frameId: false,
      params: {
        verticalLines: 32,
        horizontalLines: 32,
        cellWidth: 33,
        lineWidth: 1,
        resolution: 4,
        speed: 0.0015
      }
    }
  },

  computed: {
    canvasWidth () {
      const params = this.params
      return (params.verticalLines * (params.cellWidth + params.lineWidth)) + params.cellWidth
    },
    canvasHeight () {
      const params = this.params
      return (params.horizontalLines * (params.cellWidth + params.lineWidth)) + params.cellWidth
    }
  },

  mounted () {
    this.$nextTick(() => {
      initCanvas(this, () => {
        renderGridOnCanvas(this, 0)
        this.animate()
      })
    })
  },

  beforeDestroy () {
    if (this.frameId) { cancelAnimationFrame(this.frameId) }
  },

  methods: {
    animate () {
      this.frameId = requestAnimationFrame(this.animate)
      if (!this.animationActive) {
        return
      }
      if (this.frame % 2 === 0) {
        renderGridOnCanvas(this, this.frame)
      }
      this.frame++
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.warped-grid-container {
  canvas {
    box-sizing: content-box;
    border: solid 3px #4D655F;
  }
}
</style>
