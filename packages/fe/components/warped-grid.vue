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
  const a = params.interactionIntensity
  const b = params.pulseIntensity
  // calculation variables
  const sv = vertical * params.resolution
  const sh = horizontal * params.resolution
  const hw = width / 2
  const z = frame * speed * Math.PI
  const vec = instance.vectors
  const dv = -1 * a * vec.aX + b * Math.cos(z)
  const du = -1 * a * vec.aY + b * Math.sin(z + speed * Math.sin(z))

  ctx.clearRect(0, 0, width, height)
  ctx.lineWidth = params.lineWidth
  ctx.strokeStyle = params.color

  for (let i = 1; i <= vertical; i++) {
    ctx.beginPath()
    const x = i * unit
    let g = gaussianSmoothStep(x + dv, 0 + du, hw)
    ctx.moveTo(x - g * dv, 0 - g * du)
    for (let j = 1; j <= sh; j++) {
      const y = (j / sh) * height
      g = gaussianSmoothStep(x + dv, y + du, hw)
      ctx.lineTo(x - g * dv, y - g * du)
    }
    ctx.stroke()
  }

  for (let i = 1; i <= horizontal; i++) {
    ctx.beginPath()
    const y = i * unit
    let g = gaussianSmoothStep(0 + dv, y + du, hw)
    ctx.moveTo(0 - g * dv, y - g * du)
    for (let j = 1; j <= sv; j++) {
      const x = (j / sv) * width
      g = gaussianSmoothStep(x + dv, y + du, hw)
      ctx.lineTo(x - g * dv, y - g * du)
    }
    ctx.stroke()
  }

  updateVectors(instance)
}

const updateMousePosition = (e, instance) => {
  const vec = instance.vectors
  const rect = instance.$refs.canvas.getBoundingClientRect()
  // calculate mouse position
  vec.x = (e.pageX - rect.left - window.scrollX) / rect.width
  vec.y = (e.pageY - rect.top - window.scrollY) / rect.height
}

const updateVectors = (instance) => {
  const vec = instance.vectors
  const params = instance.params
  // calculate displacement from mouse
  vec.dx = vec.x - vec.cgx
  vec.dy = vec.y - vec.cgy
  // create springing effect
  vec.dx *= params.springing
  vec.dy *= params.springing
  vec.aX += vec.dx
  vec.aY += vec.dy
  // move center
  vec.cgx += vec.aX
  vec.cgy += vec.aY
  // slow down springing
  vec.aX *= params.damping
  vec.aY *= params.damping
}

// ====================================================================== Export
export default {
  name: 'WarpedGrid',

  props: {
    animationActive: {
      type: Boolean,
      required: false,
      default: true
    },
    verticalLines: {
      type: Number,
      required: false,
      default: 32
    },
    horizontalLines: {
      type: Number,
      required: false,
      default: 32
    },
    cellWidth: {
      type: Number,
      required: false,
      default: 33
    },
    lineWidth: {
      type: Number,
      required: false,
      default: 1
    },
    resolution: { // number of sublines used to create each side of each cell
      type: Number,
      required: false,
      default: 4
    },
    pulseSpeed: {
      type: Number,
      required: false,
      default: 0.0015
    },
    pulseIntensity: {
      type: Number,
      required: false,
      default: 0.5
    },
    interactionSpringing: {
      type: Number,
      required: false,
      default: 0.001
    },
    interactionDamping: { // values above 1.0 produce divergence
      type: Number,
      required: false,
      default: 0.99
    },
    interactionIntensity: {
      type: Number,
      required: false,
      default: 100
    },
    gridColor: {
      type: String,
      required: false,
      default: '#4D655F'
    }
  },

  data () {
    const params = {
      verticalLines: this.verticalLines,
      horizontalLines: this.horizontalLines,
      cellWidth: this.cellWidth,
      lineWidth: this.lineWidth,
      resolution: this.resolution,
      speed: this.pulseSpeed,
      pulseIntensity: this.pulseIntensity,
      springing: this.interactionSpringing,
      damping: this.interactionDamping,
      interactionIntensity: this.interactionIntensity,
      color: this.gridColor
    }
    return {
      params,
      ctx: false,
      frame: 0,
      frameId: false,
      vectors: {
        x: 0,
        y: 0,
        cgx: 0,
        cgy: 0,
        aX: 0,
        aY: 0,
        dx: 0,
        dy: 0
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
      const canvas = this.$refs.canvas
      if (canvas) {
        canvas.addEventListener('mousemove', (e) => { updateMousePosition(e, this) })
      }
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
