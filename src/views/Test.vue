<template>
  <v-app id="app">
    <v-container class="p-container" fluid>
      <v-layout class row wrap justify-start mb-3>
        <!-- clock -->
        <v-flex xs2>
          <clock></clock>
        </v-flex>

        <v-flex xs6 pl-4>
          <v-slider
            class="mt-0"
            label="制限時間"
            thumb-size="40"
            max="1800"
            step="30"
            prepend-icon="timer"
            v-model="limit"
            v-bind:value="limit"
            @change="onChangeLimit"
            :messages="limit_display"
            readonly
          ></v-slider>
          <v-divider class="mt-3 mb-3"></v-divider>
          <v-slider
            class="mt-0"
            label="経過時間"
            thumb-size="40"
            color="orange"
            max="1800"
            prepend-icon="timer"
            v-model="elapsed"
            v-bind:value="elapsed"
            :messages="elapsed_display"
            readonly
          ></v-slider>
        </v-flex>
        <v-flex xs4>
          <!-- カウントダウン -->
          <circular-count-down-timer
            :initial-value="1"
            :stroke-width="16"
            :padding="0"
            :show-hour="false"
            :paused="pause"
            ref="countdown"
            :size="150"
            class="count-down-circle"
          ></circular-count-down-timer>
        </v-flex>

          <div class="p-date" v-if="false">
            <span class="display-3">{{date.h}}</span>じ
            <span class="display-3">{{date.m}}</span>ふん
            <span class="display-3">{{date.s}}</span>びょう<br>
            <span class="display-1">{{date.Y}}</span>ねん
            <span class="display-1">{{date.M}}</span>がつ
            <span class="display-1">{{date.D}}</span>にち
          </div>
      </v-layout>
      <v-layout class="p-target" row wrap>
        <v-draggable class="drag-container" :options="{disabled: true}">
          <v-flex
            @click="toggle_complete(item.id,$event)"
            class="pa-3"
            xs4
            v-if="item.added"
            v-for="(item, index) in items"
            :key="item.id"
            grow
            shrink
          >
            <li class="p-btn" :id="item.id" :data-finished="item.finished">
              <div class="p-btn_img">
                <img :src="item.img" alt="item.name">
              </div>
              <div class="p-btn_caption">{{item.name}}</div>
              <div class="p-btn_finished" v-if="item.finished">
                <v-layout align-center justify-center fill-height>
                  <v-icon color="#fff" size="60">check</v-icon>
                </v-layout>
              </div>
            </li>
          </v-flex>
        </v-draggable>
      </v-layout>
      <v-layout class="p-finished" v-if="done" row wrap align-center>
        <v-flex xs12>
          <span>ぜんぶ おわった!!</span>
          <v-button @click="complete_all">OK</v-button>
        </v-flex>
      </v-layout>
      <!-- サイドバー -->
      <v-layout class="p-sidebar" :class="{is_show:is_side}" row wrap>
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
                @click=""
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
          <v-select
            v-model="selected_saved_id"
            :items="saved_list"
            item-text="name"
            item-value="id"
            label="保存したセットから読み込む"
            @change="onChangeSelect"
          ></v-select>
          <v-slider
            label="制限時間を設定"
            thumb-size="40"
            max="1800"
            step="30"
            prepend-icon="timer"
            v-model="limit"
            v-bind:value="limit"
            @change="onChangeLimit"
          ></v-slider>
          <div class="p-time_display">{{limit_display}}</div>
          <v-flex xs12>
            <v-btn @click="start_timer">START</v-btn>
            <v-btn @click="stop_timer">STOP</v-btn>
            <v-btn @click="finish_timer">Finish</v-btn>
            <v-btn @click="show_sum_score">SUM</v-btn>
            <a href="/tiles">Tiles</a>
          </v-flex>

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
    </v-container>
  </v-app>
</template>

