<template>
  <div :class="['hubspot-opt-in-fields', { 'opted-in': optedIn }]">

    <div class="heading">
      {{ heading }}
    </div>

    <div class="message" v-html="description" />

    <div class="row">
      <FieldContainer
        :scaffold="formScaffold.hubspot_opt_in_first_name"
        :force-disabled="optedIn"
        field-key="hubspot_opt_in_first_name"
        form-id="filplus_application" />
      <FieldContainer
        :scaffold="formScaffold.hubspot_opt_in_last_name"
        :force-disabled="optedIn"
        field-key="hubspot_opt_in_last_name"
        form-id="filplus_application" />
    </div>

    <FieldContainer
      :scaffold="formScaffold.hubspot_opt_in_email"
      :force-disabled="optedIn"
      field-key="hubspot_opt_in_email"
      form-id="filplus_application" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'HubspotOptInFields',

  components: {
    FieldContainer
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    content () {
      return this.siteContent.general.hubspot
    },
    formScaffold () {
      return this.content.opt_in_fields
    },
    heading () {
      return this.content.opted_in_heading
    },
    description () {
      const optedIn = this.optedIn
      const description = this.content.description
      return optedIn ? description.optedIn : description.notOptedIn
    },
    optedIn () {
      return this.account.hubspotOptIn
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.hubspot-opt-in-fields {
  background-color: rgba($nandor, 0.2);
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  margin-bottom: 3.5rem;
  &.opted-in {
    :deep(.field-container) {
      opacity: 0.5;
      &.checkbox {
        .field-label {
          display: none;
        }
      }
    }
  }
}

.row {
  display: flex;
  flex-direction: row;
  .field-container {
    flex: 1;
    &:first-child {
      margin-right: 2rem;
    }
  }
}

.heading {
  font-size: 1.25rem;
  font-weight: 500;
}

.message {
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.field-container {
  margin-bottom: 0.75rem;
  &:not(:last-child) {
    margin-bottom: 3.5rem;
  }
}
</style>
