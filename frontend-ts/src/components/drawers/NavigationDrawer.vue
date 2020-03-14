<template>
  <q-drawer
    v-model="value"
    show-if-above
    :width="width"
    :breakpoint="breakpoint"
    bordered
    content-class="bg-white"
  >
    <q-scroll-area class="fit">
      <q-list v-for="(menuItem, index) in navigationItems" :key="index">
        <q-expansion-item
          v-model="menuItem.opened"
          v-if="menuItem.nested"
          :icon="menuItem.icon"
          :label="menuItem.label"
          expand-separator
          active-class="expanded"
        >
          <q-item
            v-for="(menuSubItem, idx) in menuItem.children"
            :key="idx"
            v-ripple
            clickable
            dense
            class="items-center"
            active-class="expanded"
            :icon="menuSubItem.icon"
            :label="menuSubItem.label"
            :to="menuSubItem.link"
          >
            <q-item-section>{{ menuSubItem.label }}</q-item-section>
            <q-badge
              v-if="menuSubItem.badge"
              :color="menuSubItem.badge.color"
              :label="menuSubItem.badge.content"
            ></q-badge>
          </q-item>
        </q-expansion-item>
        <q-item
          v-if="!menuItem.nested"
          v-ripple
          clickable
          class="items-center"
          :to="menuItem.link"
        >
          <q-item-section avatar>
            <q-icon :name="menuItem.icon" />
          </q-item-section>
          <q-item-section>{{menuItem.label}}</q-item-section>
          <q-badge
            v-if="menuItem.badge"
            :color="menuItem.badge.color"
            :label="menuItem.badge.content"
          ></q-badge>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>

<script>
import navigationDrawerItems from './navigationDrawerItems'
import { forEach } from 'lodash'

export default {
  name: 'NavigationDrawer',

  props: {
  'value':{
    type: Boolean,
    default: true
  }, 
  'width': {
    type:Number,
    default:260
  }, 
  'breakpoint':{
    type: Number,
    default: 500
  }
  
},

  data () {
    return {
      expansionOpened: false,
      navigationItems: navigationDrawerItems,
      prevPath: ''
    }
  },

  updated () {
    this.setExpansionOpened()
  },

  mounted () {
    console.log(this)

    this.setExpansionOpened()
    this.rootPath = this.$route.path
  },
  watch: {
    $route () {
      this.setExpansionOpened()
    }
  },

  methods: {
    setExpansionOpened () {
      if (this.prevPath === this.$route.path) return

      forEach(this.navigationItems, (rootItem) => {
        if (rootItem.children) {
          forEach(rootItem.children, (item) => {
            if (this.$route.path.match(item.link)) {
              rootItem.opened = true
            }
          })
        }
      })

      this.prevPath = this.$route.path
    }
  }
}
</script>
<style lang="scss" >
.q-router-link--exact-active {
  color: var(--q-color-primary) !important;
  background: $accent-light-blue !important;

}

.q-expansion-item__content>.q-item {
  padding-left: 72px;
  border-radius: 0 10px 10px 0;
}

.q-expansion-item--expanded {
  .q-expansion-item__container> :first-child {
    color: var(--q-color-primary);
    font-weight: bold;
  }
}

// SEPERATORS VISIBILITY
.q-expansion-item--collapsed:first-child>div>.q-expansion-item__border--top,
.q-expansion-item--collapsed:last-child>div>.q-expansion-item__border--bottom {
  opacity: 0;
}

.q-expansion-item--expanded:first-child>div>.q-expansion-item__border--top,
.q-expansion-item--expanded:last-child>div>.q-expansion-item__border--bottom {
  opacity: 1;
}
</style>