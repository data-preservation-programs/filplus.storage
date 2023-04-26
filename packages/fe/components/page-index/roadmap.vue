<template>
  <section id="roadmap">

    <Squigglie
      :percent-left="90"
      orientation="down"
      color="nandor"
      :thick="true" />

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
        v-for="(month, key, monthIndex) in compiledRoadmap"
        :key="key"
        class="month">
        <div class="grid">

          <!-- ....................................................... month -->
          <div class="col-3_md-hidden">
            <div class="month-ticker bubble right">
              {{ month.date }}
            </div>
          </div>

          <!-- ..................................................... entries -->
          <div class="col-9_md-12">
            <div class="entries">

              <div
                v-for="(entry, entryIndex) in month.entries"
                :key="`entry-${entry.tag}-${entry.date.original}`"
                class="entry">
                <div class="grid-noGutter">

                  <!-- month ticker -->
                  <div class="col-3_mi-2">
                    <div class="quarter-wrapper">
                      <div class="quarter tag">
                        {{ entry.date.quarter }}
                      </div>
                    </div>
                  </div>

                  <!-- entries -->
                  <div class="col-9_mi-10">
                    <ButtonX
                      v-if="entryIndex === 0"
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
                      <div class="tag">
                        {{ entry.tag }}
                      </div>
                      <div class="events">
                        <div
                          v-for="(event, index) in entry.events"
                          :key="`event-${entry.tag}-${entry.date.original}__${index}`"
                          class="event">
                          <div class="event-tag">
                            <span :class="['icon', event.tag]">
                              <div v-if="event.tag === 'shipped'">
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13.5129 0.914466C13.7894 0.645686 14.1573 0.497094 14.5391 0.500043C14.9208 0.502992 15.2865 0.657253 15.559 0.930275C15.8315 1.2033 15.9894 1.57372 15.9995 1.96339C16.0096 2.35306 15.871 2.73149 15.6131 3.01883L7.78171 13.0196C7.64705 13.1677 7.48452 13.2866 7.30384 13.3691C7.12317 13.4515 6.92805 13.496 6.73017 13.4997C6.53229 13.5035 6.3357 13.4664 6.15215 13.3908C5.96861 13.3152 5.80188 13.2026 5.66194 13.0597L0.468524 7.75667C0.323895 7.61906 0.207893 7.45311 0.127436 7.26873C0.0469793 7.08435 0.00371646 6.88531 0.000229091 6.68349C-0.00325828 6.48166 0.0331013 6.28119 0.107138 6.09402C0.181175 5.90686 0.291372 5.73684 0.431156 5.5941C0.570941 5.45137 0.737448 5.33885 0.920745 5.26325C1.10404 5.18765 1.30037 5.15052 1.49803 5.15408C1.69568 5.15764 1.89061 5.20182 2.07118 5.28397C2.25175 5.36613 2.41427 5.48458 2.54903 5.63226L6.65902 9.82697L13.4756 0.958558C13.4879 0.943128 13.499 0.928407 13.5129 0.914466Z" fill="#B7F651" />
                                </svg>
                              </div>
                            </span>
                            <span class="text">{{ roadmapTagMap[event.tag] }}</span>
                          </div>
                          <div class="event-text" v-html="event.text" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- footer -->
              <div v-if="showFooter(monthIndex)" class="footer">
                <div class="grid">
                  <div class="col-9" data-push-left="off-3">
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

            </div>
          </div>

        </div>
      </div>
    </section>

  </section>
</template>

<script>
// ===================================================================== Imports
import { mapGetters } from 'vuex'
import CloneDeep from 'lodash/cloneDeep'

import Squigglie from '@/components/squigglie'
import ButtonX from '@/components/buttons/button-x'

import IconLinkExternal from '@/components/icons/link-external'

