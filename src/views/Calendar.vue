<template>
  <v-app id="app">
    <v-container fluid>
      <v-layout row wrap fill-height>
        <v-flex xs12>
          <v-calendar
            ref="calendar"
            v-model="start"
            :type="type"
            :end="end"
            color="primary"
          ></v-calendar>          
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
//Vue Component
// import TaskCard from './TaskCard';
import Draggable from "vuedraggable";

export default {
  name: "home",
  created: function() {
  },
  mounted: async function() {
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
    "v-draggable": Draggable
  },
  methods: {
    /**
     * 一覧からtodoを追加
     *
     */
    add_card: function(id) {
      var _data = this._.find(this.items, { id: id });

      _data.added = true;
      // this.todos.push(_data);
    },
    onChangeCombo:function(e){
      const $this = this;
      // _.each($this.items, function(v,k){
      //   v.added = false;
      // })

      this.items = e.data;

      //ラベル名にデータを反映
      $this.preset_name = e.name;
      //Todoリストにデータを反映
      // $this.todos = e.data;

      //リストに追加済カードは選択可能一覧から削除する
      // var _id = _.map(e.data,function(e){
      //   return e.id
      // })
      // _.each(_id,function(i){
      //   _.find($this.items, {'id':i}).added = true;
      // })
    },
    delete_from_list:function(id){
       var _data = this._.find(this.items, { id: id });
       _data.added = false;
    },
    /**
     * 選択したtodoを読み込み
     *
     */
    load_todo: function() {
      console.log("loading..");
    },
    /**
     * 選択したtodoを削除
     *
     */
    delete_todo: function() {
      console.log("delte..");
    },
    /**
     * todoを保存
     *
     */
    save_todo: function() {
      let errList = [];
      try {
        //validation
        if (!this.preset_name) errList.push("セット名が空です");
        // if (this.todos.length < 1) errList.push("Todoリストが空です");

        if(errList.length) throw new Error(errList);

        //DBへ保存
        $db.todos
          .add({
            name: this.preset_name,
            data: this.items
          })
          .then(function() {})
          .catch(function() {
            alert("DBの保存に失敗しました。");
          });
      } catch (error) {
        alert(error.message);
      }
    }
  },
  data: function() {
    return {
      preset_name: "",
      select: "",
      saved_list: [],
      items: [
        {
          id: 1,
          name: "あさ ごはん",
          img: "./img/food_toast.png",
          added: false,
          finished:false
        },
        {
          id: 2,
          name: "はみがき",
          img: "./img/ha_hamigaki_boy.png",
          added: false,
          finished:false
        },
        {
          id: 3,
          name: "おきがえ",
          img: "./img/kigae_boy.png",
          added: false,
          finished:false
        },
        {
          id: 4,
          name: "おかたづけ",
          img: "./img/omocha_kataduke.png",
          added: false,
          finished:false
        },
        {
          id: 5,
          name: "かお あらう",
          img: "./img/sengan_boy.png",
          added: false,
          finished:false
        },
        {
          id: 6,
          name: "てあらい うがい",
          img: "./img/ugai_tearai.png",
          added: false,
          finished:false
        },
        {
          id: 7,
          name: "もちもの エプロン",
          img: "./img/apron.png",
          added: false,
          finished:false
        },
        {
          id: 8,
          name: "もちもの ハンカチ",
          img: "./img/fashion_handkerchief_blue.png",
          added: false,
          finished:false
        },
        {
          id: 9,
          name: "もちもの はぶらし",
          img: "./img/haburashi.png",
          added: false,
          finished:false
        },
        {
          id: 10,
          name: "もちもの すいとう",
          img: "./img/obentou_suitou.png",
          added: false,
          finished:false
        },
        {
          id: 11,
          name: "もちもの うわぐつ",
          img: "./img/uwabaki_blue.png",
          added: false,
          finished:false
        }
      ],
      todos: []
    };
  }
};
</script>

<style lang="scss" scoped>
.p-pop {
  background: #eee;
  border-radius: 8px;
  padding: 8px;
  min-height: 20vh;
}
</style>