<script>
//Vue Component
// import TaskCard from './TaskCard';
import Draggable from "vuedraggable";
import anime from "animejs";
import Clock from 'vue-clock2';
import { setInterval, clearInterval } from "timers";

var timer = "";

export default {
  name: "home",
  created: function() {
    var _this = this;
    setInterval(function() {
      _this.date.Y = _this.$moment().format("YYYY");
      _this.date.M = _this.$moment().format("MM");
      _this.date.D = _this.$moment().format("DD");
      _this.date.h = _this.$moment().format("HH");
      _this.date.m = _this.$moment().format("mm");
      _this.date.s = _this.$moment().format("ss");
    }, 1000);
  },
  mounted: function() {
    const $this = this;
    //保存したセットリストをDBから読み込み
    $db.todos.toArray()
      .then(function (datas) {
        $this.saved_list = datas;
      });

  },
  computed: {
    limit_display: function() {
      return (
        Math.floor(this.limit / 60) + "ふん" + (this.limit % 60) + "びょう"
      );
    },
    elapsed_display: function() {
      return (
        Math.floor(this.elapsed / 60) + "ふん" + (this.elapsed % 60) + "びょう"
      );
    },
    sec_conv_min: function() {
      return this.limit / 60;
    }
  },
  components: {
    // "v-taskcard": TaskCard,
    "v-draggable": Draggable,
    Clock,
  },
  methods: {
    //スコアの合計値を算出
    show_sum_score:async function(){
      let sum = 0;
      
      await $db.scores
      .where('score')
      .above(0)
      .each(function(item){
        sum += item.score
      })
      alert("合計点数は"+sum+"です");
    },
    onClickMenu:function(link){
      location.href=link;
    },
    toggle_side:function(){
      this.is_side = !this.is_side;
    },
    toggle_complete: function(id) {
      var _idx = this._.findIndex(this.items, { id: id });
      this.items[_idx].finished = !this.items[_idx].finished;

      setTimeout(function() {
        anime({
          targets: '[id="' + id + '"] .p-btn_finished',
          scale: [{ value: 0, duration: 0 }, { value: 1.5, duration: 1000 }],
          rotate: [
            { value: "0.65turn", duration: 0 },
            { value: "1turn", duration: 1000 }
          ]
        });
      });

      //全完了チェック
      if(this._.findIndex(this.items, { finished: false }) < 0){
        this.done = true;
      setTimeout(function() {
        anime({
          targets: '.p-finished',
          opacity: [
            { value: 0, duration: 0 },
            { value: 1, duration: 2000 }
          ]
        });
      });

      }else{
        this.done = false;
      }

    },
    start_timer: function() {
      const $this = this;
      if (timer) clearInterval(timer);

      $this.start_time = $this.$moment();
      timer = setInterval(function() {
        $this.elapsed = $this.$moment().diff($this.start_time, "seconds");
      }, 1000);

      $this.pause = false;
    },
    stop_timer: function() {
      const $this = this;
      $this.pause = true;
      clearInterval(timer);
    },
    onChangeSelect:function(id){
      this.items = _.find(this.saved_list, {id:id}).data;
    },
    onChangeLimit:function(data){
      this.$refs.countdown.updateTime(data)
    },
    complete_all:function(){
      this.done = false;
    },
    finish_timer:function(){
      this.checkComplete();
    },
    checkComplete:function(){
      //count complete

      // console.log(this.selected_saved_id);
      // console.log(this.$moment().format('YYYY-MM-DD HH:mm:ss'));
      // console.log(_.filter(this.items, {finished:true}).length);

      const $this = this;

      //DBへ保存
      $db.scores
        .add({
          setId: $this.selected_saved_id,
          date: $this.$moment().format('X'),
          score: _.filter($this.items, {finished:true}).length
        })
        .then(function(e) {
          //保存完了したらcheckedを全て外す
          _.each($this.items, function(v,k){
            v.finished = false;
          })

        })
        .catch(function() {
          alert("DBの保存に失敗しました。");
        });
    }
  },
  data: function() {
    return {
      time: '10:40',
      is_side:false,
      limit: 0,
      elapsed: 0,
      start_time: 0,
      done:false,
      pause: true,
      selected_saved_id:"",
      saved_list:[],
      date: {
        h: 0,
        m: 0,
        s: 0,
        Y: 0,
        M: 0,
        D: 0
      },
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
          link: './test',
          title: 'Test'
        },
        { divider: true, inset: false },
        {
          icon: 'menu',
          link: './calendar',
          title: 'Calendar'
        },
      ],
      items: [
      ]
    };
  }
};
</script>

