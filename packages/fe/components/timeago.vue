<script>
// ====================================================================== Export
export default {
  name: 'Timeago',

  props: {
    date: {
      type: Date,
      required: true
    }
  },

  data () {
    return {
      convertedDate: '',
      interval: false,
      timing: 1000 // default: poll every second
    }
  },

  mounted () {
    this.convertedDate = this.$timeago(this.date)
    this.setInterval()
  },

  beforeDestroy () {
    clearInterval(this.interval)
  },

  methods: {
    /*
     * If now < 1 mins from this.date, then poll every second; else poll every minute
     */
    setInterval () {
      const oneMinute = 60 * 1000
      const incoming = new Date(this.date).getTime()
      this.interval = setInterval(() => {
        const now = Date.now()
        const overTwoMinutes = now > incoming + oneMinute
        if (overTwoMinutes) {
          clearInterval(this.interval)
          this.timing = oneMinute // poll every minute
          this.setInterval()
        }
        this.convertedDate = this.$timeago(this.date)
      }, this.timing)
    }
  },

  render () {
    return this.$scopedSlots.default({
      convertedDate: this.convertedDate
    })
  }
}
</script>
