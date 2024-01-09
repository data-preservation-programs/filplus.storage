<template>
  <section id="roadmap">

    <Squigglie
      :percent-left="90"
      :thick="true"
      orientation="down"
      color="nandor" />

    <!-- ============================================================= Intro -->
    <section class="intro">
      <div class="grid">
        <div class="col">

          <h2 class="heading" v-html="roadmapHeading" />

          <div class="subheading" v-html="roadmapSubheading" />

        </div>
      </div>
    </section>

    <!-- =========================================================== Roadmap -->
    <section class="roadmap">

      <div
        v-for="(quarter, key) in compiledRoadmap"
        :key="key"
        class="quarter">
        <div class="grid">

          <!-- ..................................................... quarter -->
          <div class="col-2">
            <div class="timeline">
              <div class="quarter-tag tag">
                {{ quarter.section }}
              </div>
            </div>
          </div>

          <!-- ........................................................ card -->
          <div class="col-9_md-10">

            <!-- Quarter Heading Link -->
            <ButtonX
              :to="roadmapQuarterMap[key].link"
              :tag="roadmapQuarterMap[key].tag"
              :target="roadmapQuarterMap[key].target"
              class="quarter-heading-link">
              <div class="text" v-html="roadmapQuarterMap[key].text" />
              <IconLinkExternal
                v-if="roadmapQuarterMap[key].tag === 'a'"
                class="icon" />
            </ButtonX>

            <div class="card">
              <template v-for="entry in quarter.entries">

                <!-- Tag -->
                <div
                  :key="`entry-${entry.tag}-${quarter.section}-tag`"
                  class="card-tag tag">
                  {{ entry.tag }}
                </div>

                <!-- Events -->
                <div
                  v-for="(event, index) in entry.events"
                  :key="`event-${entry.tag}-${quarter.section}__${index}`"
                  class="event">
                  <component
                    :is="getIconComponent(event.tag)"
                    :class="['event-icon', event.tag]" />
                  <div class="event-text" v-html="event.text" />
                </div>

              </template>
            </div>

          </div>

        </div>
      </div>

    </section>

    <!-- ============================================================ Footer -->
    <div class="footer">
      <div class="grid">
        <div class="col-2">
          <div class="line" />
        </div>
        <div class="col-9">
          <div class="footer-content">

            <div class="footer-heading" v-html="roadmapFooter.heading" />

            <div class="links">
              <ButtonX
                v-for="(link, index) in roadmapFooter.links"
                :key="index"
                :to="link.link"
                :tag="link.tag"
                :target="link.target"
                class="footer-link">
                {{ link.text }}
              </ButtonX>
            </div>

          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import Squigglie from '@/components/squigglie'
import ButtonX from '@/components/buttons/button-x'

import IconLinkExternal from '@/components/icons/link-external'
import IconRoadmapUpcoming from '@/components/icons/roadmap-upcoming'
import IconRoadmapInProgress from '@/components/icons/roadmap-in-progress'
import IconRoadmapShipped from '@/components/icons/roadmap-shipped'

// ====================================================================== Export
export default {
  name: 'Roadmap',

  components: {
    Squigglie,
    ButtonX,
    IconLinkExternal,
    IconRoadmapUpcoming,
    IconRoadmapInProgress,
    IconRoadmapShipped
  },

  data () {
    return {
      compiledRoadmap: {}
    }
  },

  computed: {
    ...mapGetters({
      siteContent: 'general/siteContent'
    }),
    pageData () {
      return this.siteContent.index.page_content
    },
    roadmap () {
      return this.pageData.roadmap
    },
    roadmapHeading () {
      return this.pageData.roadmap_heading
    },
    roadmapSubheading () {
      return this.pageData.roadmap_subheading
    },
    roadmapTagMap () {
      return this.pageData.roadmap_tag_map
    },
    roadmapQuarterMap () {
      return this.pageData.roadmap_quarter_map
    },
    roadmapFooter () {
      return this.pageData.roadmap_footer
    }
  },

  mounted () {
    const roadmap = CloneDeep(this.roadmap)
    this.sortRoadmap(roadmap)
    this.compileRoadmap(roadmap)
  },

  methods: {
    sortRoadmap (roadmap) {
      roadmap.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })
    },
    compileRoadmap (roadmap) {
      this.compiledRoadmap = roadmap.reduce((acc, entry) => {
        if (!acc.hasOwnProperty(entry.section)) {
          acc[entry.section] = {
            section: entry.section,
            entries: [entry]
          }
        } else {
          acc[entry.section].entries.push(entry)
        }
        return acc
      }, {})
    },
    getIconComponent (tag) {
      let component = false
      switch (tag) {
        case 'upcoming' : component = 'IconRoadmapUpcoming'; break
        case 'in-progress' : component = 'IconRoadmapInProgress'; break
        case 'shipped' : component = 'IconRoadmapShipped'; break
      }
      return component
    }
  }
}
</script>