<style lang="scss">
.p-btn {
  $element: #{&};
  background: #fff;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  padding: 15px 0;
  position: relative;
  cursor: pointer;
  transition: all ease 0.3s;
  &:hover {
    // opacity:0.75;
  }
  &[data-finished="true"] {
    .p-btn_img,
    .p-btn_caption {
      opacity: 0.35;
    }
  }
  &_img {
    transition: opacity ease 0.5s;
    img {
      width: auto;
      height: 20vh;
    }
  }
  &_caption {
    font-size: 24px;
    font-weight: bold;
    transition: opacity ease 0.5s;
    color: #4caf50;
  }

  &_index {
    width: 60px;
    height: 60px;
    color: #fff;
    font-size: 40px;
    font-weight: bold;
    background: rgba(255, 127, 50, 0.87);
    border-radius: 50%;
    position: absolute;
    line-height: 60px;
    top: 0;
    left: 0;
    margin-top: -10px;
    margin-left: -10px;
  }

  &_delete {
    width: 60px;
    height: 60px;
    font-size: 40px;
    font-weight: bold;
    background: rgba(170, 170, 170, 0.87);
    border-radius: 50%;
    position: absolute;
    line-height: 45px;
    top: 0;
    right: 0;
    margin-top: -10px;
    margin-right: -10px;
    i.v-icon{
      color: #fff;
      font-size: 40px;
    }
  }

  &_finished {
    width: 80px;
    height: 80px;
    background: rgba(76, 175, 80, 0.87);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -40px;
    margin-left: -40px;
  }

  &_list{
    overflow-x: scroll;
    padding: 20px 10px;
    -webkit-overflow-scrolling: touch;
    > div{
      min-width: 27.5%;
    }
  }
}
.p-date {
  font-size: 18px;
  span {
    font-weight: 600;
    margin-right: 0.1em;
  }
}

.drag-container {
  display: flex;
  width: 100%;
  flex-flow: row wrap;
}

.v-slider__thumb-label {
  span {
    font-size: 18px;
    font-weight: bold;
  }
}

.p-time_display {
  font-size: 20px;
  font-weight: bold;
}

.p-container {
  background: #f3f3f3;
}

.p-target{
  min-height: 50vh;
  margin-bottom: 4vh;
  .flex.pa-3{
    padding: 10px !important;
  }
}

.p-finished{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background:rgba(255,255,255,0.75);
  >div{
    span{
      display: block;
      text-align: center;
      font-size: 50px;
      font-weight: bold;
      margin-bottom:20px;
      color:#4caf50;
    }
  }
}

  .p-sidebar{
    position: fixed; 
    width: 100vw;
    height: 50vh;
    bottom: 0;
    left: 0;
    padding: 20px;
    background:rgba(255,255,255,0.85);
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
    transition:all ease 0.3s;
    transform:translateY(100vh);

    &.is_show{
      transform:translateY(0);
    }
  }


.v-input--slider{
  .v-input__slot{
    margin-bottom: 0;
  }

  .v-messages{
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

}

.count-down-circle{
  > div{
    width: auto !important;
  }
  .item{
    margin: 0 6px;
    font-weight: bold;
  }
}

</style>
