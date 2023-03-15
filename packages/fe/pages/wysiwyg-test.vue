<template>
  <div :class="`page page-${tag} container`">

    <!-- ============================================================== Hero -->
    <HeroB
      :label="hero.label"
      :heading="hero.heading"
      heading-cols="col-12" />

    <!-- ====================================================== WYSIWYG Test -->
    <div id="section-wysiwyg-test">

      <Squigglie
        :percent-left="6"
        orientation="down"
        color="nandor"
        :thick="true"
        class="wysiwyg-top-border" />

      <div class="grid">

        <div class="col-12">

          <FieldContainer
            :scaffold="formScaffold.wysiwyg_test_field"
            field-key="wysiwyg_test_field"
            form-id="wysiwyg_test_form" />

        </div>

      </div>
    </div>

    <!-- ========================================================== Overlays -->
    <Overlay type="noise" />

  </div>
</template>

<script>
// ===================================================================== Imports
import { mapGetters, mapActions } from 'vuex'

import HeroB from '@/components/hero-b'
import Overlay from '@/components/overlay'
import Squigglie from '@/components/squigglie'

import FieldContainer from '@/components/form/field-container'

import WysiwygTestPageData from '@/content/pages/wysiwyg-test.json'

// ====================================================================== Export
export default {
  name: 'WysiwygTestPage',

  components: {
    HeroB,
    Overlay,
    Squigglie,
    FieldContainer
  },

  data () {
    return {
      tag: 'wysiwyg-test'
    }
  },

  async fetch ({ app, store }) {
    await store.dispatch('general/getBaseData', { key: 'wysiwyg-test', data: WysiwygTestPageData })
    await app.$form('wysiwyg_test_form').register({ wysiwyg_test_field: '' })
  },

  head () {
    return this.$compileSeo(this.$getSeo(this.tag))
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent',
      savedFormExists: 'form/savedFormExists',
      githubIssueLink: 'general/githubIssueLink'
    }),
    generalPageData () {
      return this.siteContent.general
    },
    pageData () {
      return this.siteContent[this.tag].page_content
    },
    hero () {
      return this.pageData.hero
    },
    form () {
      return this.pageData.form
    },
    formHeading () {
      return this.form.heading
    },
    formScaffold () {
      return this.form.scaffold
    },
    restoreSavedFormButtonText () {
      return this.form.restore_saved_form_button_text
    },
    submitButtonText () {
      return this.form.submit_button_text
    },
    githubIssueLinkText () {
      return this.form.github_issue_link_text
    }
  },

  beforeDestroy () {
    this.setGithubIssueLink(false)
  },

  methods: {
    ...mapActions({
      validateForm: 'form/validateForm',
      submitGeneralApplication: 'general/submitGeneralApplication',
      restoreSavedForm: 'form/restoreSavedForm',
      removeLoader: 'button/removeLoader',
      setGithubIssueLink: 'general/setGithubIssueLink'
    })
  }
}
</script>

<style lang="scss" scoped>
// ///////////////////////////////////////////////////////////////////// General
.page-wysiwyg-test {
  position: relative;
  overflow: hidden;
}

.overlay.type__noise {
  z-index: 5;
}

// //////////////////////////////////////////////////////////////////////// Hero
:deep(.hero-content) {
  @include mini {
    padding-bottom: 7rem;
  }
  .bubble {
    margin-top: 2.75rem;
    @include small {
      margin-top: 1.5rem;
    }
    @include mini {
      padding: 0.75rem 1.5rem;
      margin-top: 1rem;
      white-space: nowrap;
    }
  }
}

// ///////////////////////////////////////////////////////////////////////// FAQ
#section-wysiwyg-test {
  position: relative;
  padding-top: 4.125rem;
  padding-bottom: 4.125rem;
  border-top: 3px solid transparent;
  z-index: 25;
}

.wysiwyg-top-border {
  top: -3px;
}
</style>
