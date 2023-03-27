<template>
  <section class="table-notaries-list">

    <table class="table-container">
      <!-- ============================================================ Head -->
      <thead class="table-head">
        <tr class="row row-head">

          <th
            v-for="(column, index) in columns"
            :key="`heading-${index}`"
            class="cell cell-head"
            v-html="column.label">
          </th>

        </tr>
      </thead>
      <!-- ============================================================ Body -->
      <FieldStandalone
        v-slot="{ updateValue }"
        :scaffold="formScaffold.notary"
        :validate-across-routes="true"
        field-key="notary"
        form-id="filplus_application"
        root-html-tag="tbody"
        class="table-body">
        <tr
          v-for="notary in filteredNotaries"
          :key="notary.sp_id"
          class="row row-body">

          <td
            v-for="cell in columns"
            :key="cell.slug"
            :class="['cell cell-body', cell.slug]">
            <div :class="['cell-inner-wrapper', `cell-${cell.slug}`]">

              <div
                v-if="cell.label !== ''"
                class="column-label"
                v-html="cell.label" />

              <template v-if="cell.slug === 'name'">
                <div class="notary">
                  <div v-if="notary.name !== ''" class="name">
                    {{ notary.name }}
                  </div>
                  <div v-else-if="notary.organization !== ''" class="organization">
                    {{ notary.organization }}
                  </div>
                  <div class="github-handles">
                    <ButtonX
                      v-for="(handle, index) in notary.github_user"
                      :key="handle"
                      :to="`https://github.com/${handle}`"
                      :data-tooltip="`https://github.com/${handle}`"
                      tag="a"
                      target="_blank"
                      class="github-handle">
                      {{ handle }}<template v-if="index !== notary.github_user.length - 1">,</template>
                    </ButtonX>
                  </div>
                </div>
              </template>

              <template v-if="cell.slug === 'location'">
                <div class="location">
                  {{ notary.location }}
                </div>
              </template>

              <template v-if="cell.slug === 'contact_information'">
                <div class="contact-info">
                  <ButtonX
                    v-if="notary.fil_slack_id !== ''"
                    :data-tooltip="`@${notary.fil_slack_id.replace('@','')}`"
                    class="contact-link">
                    <SlackIcon class="icon icon-slack" />
                  </ButtonX>
                  <ButtonX
                    v-if="notary.website !== ''"
                    :to="notary.website"
                    :data-tooltip="notary.website"
                    tag="a"
                    target="_blank"
                    class="contact-link">
                    <WebsiteIcon class="icon icon-website" />
                  </ButtonX>
                  <template v-if="notary.email.length > 0">
                    <ButtonX
                      v-for="email in notary.email"
                      :key="email"
                      :to="`mailto:${email}`"
                      :data-tooltip="`mailto:${email}`"
                      tag="a"
                      class="contact-link">
                      <EmailIcon class="icon icon-email" />
                    </ButtonX>
                  </template>
                </div>
              </template>

              <template v-if="cell.slug === 'use_case'">
                <div v-if="notary.use_case && notary.use_case !== ''" class="use-case">
                  {{ notary.use_case }}
                  <!-- <div
                    v-for="(useCase, index) in notary.use_case.split(',')"
                    :key="`${notary.id}-use_case-${index}`"
                    class="use-case">
                    {{ useCase }}
                  </div> -->
                </div>
              </template>

              <template v-if="cell.slug === 'request_button'">
                <ButtonA
                  theme="blue"
                  format="mini"
                  class="select-button"
                  @clicked="selectNotary(notary, updateValue)">
                  {{ form.select_button_text }}
                </ButtonA>
              </template>

            </div>
          </td>

        </tr>
      </FieldStandalone>
    </table>

    <div v-if="!filteredNotaries" class="no-results-placeholder">
      No matching notaries yet
    </div>

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import FieldStandalone from '@/modules/form/components/field-standalone'
import ButtonA from '@/components/buttons/button-a'
import ButtonX from '@/components/buttons/button-x'

import SlackIcon from '@/components/icons/slack'
import EmailIcon from '@/components/icons/email'
import WebsiteIcon from '@/components/icons/website'

