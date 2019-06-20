<template>
  <div>
    <v-select
      :items="setlist"
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
    </v-flex>
  </div>
</template>

<script>
//Vue Component

export default {
  name: "home",
  created: function() {
    console.log("%cINFO%c: SideHome created","color:blue","");
  },
  mounted: async function() {
    const $this = this;
    //保存したセットリストをDBから読み込み
    $db.todos.toArray()
      .then(function (datas) {
        $this.setlist = datas;
      });

  },
  computed: {
    limit_display: function() {
      return (
        Math.floor(this.limit / 60) + "ふん" + (this.limit % 60) + "びょう"
      );
    },
  },
  components: {
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
    },

    /**
     * セットリストのセレクトボックスを選択
     *
     */

    onChangeSelect:function(id){
      const items = _.find(this.setlist, {id:id}).data;
      this.$store.commit('update_current_items', items);

      this.$store.commit('update_current_set', id);
    },

    /**
     * 制限時間を変更
     *
     */

    onChangeLimit:function(data){

      this.$store.commit('update_limit_time', data);
      this.$parent.countdown.updateTime(data)
    },

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
      // this.is_side = !this.is_side;

      //Toast通知
      this.$toast.show('START!', 'Good Luck!', this.$store.state.notificationSystem.options.show);
    },

    /**
     * タイマーを停止
     *
     */

    stop_timer: function() {
      const $this = this;
      $this.pause = true;
      clearInterval(timer);
    },

    /**
     * Finishボタン
     *
     */

    finish_timer:function(){
      //this.save_userscore();
    },

    /**
     * スコアの合計値を算出
     *
     */

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

  },
  data: function() {
    return {
      is_show:false,
      setlist:[],
      limit:0,
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
