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
      <Field
        :scaffold="formScaffold.notary"
        :value="application.notary"
        form-id="filplus_application">
        <tbody slot-scope="{ updateValue }" class="table-body">
          <tr
            v-for="(notary, i) in filteredNotaries"
            :key="notary['Miner ID']"
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

                <template v-if="cell.slug === 'Miner'">
                  <div class="notary">
                    <div class="name">
                      {{ notary.name }}
                    </div>
                    <div class="miner-id">
                      {{ notary.sp_id }}
                    </div>
                  </div>
                </template>

                <template v-if="cell.slug === 'Location'">
                  <div class="location">
                    {{ notary.location.full }}
                    {{ $getFlagIcon(notary.location.country_code) }}
                  </div>
                </template>

                <template v-if="cell.slug === 'Contact Information'">
                  <div class="contact-info">
                    <ButtonX
                      v-for="(item, j) in notary.contact_information"
                      :key="`contact-${i}-${j}`"
                      :to="getContactLink(item.link)"
                      tag="a"
                      target="_blank"
                      class="contact-link">
                      <component :is="getIconComponent(item.type)" />
                    </ButtonX>
                  </div>
                </template>

                <template v-if="cell.slug === 'Features'">
                  <div :class="['features', { expanded: expandedNotaries.includes(i) }]">

                    <ul>
                      <li
                        v-for="feature in notary.features"
                        :key="feature">
                        {{ feature }}
                      </li>
                    </ul>

                    <button
                      v-if="!expandedNotaries.includes(i)"
                      class="see-more-features-button"
                      @click="expandFeatures(i)">
                      see more
                    </button>

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
        </tbody>
      </Field>
    </table>

    <div v-if="!filteredNotaries" class="no-results-placeholder">
      No matching notaries yet
    </div>

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import Field from '@/modules/form/components/field'
import ButtonA from '@/components/buttons/button-a'
import ButtonX from '@/components/buttons/button-x'
import SlackIcon from '@/components/icons/slack'
import GithubIcon from '@/components/icons/github'

// ====================================================================== Export
export default {
  name: 'NotariesTable',

  components: {
    Field,
    ButtonA,
    ButtonX,
    SlackIcon,
    GithubIcon
  },

  data () {
    return {
      columns: [
        { slug: 'Miner', label: 'Notary' },
        { slug: 'Location', label: 'Location' },
        { slug: 'Contact Information', label: 'Contacts' },
        { slug: 'Features', label: 'Features' },
        { slug: 'request_button' }
      ],
      contactPanel: false,
      expandedNotaries: []
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      staticFiles: 'general/staticFiles',
      application: 'general/application'
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
      return this.siteContent['notaries-list']
    },
    filteredNotaries () {
      const notaryList = this.notaryList
      return notaryList && notaryList.length > 0 ? notaryList : false
    }
  },

  methods: {
    selectNotary (notary, updateValue) {
      const name = notary.name
      updateValue(name)
      this.$router.push(`/apply/general/notaries/${name}`)
    },
    getIconComponent (icon) {
      switch (icon) {
        case 'website':
          return 'GithubIcon'
        case 'slack':
          return 'SlackIcon'
      }
      return 'div'
    },
    getContactLink (link) {
      return 'https://example.com'
    },
    expandFeatures (index) {
      if (!this.expandedNotaries.includes(index)) {
        this.expandedNotaries.push(index)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.table-notaries-list {
}

.table-container {
  width: 100%;
}

// .table-head {
//   @include mini {
//     display: none;
//   }
// }

// .table-body {
//   @include mini {
//     display: flex;
//     flex-direction: column;
//   }
// }

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
    vertical-align: center;
  }
}

.no-results-placeholder {
  padding: 2rem 3.5rem;
  font-size: 1rem;
}

// /////////////////////////////////////////////////////////////////////// Cells
.miner-id,
.see-more-features-button {
  font-size: toRem(14);
  font-family: $fontSuisseIntlMono;
  color: rgba($titanWhite, 0.5);
}

.notary {
  .name {
    font-weight: 500;
  }
}

.contact-info {
  .contact-link {
    margin-right: 0.5rem;
    :deep(path) {
      fill: white;
    }
  }
}

.features {
  max-width: toRem(360);
  li {
    font-size: 1rem;
    &:nth-child(n + 4) {
      display: none;
    }
  }
  &.expanded {
    li {
      display: list-item;
    }
  }
}

.see-more-features-button {
  transition: 200ms ease;
  &:hover {
    color: rgba($titanWhite, 0.75);
  }
}

</style>
