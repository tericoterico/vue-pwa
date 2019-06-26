<template>
  <v-app id="app">
    <v-container class="p-container" fluid>
      <v-layout class row wrap justify-start mb-3>

        <!-- clock -->
        <v-flex xs2>
          <clock></clock>
        </v-flex>

        <v-flex xs6 pl-4>
          <!-- 制限時間 -->
          <v-slider
            class="mt-0"
            label="制限時間"
            thumb-size="40"
            max="1800"
            step="30"
            prepend-icon="timer"
            v-bind:value="this.$store.state.limit_time"
            :messages="limit_display"
            readonly
          ></v-slider>

          <v-divider class="mt-3 mb-3"></v-divider>

          <!-- 経過時間 -->
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
<!--
        <div class="p-date" v-if="false">
          <span class="display-3">{{date.h}}</span>じ
          <span class="display-3">{{date.m}}</span>ふん
          <span class="display-3">{{date.s}}</span>びょう<br>
          <span class="display-1">{{date.Y}}</span>ねん
          <span class="display-1">{{date.M}}</span>がつ
          <span class="display-1">{{date.D}}</span>にち
        </div>
-->
      </v-layout>
      <v-layout class="p-target" row wrap>
        <v-draggable class="drag-container" :options="{disabled: true}">
          <v-flex
            @click="toggle_complete(item.id,$event)"
            class="pa-3"
            v-if="item.added"
            v-for="(item, index) in this.$store.state.current_items"
            :key="item.id"
            grow
            shrink
            xs4
          >
            <li class="p-btn" :id="item.id" :data-finished="item.finished">
              <div class="p-btn_img">
                <img :src="item.img" alt="item.name">
              </div>
              <div class="p-btn_caption">{{item.name}}</div>
              <div class="p-btn_finished" v-if="item.finished">
                <div class="p-btn_circle">
                  <v-icon color="#fff" size="60">check</v-icon>
                </div>
                <svg class="p-btn_star" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
                <div class="p-btn_pulse"></div>
              </div>
              <div class="p-btn_index">{{index+1}}</div>
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

      <v-sidemenu></v-sidemenu>
    </v-container>
  </v-app>
</template>

<script>
//Vue Component
import Draggable from "vuedraggable";
import anime from "animejs";
import Clock from 'vue-clock2';
import SideMenu from '../components/SideMenu'
import { setTimeout } from "timers";
import EventBus from '../eventbus.js';

var timer = "";

