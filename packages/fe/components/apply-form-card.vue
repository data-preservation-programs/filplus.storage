<template>
  <Card
    :icon-text="submitButtonText"
    :class="{ highlighted: applyFormHighlighted }"
    corner-position="bottom-right"
    icon="arrow"
    @clicked="submitForm">
    <template v-if="formScaffold">

      <div class="form-heading">
        {{ formHeading }}
      </div>

      <form class="form">

        <FieldContainer
          :scaffold="formScaffold.total_datacap_size_range"
          field-key="total_datacap_size_range"
          form-id="filplus_application"
          class="range-field" />

        <div class="row">
          <FieldContainer
            :scaffold="formScaffold.total_datacap_size_input"
            field-key="total_datacap_size_input"
            form-id="filplus_application"
            class="input-field" />
          <FieldContainer
            :scaffold="formScaffold.total_datacap_size_unit"
            field-key="total_datacap_size_unit"
            form-id="filplus_application"
            class="select-field" />
        </div>

      </form>

    </template>
  </Card>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import Card from '@/components/card'
import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'ApplyFormCard',

  components: {
    Card,
    FieldContainer
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      applyFormHighlighted: 'general/applyFormHighlighted'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    form () {
      return this.siteContent.apply.page_content.form
    },
    formScaffold () {
      return this.form.scaffold
    },
    formHeading () {
      return this.form.heading
    },
    submitButtonText () {
      return this.form.submit_button_text
    },
    submitThresholdBottom () {
      return this.generalPageData.forms.submit_threshold_bottom
    },
    submitThresholdMiddle () {
      return this.generalPageData.forms.submit_threshold_middle
    },
    submitThresholdTop () {
      return this.generalPageData.forms.submit_threshold_top
    }
  },

  mounted () {
    this.$nextTick(() => {
      const highlightForm = this.$route.query.highlight_form
      if (highlightForm) {
        this.$highlightApplyForm()
      }
    })
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm'
    }),
    async submitForm (e) {
      e.preventDefault()
      const bottom = this.submitThresholdBottom
      const middle = this.submitThresholdMiddle
      const top = this.submitThresholdTop
      const rangeField = this.$field('total_datacap_size_range|filplus_application').get()
      const bytes = rangeField.value
      const pass = await this.$handleFormRedirection(bytes, bottom, top)
      if (pass) {
        if (bytes >= bottom && bytes < middle) {
          this.$gtm.push({ event: 'redirect_notary_selection' })
          this.$router.push('/apply/general/notaries')
        } else if (bytes >= middle && bytes <= top) {
          this.$gtm.push({ event: 'redirect_lda' })
          this.$router.push('/apply/large')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.form-heading {
  margin-bottom: 2.5rem;
  font-size: toRem(24);
  line-height: leading(35, 24);
  font-weight: 500;
  @include mini {
    font-size: toRem(18);
  }
}

.field-container {
  :deep(.field-label) {
    display: none;
  }
}

.range-field {
  margin-bottom: 2.5rem;
}

.row {
  display: flex;
  flex-direction: row;
}

.input-field {
  position: relative;
  width: 6.25rem;
  margin-right: 1.125rem;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: calc(100% + 0.4375rem);
    width: 0.25rem;
    height: 2px;
    background-color: $titanWhite;
  }
}

.select-field {
  width: 3.75rem;
}
</style>
