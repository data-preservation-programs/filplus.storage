<template>
  <div class="array">

    <slot
      :groups="groups"
      :add-group="addGroup"
      :remove-group="removeGroup" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapActions } from 'vuex'

import CloneDeep from 'lodash/cloneDeep'

// ====================================================================== Export
export default {
  name: 'FormArray',

  props: {
    formScaffold: {
      type: Object,
      required: true
    },
    field: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      groups: []
    }
  },

  fetch () {
    CloneDeep(this.field.value).forEach(entry => this.addGroup(entry))
  },

  computed: {
    template () {
      return this.field.scaffold.template
    },
    templateAsEntry () {
      return Object.keys(this.field.scaffold.template).reduce((acc, key) => {
        acc[key] = ''
        return acc
      }, {})
    }
  },

  mounted () {
    this.$nuxt.$on('fieldValueUpdated', (field) => {
      const parentModelKey = field.scaffold.parentModelKey
      if (parentModelKey && parentModelKey === this.field.modelKey) {
        this.applyValueToParent('update-field', field.scaffold, field.value)
      }
    })
  },

  methods: {
    ...mapActions({
      setField: 'form/setField'
    }),
    addGroup (entry = this.templateAsEntry) {
      const id = `${this.$uuid.v4()}`
      const group = { id, scaffolds: [] }
      Object.keys(entry).forEach((key) => {
        const fieldKey = CloneDeep(this.template[key])
        const scaffold = CloneDeep(this.formScaffold[fieldKey])
        scaffold.defaultValue = entry[key]
        scaffold.groupId = id
        scaffold.fieldKey = key
        group.scaffolds.push(scaffold)
      })
      this.groups.push(group)
      if (process.client) {
        this.applyValueToParent('add-group', null, this.templateAsEntry)
      }
    },
    removeGroup (index) {
      this.groups.splice(index, 1)
      this.applyValueToParent('remove-group', null, index)
    },
    async applyValueToParent (type, scaffold, value) {
      await console.log(this.groups)
      const field = CloneDeep(this.field)
      if (type === 'update-field') {
        const groupIndex = this.groups.findIndex(group => group.id === scaffold.groupId)
        field.value[groupIndex][scaffold.fieldKey] = value
      } else if (type === 'add-group') {
        field.value.push(value)
      } else if (type === 'remove-group') {
        field.value.splice(value, 1)
      }
      await this.setField(field)
    }
  }
}
</script>