export default {
  name: "home",
  created() {
    // var _this = this;
    // setInterval(function() {
    //   _this.date.Y = _this.$moment().format("YYYY");
    //   _this.date.M = _this.$moment().format("MM");
    //   _this.date.D = _this.$moment().format("DD");
    //   _this.date.h = _this.$moment().format("HH");
    //   _this.date.m = _this.$moment().format("mm");
    //   _this.date.s = _this.$moment().format("ss");
    // }, 1000);
    EventBus.$on('update_countdown_timer', this.update_countdown_timer);
    EventBus.$on('start_timer', this.start_timer);
  },
  mounted: function() {
    // const $this = this;
  },
  computed: {
    limit_display: function() {
      return (
        Math.floor(this.$store.state.limit_time / 60) + "ふん" + (this.$store.state.limit_time % 60) + "びょう"
      );
    },
    elapsed_display: function() {
      return (
        Math.floor(this.elapsed / 60) + "ふん" + (this.elapsed % 60) + "びょう"
      );
    },
    sec_conv_min: function() {
      return this.$store.state.limit_time / 60;
    }
  },
  components: {
    "v-draggable": Draggable,
    "v-sidemenu": SideMenu,
    Clock,
  },
  methods: {

    /**
     * タイマーを開始
     *
     */

    start_timer: function() {

      const $this = this;
      if (timer) clearInterval(timer);

      $this.start_time = $this.$moment();
      timer = setInterval(function() {
        $this.elapsed = $this.$moment().diff($this.start_time, "seconds");
      }, 1000);

      $this.pause = false;

      //サイドメニュー閉じる
      EventBus.$emit('toggle_side');
      // this.is_side = !this.is_side;

      //Toast通知
      this.$toast.show('START!', 'Good Luck!', this.$store.state.notificationSystem.options.show);
    },


    update_countdown_timer(time) {
      this.$refs.countdown.updateTime(time);
    },

    /**
     * タイルの完了チェックが変更された
     *
     */

    toggle_complete: function(id) {
      var _idx = _.findIndex(this.$store.state.current_items, { id: id });

      this.$store.commit('update_current_items_finished', _idx);
      //this.items[_idx].finished = !this.items[_idx].finished;

      //アニメーションでCheck ON
      setTimeout(function(){
        anime({
          targets: '[id="' + id + '"] .p-btn_finished .p-btn_circle',
          scale: [{ value: 0.5, duration: 0, }, { value: 1.5, duration: 1000 }],
          rotate: [
            { value: "0.65turn", duration: 0 },
            { value: "1turn", duration: 1000 }
          ]
        });

        anime({
          targets: '[id="' + id + '"] .p-btn_finished .p-btn_star',
          translateX: [
            { value: 0, duration: 0, delay:100 },
            { value: 75, duration: 1000 }
          ],
          translateY: [
            { value: 0, duration: 0, delay:100 },
            { value: -40, duration: 1000 }
          ],
          opacity: [
            { value: 0, delay:100, duration: 0 },
            { value: 1, delay:0, duration: 500 },
            { value: 0, duration: 500 }
          ],
          scale: [
            { value: 0, duration: 0 },
            { value: 1.5, duration: 400 },
            { value: 0, duration: 250 }
          ],
          rotate: [
            { value: "0.65turn", duration: 0, delay:100 },
            { value: "1turn", duration: 1000 }
          ]
        });

        anime({
          targets: '[id="' + id + '"] .p-btn_finished .p-btn_pulse',
          opacity: [
            { value: 0, delay:100, duration: 0 },
            { value: 0.5, duration: 400 },
            { value: 0, duration: 400 }
          ],
          scale: [
            { value: 0, duration: 0 },
            { value: 8, duration: 800 }
          ]
        });
      })

      this.checkComplete();
    },


    /**
     * 全て完了のOKボタンタップ時
     *
     */

    complete_all:function(){
      this.done = false;
      this.save_userscore();
    },

    /**
     * 全タイルの完了状況をチェックする
     *
     */

    checkComplete:function(){

      const not_finished_num = _.findIndex(this.$store.state.current_items, { added:true, finished: false });

      //未完了が0以下＝全て完了
      if(not_finished_num < 0){
        this.done = true;

        setTimeout(function(){
          anime({
            targets: '.p-finished',
            opacity: [
              { value: 0, duration: 0 },
              { value: 1, duration: 2000 }
            ]
          });
        })
      }else{
        this.done = false;
      }
    },

    /**
     * ScoreをDBに保存する
     *
     */

    save_userscore:function(){
      console.log("%cinfo: %csaving user score to DB...", 'color:blue','');

      const $this = this;

      // console.log($this.$store.state.current_set_id,
      // console.log($this.$moment().format('X')), //timestamp
      // console.log(_.filter($this.items, {added:true, finished:true}).length)

      //DBへ保存
      $db.scores
        .add({
          setId: $this.$store.state.current_set_id,
          date: Number($this.$moment().format('X')), //timestamp
          score: _.filter($this.$store.state.current_items, {added:true, finished:true}).length
        })
        .then(function() {

          //保存完了したらcheckedを全て外す
          $this.$store.commit('uncheck_all_current_items_finished');

          //Toast
          $this.$toast.show('データの保存が完了しました', 'Done!', $this.$store.state.notificationSystem.options.ballon);
          console.log("%cinfo: %csaving user score is finished", 'color:blue','');

        })
        .catch(function() {
          console.log("%cError: %csaving user score is failed", 'color:blue','');
          $this.$toast.show('DBの保存に失敗しました。', 'Done!', $this.$store.state.notificationSystem.options.error);
        });
    }
  },
  data: function() {
    return {
      time: '10:40',
      // limit: 0,
      elapsed: 0,
      start_time: 0,
      done:false,
      pause: true,
      date: {
        h: 0,
        m: 0,
        s: 0,
        Y: 0,
        M: 0,
        D: 0
      },
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
  .l-tiles &_img img{
    height: 14vh;
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

  .l-tiles &_caption {
    font-size: 18px;
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
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -40px;
    margin-left: -40px;
  }

  &_circle {
    width: 80px;
    height: 80px;
    background: rgba(76, 175, 80, 0.87);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -40px;
    margin-left: -40px;
    display:inline-grid;
  }

  &_star{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -12px;
    margin-left: -12px;
    path{
      fill:orange;
    }
  }

  &_pulse{
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -10px;
    margin-left: -10px;
    border: 1px solid rgba(76, 175, 80, 0.87);
    border-radius:50%;
  }

  &_list{
    overflow-x: scroll;
    padding: 20px 10px;
    -webkit-overflow-scrolling: touch;
    > div{
      min-width: 22.5%;
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

#app{
  color:#987661 !important;
  .v-input--slider *{
    color:#987661 !important;
  }
  .clock{
    border: 4px solid #b7a193; 
    .clock-hour{
      background:#ff5722;
      top: 30%;
      width: 6px;
      height: 20%;
      margin-left: -3px;
    }
    .clock-minute{
      background:green;
    }
    .hour{
      >span{
        >i{
          font-weight: bold;
          color:#987661;
        }
      }
    }
  }
}
 

</style>
