<template>
  <div :class="['hubspot-opt-in-fields', { 'logged-out': !account, 'opted-in': optedIn }]">

    <div class="heading">
      {{ heading }}
    </div>

    <div class="message" v-html="description" />

    <AuthPanel v-if="!account" />

    <div v-else class="form">

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

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import AuthPanel from '@/components/auth-panel'
import FieldContainer from '@/components/form/field-container'

// ====================================================================== Export
export default {
  name: 'HubspotOptInFields',

  components: {
    AuthPanel,
    FieldContainer
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      account: 'auth/account'
    }),
    optedIn () {
      return this.account.hubspotOptIn
    },
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
      if (!this.account) { return description.loggedOut }
      return optedIn ? description.optedIn : description.notOptedIn
    }
  },

  watch: {
    account (incoming) {
      this.setHubspotOptInData(incoming)
      const firstNameField = this.$field('hubspot_opt_in_first_name|filplus_application').get()
      const lastNameField = this.$field('hubspot_opt_in_last_name|filplus_application').get()
      if (firstNameField) { this.$field('hubspot_opt_in_first_name|filplus_application').updateValue(incoming.hubspotOptInFirstName || '') }
      if (lastNameField) { this.$field('hubspot_opt_in_last_name|filplus_application').updateValue(incoming.hubspotOptInLastName || '') }
    }
  },

  methods: {
    ...mapActions({
      setHubspotOptInData: 'account/setHubspotOptInData'
    })
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
  &.logged-out,
  &.opted-in {
    :deep(.field-container) {
      opacity: 0.5;
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
