<template>
  <v-app id="app">
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs8>
          <v-text-field label="セット名" v-model="preset_name" single-line solo></v-text-field>
          <v-combobox
            v-model="select"
            :items="saved_list"
            item-text="name"
            item-value="id"
            label="Select a favorite activity or create a new one"
            @change="onChangeCombo"
          ></v-combobox>
        </v-flex>
        <v-flex xs4>
          <v-btn @click="save_todo">保存</v-btn>
          <v-btn @click="load_todo">読込</v-btn>
          <v-btn @click="delete_todo">削除</v-btn>
        </v-flex>
      </v-layout>
      <v-layout class="p-pop" row wrap>
        <v-draggable class="drag-container">
          <v-flex class="pa-3" xs4 v-if="item.added" v-for="(item) in items" :key="item.id" grow shrink>
            <li class="p-btn" :id="item.id">
              <div class="p-btn_img">
                <img :src="item.img" alt="todo.name">
              </div>
              <div class="p-btn_caption">{{item.name}}-(No.{{item.id}})</div>
              <div @click="delete_from_list(item.id)" class="p-btn_delete"><v-icon>clear</v-icon></div>
            </li>
          </v-flex>
        </v-draggable>
      </v-layout>
      <v-layout class="p-btn_list" row nowrap>
        <v-flex class="pa-2" v-for="(item) in items" :key="item.id">
          <li
            class="p-btn"
            @click="add_card(item.id)"
            v-if="!item.added"
            :id="item.id"
            :data-finished="item.finish"
          >
            <div class="p-btn_img">
              <img :src="item.img" alt="item.name">
            </div>
            <div class="p-btn_caption">
              {{item.name}}
            </div>
          </li>
        </v-flex>
      </v-layout>
      <v-layout>
        <a href="/test">test</a>
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
          finished:false,
          score:1
        },
        {
          id: 2,
          name: "はみがき",
          img: "./img/ha_hamigaki_boy.png",
          added: false,
          finished:false,
          score:1
        },
        {
          id: 3,
          name: "おきがえ",
          img: "./img/kigae_boy.png",
          added: false,
          finished:false,
          score:1
        },
        {
          id: 4,
          name: "おかたづけ",
          img: "./img/omocha_kataduke.png",
          added: false,
          finished:false,
          score:1
        },
        {
          id: 5,
          name: "かお あらう",
          img: "./img/sengan_boy.png",
          added: false,
          finished:false,
          score:1
        },
        {
          id: 6,
          name: "てあらい うがい",
          img: "./img/ugai_tearai.png",
          added: false,
          finished:false,
          score:1
        },
        {
          id: 7,
          name: "もちもの エプロン",
          img: "./img/apron.png",
          added: false,
          finished:false,
          score:1
        },
        {
          id: 8,
          name: "もちもの ハンカチ",
          img: "./img/fashion_handkerchief_blue.png",
          added: false,
          finished:false,
          score:1
        },
        {
          id: 9,
          name: "もちもの はぶらし",
          img: "./img/haburashi.png",
          added: false,
          finished:false,
          score:1
        },
        {
          id: 10,
          name: "もちもの すいとう",
          img: "./img/obentou_suitou.png",
          added: false,
          finished:false,
          score:1
        },
        {
          id: 11,
          name: "もちもの うわぐつ",
          img: "./img/uwabaki_blue.png",
          added: false,
          finished:false,
          score:1
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
