<template>
  <v-container fluid>
    <v-layout wrap>
      <v-flex xs12>
        <v-sheet height="500">
          <v-calendar
            ref="calendar"
            v-model="start"
            :type="type"
            :end="end"
            color="primary"
          ></v-calendar>
        </v-sheet>
      </v-flex>
    </v-layout>
      <v-layout row nowrap>
      <v-flex
        xs6
        class="text-sm-left text-xs-center"
      >
        <v-btn @click="$refs.calendar.prev()">
          <v-icon
            dark
            left
          >
            keyboard_arrow_left
          </v-icon>
          Prev
        </v-btn>
      </v-flex>
      <v-flex
        xs6
        class="text-sm-right text-xs-center"
      >
        <v-btn @click="$refs.calendar.next()">
          Next
          <v-icon
            right
            dark
          >
            keyboard_arrow_right
          </v-icon>
        </v-btn>
      </v-flex>
      </v-layout>
      <v-layout row nowrap>
        <v-flex xs12>
          <div class="p-score">
            <div class="p-score_bar" v-bind:style="{width: total_score%100 + '%'}"></div>
            <div class="p-score_label" v-for="index in 11" :key="index" :data-index="index-1">
              {{(index-1)*10}}
            </div>
          </div>
        </v-flex>
      </v-layout>

      <v-sidemenu></v-sidemenu>
  </v-container>
</template>

<script>
//Vue Component
import SideMenu from '../components/SideMenu'

export default {
  name: "home",
  created: function() {
    console.log("created");
  },
  mounted: async function() {
    const $this = this;

    //成績DBから取得
    await $db.scores
    .where('date')
    .between(1560860735, 1570860948)
    .each(function(item){
      console.log($this.$moment.unix(item.date).format('YYYY/MM/DD HH:mm:ss'));
    })


    //合計点数をDBから取得
    $this.total_score = 0;
    
    await $db.scores
    .where('score')
    .above(0)
    .each(function(item){
      $this.total_score += item.score
    })
  },
  computed: {
  },
  components: {
    "v-sidemenu": SideMenu
  },
  methods: {
  },
  data: function() {
    return {
      total_score:0,
      type: 'month',
      start: '2019-01-01',
      end: '2019-11-06',
      typeOptions: [
        { text: 'Day', value: 'day' },
        { text: '4 Day', value: '4day' },
        { text: 'Week', value: 'week' },
        { text: 'Month', value: 'month' },
        { text: 'Custom Daily', value: 'custom-daily' },
        { text: 'Custom Weekly', value: 'custom-weekly' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>

.p-score{
  width: 100%;
  min-height: 40px;
  background-image: linear-gradient(90deg, #ccc 3.33%, #ffffff 3.33%, #ffffff 50%, #ccc 50%, #ccc 53.33%, #ffffff 53.33%, #ffffff 100%);
  background-size: 2% 40.00px;
  background-repeat: repeat-x;
  position: relative;
  border: 1px solid #ccc;
  &_bar{
    position: absolute;
    top: 0;
    left: 0;
    width: 50%;
    height: 40px;
    background: rgba(76, 175, 80, 0.7);
    transition:all ease 1.5s;
  }
  &_label{
    position: absolute;
    @for $i from 0 through 10 {
      &[data-index="#{$i}"]{
        position: absolute;
        bottom: -25px;
        left: percentage($i/10);
        margin-left: -20px;
        text-align: center;
        font-weight: bold;
        width: 3em;
      }
    }
  }
}

</style>
