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
      <tbody class="table-body">
        <tr
          v-for="notary in filteredNotaries"
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
                  {{ notary.Miner }}
                </div>
              </template>

              <template v-if="cell.slug === 'Location'">
                <div class="location">
                  {{ notary.Location }}
                </div>
              </template>

              <template v-if="cell.slug === 'Contact Information'">
                <div class="contact-info" v-html="notary['Contact Information']" />
              </template>

              <template v-if="cell.slug === 'request_button'">
                <ButtonA
                  theme="blue"
                  format="mini"
                  class="select-button"
                  @clicked="selectNotary">
                  {{ form.select_button_text }}
                </ButtonA>
              </template>

            </div>
          </td>

        </tr>
      </tbody>
    </table>

    <div v-if="!filteredNotaries" class="no-results-placeholder">
      No matching notaries yet
    </div>

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'

import ButtonA from '@/components/buttons/button-a'

// ====================================================================== Export
export default {
  name: 'NotariesTable',

  components: {
    ButtonA
  },

  data () {
    return {
      columns: [
        { slug: 'Miner', label: 'Notary' },
        { slug: 'Location', label: 'Location' },
        { slug: 'Contact Information', label: 'Contact Information' },
        { slug: 'request_button' }
      ],
      contactPanel: false
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      staticFiles: 'general/staticFiles'
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
    notaryList () {
      return this.siteContent['notaries-list']
    },
    filteredNotaries () {
      const notaryList = this.notaryList
      return notaryList && notaryList.length > 0 ? notaryList : false
    }
  },

  methods: {
    selectNotary (notary) {
      console.log(notary)
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
    vertical-align: top;
  }
}

.no-results-placeholder {
  padding: 2rem 3.5rem;
  font-size: 1rem;
}

// /////////////////////////////////////////////////////////////////////// Cells
</style>