// ====================================================================== Export
export default {
  name: 'NotariesTable',

  components: {
    FieldStandalone,
    ButtonA,
    ButtonX,
    SlackIcon,
    EmailIcon,
    WebsiteIcon
  },

  data () {
    return {
      columns: [
        { slug: 'name', label: 'Notary' },
        { slug: 'location', label: 'Location' },
        { slug: 'contact_information', label: 'Contacts' },
        { slug: 'use_case', label: 'Use Cases' },
        { slug: 'request_button' }
      ],
      contactPanel: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      staticFiles: 'general/staticFiles',
      application: 'account/application'
    }),
    pageData () {
      return this.siteContent.notaries.page_content
    },
    table () {
      return this.pageData.table
    },
    form () {
      return this.pageData.form
    },
    formScaffold () {
      return this.form.scaffold
    },
    notaryList () {
      return this.staticFiles['notaries-list.json']
    },
    filteredNotaries () {
      const notaryList = this.notaryList
      const len = notaryList.length
      const compiled = []
      for (let i = 0; i < len; i++) {
        const notary = notaryList[i]
        if ((notary.name !== '' || notary.organization !== '') && notary.status === 'Active' && notary.github_user.length > 0) {
          compiled.push(notary)
        }
      }
      return compiled
    }
  },

  methods: {
    selectNotary (notary, updateValue) {
      const name = notary.name
      const organization = notary.organization
      const id = name !== '' ? name : organization
      updateValue(id)
      this.$gtm.push({ event: 'selected_notary' })
      this.$router.push(`/apply/general/notaries/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.table-container {
  width: 100%;
}

.table-head {
  @include small {
    display: none;
  }
}

.column-label {
  display: none;
}

.row {
  padding: 0;
  &.row-head {
    border-bottom: 2px solid $nandor;
  }
  &.row-body {
    &:not(:last-child) {
      border-bottom: 2px solid $nandor;
    }
  }
  @include small {
    &.row-body {
      display: block;
      padding: 0.625rem 0;
      position: relative;
      border-bottom: none !important;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: -3.5rem;
        width: 100vw;
        border-top: 2px solid $nandor;
      }
    }
  }
  @include mini {
    &.row-body {
      &:before {
        left: -1.5rem;
      }
    }
  }
}

.cell {
  text-align: left;
  padding: 1.875rem 0;
  padding-right: 1rem;
  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 3.75rem;
  }
  &.cell-head {
    vertical-align: bottom;
  }
  &.cell-body {
    vertical-align: middle;
  }
  @include small {
    display: flex;
    padding: 0.625rem 0;
    padding-right: 1rem;
    font-size: 1rem;
    .cell-inner-wrapper {
      font-size: 1rem;
    }
  }
  @include small {
    &:before {
      width: 33%;
    }
  }
  @include tiny {
    &:before {
      width: 25%;
    }
  }
}

.cell-head {
  &:nth-child(4) {
    padding-left: 2.1875rem;
  }
}

.no-results-placeholder {
  padding: 2rem 3.5rem;
  font-size: 1rem;
}

// /////////////////////////////////////////////////////////////////////// Cells
.cell.name {
  @include small {
    &:before {
      content: 'Notary';
    }
  }
}

.github-handles {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.github-handle.button-x {
  margin-right: 0.25rem;
  margin-bottom: 0.25rem;
  :deep(.button-content) {
    font-size: toRem(14);
    font-family: $fontSuisseIntlMono;
    color: rgba($titanWhite, 0.5);
  }
}

.cell.location {
  @include small {
    &:before {
      content: 'Location';
    }
  }
  .location {
    white-space: nowrap;
  }
}

.cell.contact_information {
  @include small {
    &:before {
      content: 'Contacts';
    }
  }
}

.notary {
  .name,
  .organization {
    font-weight: 500;
    white-space: nowrap;
  }
}

.contact-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  @include tiny {
    padding-left: 0.5rem;
  }
}

.contact-link {
  &:not(:last-child) {
    margin-right: 0.5rem;
  }
}

// .cell.features {
//   padding-left: 3rem;
// }

.use-case {
  font-size: 1rem;
}

.notary,
.location,
.contact-info {
  font-size: 1rem;
}

.icon {
  display: block;
  &:hover {
    :deep(path) {
      transition: 150ms ease-in;
      fill: $greenYellow;
    }
  }
  :deep(path) {
    fill: white;
    transition: 150ms ease-out;
  }
}

.icon-slack,
.icon-github {
  width: 1.5rem;
}

.icon-website {
  width: 1.8125rem;
}

.icon-email {
  width: 2.1875rem;
}
</style>
