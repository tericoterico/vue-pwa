<template>
  <div>
      <v-layout class="p-sidebar" :class="{is_show:is_show}" row wrap>
        <v-flex xs3 pr-5>
          <v-list two-line>
            <template v-for="(item, index) in menu">
              <v-subheader
                v-if="item.header"
                :key="item.header"
              >
                {{ item.header }}
              </v-subheader>
  
              <v-divider
                v-else-if="item.divider"
                :key="index"
                :inset="item.inset"
              ></v-divider>
  
              <v-list-tile
                v-else
                :key="item.title"
                avatar
              >
  
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title" @click="onClickMenu(item.link)">
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
        <v-flex xs9>
          <v-side-home></v-side-home>
        </v-flex>
      </v-layout>
      <v-btn
        fixed
        dark
        fab
        bottom
        right
        color="green"
        @click="toggle_side"
      >
          <v-icon>menu</v-icon>
      </v-btn>

  </div>
</template>

<script>
//Vue Component

import SideHome from '../components/SideHome';

export default {
  name: "home",
  created: function() {
    console.log("%cINFO%c: SideMenu created","color:blue","");
  },
  mounted: async function() {
    const $this = this;
  },
  computed: {
  },
  components: {
    "v-side-home":SideHome
  },
  methods: {
    /**
     * サイドメニュー表示切替
     *
     */

    toggle_side:function(){
      this.is_show = !this.is_show;
    },

    /**
     * リンクメニュークリック
     *
     */

    onClickMenu:function(link){
      location.href=link;
    }

  },
  data: function() {
    return {
      is_show:false,
      menu: [
        { header: 'Menu' },
        {
          icon: 'menu',
          link: './tiles',
          title: 'Tiles'
        },
        { divider: true, inset: false },
        {
          icon: 'menu',
          link: './',
          title: 'Home'
        },
        { divider: true, inset: false },
        {
          icon: 'menu',
          link: './calendar',
          title: 'Calendar'
        },
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
