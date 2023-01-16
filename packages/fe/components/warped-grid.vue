<template>
  <svg
    ref="grid"
    width="1109"
    height="1109"
    viewBox="0 0 1109 1109"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <rect
      x="1.5"
      y="1.5"
      width="1106"
      height="1106"
      stroke="#4D655F"
      stroke-width="3" />
    <path d="M37 2V1107.5" stroke="#4D655F" />
    <path d="M71.5 2V1107.5" stroke="#4D655F" />
    <path d="M106 2V1107.5" stroke="#4D655F" />
    <path d="M140.5 2V1107.5" stroke="#4D655F" />
    <path d="M175 2V1107.5" stroke="#4D655F" />
    <path d="M209.5 2V1107.5" stroke="#4D655F" />
    <path d="M244 2V1107.5" stroke="#4D655F" />
    <path d="M278.5 2V1107.5" stroke="#4D655F" />
    <path d="M313 2V1107.5" stroke="#4D655F" />
    <path d="M347.5 2V1107.5" stroke="#4D655F" />
    <path d="M382 2V1107.5" stroke="#4D655F" />
    <path d="M416.5 2V1107.5" stroke="#4D655F" />
    <path d="M451 2V1107.5" stroke="#4D655F" />
    <path d="M485.5 2V1107.5" stroke="#4D655F" />
    <path d="M520 2V1107.5" stroke="#4D655F" />
    <path d="M554.5 2V1107.5" stroke="#4D655F" />
    <path d="M589 2V1107.5" stroke="#4D655F" />
    <path d="M623.5 2V1107.5" stroke="#4D655F" />
    <path d="M658 2V1107.5" stroke="#4D655F" />
    <path d="M692.5 2V1107.5" stroke="#4D655F" />
    <path d="M727 2V1107.5" stroke="#4D655F" />
    <path d="M761.5 2V1107.5" stroke="#4D655F" />
    <path d="M796 2V1107.5" stroke="#4D655F" />
    <path d="M830.5 2V1107.5" stroke="#4D655F" />
    <path d="M865 2V1107.5" stroke="#4D655F" />
    <path d="M899.5 2V1107.5" stroke="#4D655F" />
    <path d="M934 2V1107.5" stroke="#4D655F" />
    <path d="M968.5 2V1107.5" stroke="#4D655F" />
    <path d="M1003 2V1107.5" stroke="#4D655F" />
    <path d="M1037.5 2V1107.5" stroke="#4D655F" />
    <path d="M1072 2V1107.5" stroke="#4D655F" />
    <path d="M2 1072H1107.5" stroke="#4D655F" />
    <path d="M2 1037.5H1107.5" stroke="#4D655F" />
    <path d="M2 1003L1107.5 1003" stroke="#4D655F" />
    <path d="M2 968.5L1107.5 968.5" stroke="#4D655F" />
    <path d="M2 934L1107.5 934" stroke="#4D655F" />
    <path d="M2 899.5L1107.5 899.5" stroke="#4D655F" />
    <path d="M2 865L1107.5 865" stroke="#4D655F" />
    <path d="M2 830.5L1107.5 830.5" stroke="#4D655F" />
    <path d="M2 796L1107.5 796" stroke="#4D655F" />
    <path d="M2 761.5L1107.5 761.5" stroke="#4D655F" />
    <path d="M2 727L1107.5 727" stroke="#4D655F" />
    <path d="M2 692.5L1107.5 692.5" stroke="#4D655F" />
    <path d="M2 658L1107.5 658" stroke="#4D655F" />
    <path d="M2 623.5L1107.5 623.5" stroke="#4D655F" />
    <path d="M2 589L1107.5 589" stroke="#4D655F" />
    <path d="M2 554.5L1107.5 554.5" stroke="#4D655F" />
    <path d="M2 520L1107.5 520" stroke="#4D655F" />
    <path d="M2 485.5L1107.5 485.5" stroke="#4D655F" />
    <path d="M2 451L1107.5 451" stroke="#4D655F" />
    <path d="M2 416.5L1107.5 416.5" stroke="#4D655F" />
    <path d="M2 382L1107.5 382" stroke="#4D655F" />
    <path d="M2 347.5L1107.5 347.5" stroke="#4D655F" />
    <path d="M2 313L1107.5 313" stroke="#4D655F" />
    <path d="M2 278.5L1107.5 278.5" stroke="#4D655F" />
    <path d="M2 244L1107.5 244" stroke="#4D655F" />
    <path d="M2 209.5L1107.5 209.5" stroke="#4D655F" />
    <path d="M2 175L1107.5 175" stroke="#4D655F" />
    <path d="M2 140.5L1107.5 140.5" stroke="#4D655F" />
    <path d="M2 106L1107.5 106" stroke="#4D655F" />
    <path d="M2 71.5L1107.5 71.5" stroke="#4D655F" />
    <path d="M2 37L1107.5 37" stroke="#4D655F" />
  </svg>
</template>

<script>
// ====================================================================== Import
import Warp from 'warpjs'

// =================================================================== Functions
const gaussian = (x, y, w) => {
  const slope = 250
  const hw = w / 2
  const buffer = 100
  const intensity = 250
  const u = x - hw
  const v = y - hw
  const z = intensity * Math.exp(-0.5 * (Math.pow(u / slope, 2) + Math.pow(v / slope, 2)))
  const scalar = ((hw * hw) - (u * u + v * v)) / (hw * hw)
  if (scalar < 0.0001) {
    return 0
  }
  return z * scalar
}

// ====================================================================== Export
export default {
  name: 'WarpedGrid',

  data () {
    return {
      slope: 250,
      intensity: 700,
      svgWidth: 1109,
      svgHeight: 1109
    }
  },

  mounted () {
    this.$nextTick(() => {
      if (this.$refs.grid) {
        const svg = this.$refs.grid
        const warp = new Warp(svg)
        const centre = this.svgWidth / 2
        warp.interpolate(4)
        warp.transform(([x, y]) => [
          // x - this.intensity * (Math.exp(-0.5 * Math.pow((x - centre) / this.slope, 2)) / Math.sqrt(2 * Math.PI)) * (0.5 * Math.sin((y - (centre / 2)) * Math.PI / centre) + 0.5),
          // y - this.intensity * (Math.exp(-0.5 * Math.pow((y - centre) / this.slope, 2)) / Math.sqrt(2 * Math.PI)) * (0.5 * Math.sin((x - (centre / 2)) * Math.PI / centre) + 0.5)
          x - gaussian(x, y, this.svgWidth),
          y - gaussian(x, y, this.svgWidth)
        ])
      }
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.warp-image {
  display: block;
  overflow: visible;
  margin-top: -3px;
}
</style>