// ====================================================================== Export
export default {
  name: 'Roadmap',

  components: {
    Squigglie,
    ButtonX,
    IconLinkExternal
  },

  data () {
    return {
      compiledRoadmap: {},
      monthCount: 0
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
      const lenI = roadmap.length
      const compiled = {}
      for (let i = 0; i < lenI; i++) {
        const entry = roadmap[i]
        const date = entry.date
        const parsedDate = this.$moment(new Date(date))
        entry.date = {
          original: date,
          quarter: `Q${parsedDate.format('Q YYYY')}`
        }
        if (!compiled.hasOwnProperty(date)) {
          compiled[date] = {
            date: parsedDate.format('MMM YYYY'),
            entries: [entry]
          }
        } else {
          compiled[date].entries.push(entry)
        }
      }
      this.monthCount = Object.keys(compiled).length
      this.compiledRoadmap = compiled
    },
    showFooter (monthIndex) {
      return this.monthCount === monthIndex + 1
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
  font-size: toRem(80);
  line-height: leading(40, 80);
  @include small {
    font-size: toRem(35);
    line-height: leading(40, 35);
  }
}

.subheading {
  margin-top: 2.5rem;
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
  padding-top: 12rem;
}

.month {
  &:not(:first-child) {
    margin-top: -1rem;
    .month-ticker {
      margin-top: toRem(105);
    }
  }
  &:first-child {
    .entries {
      margin-top: toRem(-110);
    }
    .entry {
      &:first-child {
        .quarter-wrapper {
          &:before {
            top: toRem(21);
            height: calc(100% - toRem(21));
          }
          &:after {
            content: '';
          }
        }
      }
    }
  }
}

.month-ticker {
  display: inline-block;
  position: sticky;
  top: 9.5rem;
  padding: toRem(18) toRem(30);
  margin-bottom: 3rem;
  font-size: toRem(30);
  line-height: 1;
  font-weight: 500;
}

.entry {
  &:not(:last-child) {
    .card {
      margin-bottom: toRem(10);
    }
  }
  &:first-child {
    .quarter {
      margin-top: toRem(120);
      @include small {
        margin-top: toRem(105);
      }
    }
  }
  &:last-child {
    .card {
      margin-bottom: 3rem;
    }
  }
}

.quarter-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: 100%;
  margin-right: 4rem;
  @include mini {
    margin-right: 0;
  }
  &:before { // line
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 3px;
    height: 100%;
    background-color: $nandor;
    transform: translateX(-50%);
  }
  &:after { // circle
    position: absolute;
    top: toRem(21);
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
  border: 2px solid $nandor;
  border-radius: 2rem;
  @include small {
    font-size: toRem(12);
  }
  @include tiny {
    padding: toRem(4) toRem(6);
  }
}

.quarter {
  margin-top: toRem(24);
  z-index: 10;
}

.quarter-heading-link {
  display: inline-block;
  margin-bottom: toRem(48);
  @include mini {
    white-space: normal;
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
    @include small {
      font-size: toRem(18);
      line-height: leading(30, 18);
    }
    :deep(strong) {
      font-weight: 500;
    }
  }
}

.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: toRem(22) toRem(25);
  padding-bottom: toRem(30);
  border: 3px solid $nandor;
  border-radius: 2rem;
  @include mini {
    margin-left: 1rem;
  }
}

.events {
  margin-top: 2rem;
  padding: 0 toRem(10);
}

.event {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  @include small {
    flex-direction: column;
  }
  &:not(:last-child) {
    margin-bottom: toRem(24);
  }
}

.event-tag {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 10rem;
  @include small {
    margin-bottom: toRem(5);
  }
  .icon {
    margin-right: toRem(10);
    &:not(.shipped) {
      width: toRem(14);
      height: toRem(14);
      border-radius: 50%;
      &.in-progress {
        background-color: #F4C9B2;
      }
      &.upcoming {
        background-color: #7968AB;
      }
    }
  }
  .text {
    font-size: 1rem;
    font-weight: 500;
    color: $nandor;
    @include small {
      font-size: toRem(14);
    }
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
}

// ////////////////////////////////////////////////////////////////////// Footer
.footer {
  position: relative;
  &:before { // line
    content: '';
    position: absolute;
    top: 0;
    left: 9.05%;
    width: 3px;
    height: calc(100% + 1rem);
    background-color: $nandor;
  }
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: toRem(40);
  margin-bottom: toRem(90);
}

.footer-heading {
  @include h6;
  margin-bottom: toRem(5);
}

.footer-link {
  @include linkUnderline;
  :deep(.button-content) {
    @include h6;
  }
}
</style>
