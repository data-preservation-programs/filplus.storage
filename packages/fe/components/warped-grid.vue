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

  ctx.clearRect(0, 0, width, height)
  
  const sv = vertical * params.resolution
  const sh = horizontal * params.resolution
  const hw = width / 2
  const z = frame * speed * Math.PI

  ctx.lineWidth = params.lineWidth
  ctx.strokeStyle = '#4D655F'

  for (let i = 1; i <= vertical; i++) {
    ctx.beginPath()
    const x = i * unit
    ctx.moveTo(
      x - (gaussianSmoothStep(x, 0, hw) * Math.cos(z)),
      0 - (gaussianSmoothStep(x, 0, hw) * Math.cos(z + speed * Math.sin(z)))
    )
    for (let j = 1; j <= sh; j++) {
      const y = (j / sh) * height
      ctx.lineTo(
        x - (gaussianSmoothStep(x, y, hw) * Math.cos(z)),
        y - (gaussianSmoothStep(x, y, hw) * Math.cos(z + speed * Math.sin(z)))
      )
    }
    ctx.stroke()
  }

  for (let i = 1; i <= horizontal; i++) {
    ctx.beginPath()
    const y = i * unit
    ctx.moveTo(
      0 - (gaussianSmoothStep(0, y, hw) * Math.cos(z)),
      y - (gaussianSmoothStep(0, y, hw) * Math.cos(z + speed * Math.sin(z)))
    )
    for (let j = 1; j <= sv; j++) {
      const x = (j / sv) * width
      ctx.lineTo(
        x - (gaussianSmoothStep(x, y, hw) * Math.cos(z)),
        y - (gaussianSmoothStep(x, y, hw) * Math.cos(z + speed * Math.sin(z)))
      )
    }
    ctx.stroke()
  }
}

// ====================================================================== Export
export default {
  name: 'WarpedGrid',

  data () {
    return {
      colors: ['white', 'pink', 'purple', 'orange', 'green'],
      ctx: false,
      frame: 0,
      frameId: false,
      params: {
        verticalLines: 32,
        horizontalLines: 32,
        cellWidth: 33,
        lineWidth: 1,
        resolution: 4,
        speed: 0.0005
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
        this.animate()
      })
    })
  },

  methods: {
    animate () {
      if (this.frame % 2 === 0) {
        renderGridOnCanvas(this, this.frame)
      }
      this.frame++
      this.frameId = requestAnimationFrame(this.animate)
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