<style lang="scss" scoped>
// /////////////////////////////////////////////////////////////////////// Intro
.intro {
  padding-top: 9rem;
}

.heading {
  text-align: center;
  font-size: toRem(55);
  line-height: leading(40, 55);
  @include small {
    font-size: toRem(35);
    line-height: leading(40, 35);
  }
  @include tiny {
    font-size: toRem(30);
  }
}

.subheading {
  margin-top: 1.5rem;
  text-align: center;
  font-size: toRem(24);
  line-height: leading(40, 24);
  @include small {
    font-size: toRem(16);
    line-height: leading(24, 16);
  }
}

// ///////////////////////////////////////////////////////////////////// Roadmap
.roadmap {
  padding-top: 5rem;
}

.quarter {
  &:first-child {
    .timeline {
      &:before,
      &:after {
        top: 3%;
      }
      &:after {
        content: '';
      }
    }
  }
  &:not(:first-child) {
    .quarter-heading-link {
      margin-top: 2rem;
    }
    .quarter-tag {
      margin-top: 75%;
      @include mini {
        margin-top: 8.375rem;
      }
    }
  }
}

// .................................................................... Timeline
.timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  &:before { // line
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 3px;
    height: calc(100% + 1rem);
    background-color: $nandor;
    transform: translateX(-50%);
  }
  &:after { // circle
    position: absolute;
    top: 0;
    left: 50%;
    width: toRem(12);
    height: toRem(12);
    background-color: $nandor;
    border-radius: 50%;
    transform: translateX(-50%);
  }
}

.tag {
  padding: toRem(10) toRem(15);
  font-size: 1rem;
  line-height: 1;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  background-color: $aztec;
  border: 2px solid rgba($nandor, 0.75);
  border-radius: 2rem;
  @include small {
    font-size: toRem(12);
  }
  @include tiny {
    padding: toRem(4) toRem(6);
  }
}

.quarter-tag {
  position: sticky;
  top: 9.5rem;
  margin-top: 59%;
  padding: toRem(6) toRem(18);
  font-size: toRem(24);
  line-height: leading(30, 24);
  border-color: $nandor;
  z-index: 10;
  @include medium {
    font-size: toRem(12);
  }
  @include tiny {
    padding: toRem(4) toRem(6);
    margin-top: 6.375rem;
  }
}

// ....................................................................... Cards
.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: toRem(27) toRem(34);
  border: 3px solid rgba($nandor, 0.75);
  border-radius: 2rem;
  @include mini {
    margin-left: 1rem;
    padding: 1rem;
  }
}

.quarter-heading-link {
  display: inline-block;
  margin-bottom: toRem(48);
  @include small {
    margin-bottom: toRem(24);
  }
  :deep(.button-content) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: toRem(25);
  }
  .icon {
    width: toRem(12);
    margin-bottom: toRem(18);
    margin-left: toRem(7);
  }
  .text {
    font-size: toRem(25);
    line-height: leading(50, 25);
    color: $greenYellow;
    font-weight: 400;
    white-space: normal;
    @include small {
      font-size: toRem(18);
      line-height: leading(30, 18);
    }
    :deep(strong) {
      font-weight: 500;
    }
  }
}

.event {
  display: flex;
  flex-direction: row;
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}

.card-tag {
  margin-bottom: 1rem;
  &:not(:first-child) {
    margin-top: toRem(35);
    @include mini {
      margin-top: 1rem;
    }
  }
}

.event-icon {
  width: toRem(14);
  height: toRem(14);
  margin-right: toRem(30);
  margin-top: toRem(9);
  @include mini {
    margin-right: 1rem;
    margin-top: toRem(4);
  }
}

.event-text {
  flex: 1;
  font-size: toRem(18);
  line-height: leading(30, 18);
  font-weight: 500;
  @include small {
    font-size: toRem(14);
    line-height: leading(21, 14);
  }
  :deep(a) {
    @include linkUnderline;
  }
}

// ////////////////////////////////////////////////////////////////////// Footer
.line {
  position: relative;
  width: 100%;
  height: 100%;
  &:before { // line
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 3px;
    height: calc(100% + 1rem);
    transform: translateX(-50%);
    background-color: $nandor;
  }
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: toRem(40);
  margin-bottom: toRem(75);
  @include small {
    margin-bottom: toRem(40);
  }
}

.footer-heading {
  @include h6;
  margin-bottom: toRem(5);
}

.links {
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-end;
}
.footer-link {
  @include linkUnderline;
  :deep(.button-content) {
    @include h6;
  }
  &:not([disabled]) {
    &:focus-visible {
      outline: 0px none transparent;
    }
  }
}
</style>
