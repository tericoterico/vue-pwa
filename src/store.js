import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    current_set_id:"",  //現在選択中セットのID
    current_items:[],
    limit_time:0,  //制限時間
    notificationSystem: {
      options: {
        show: {
          theme: 'dark',
          icon: 'icon-person',
          position: 'topCenter',
          progressBarColor: 'rgb(0, 255, 184)',
          buttons: [
            ['<button>Ok</button>', function (instance, toast) {
              alert("Hello world!");
            }, true],
            ['<button>Close</button>', function (instance, toast) {
              instance.hide({
                transitionOut: 'fadeOutUp',
                onClosing: function (instance, toast, closedBy) {
                  console.info('closedBy: ' + closedBy);
                }
              }, toast, 'buttonName');
            }]
          ],
          onOpening: function (instance, toast) {
            console.info('callback abriu!');
          },
          onClosing: function (instance, toast, closedBy) {
            console.info('closedBy: ' + closedBy);
          }
        },
        ballon: {
          balloon: true,
          position: 'bottomCenter'
        },
        info: {
          position: 'bottomLeft'
        },
        success: {
          position: 'bottomRight'
        },
        warning: {
          position: 'topLeft'
        },
        error: {
          position: 'topRight'
        },
        question: {
          timeout: 20000,
          close: false,
          overlay: true,
          toastOnce: true,
          id: 'question',
          zindex: 999,
          position: 'center',
          buttons: [
            ['<button><b>YES</b></button>', function (instance, toast) {
              instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            }, true],
            ['<button>NO</button>', function (instance, toast) {
              instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
            }]
          ],
          onClosing: function (instance, toast, closedBy) {
            console.info('Closing | closedBy: ' + closedBy);
          },
          onClosed: function (instance, toast, closedBy) {
            console.info('Closed | closedBy: ' + closedBy);
          }
        }
      }
    }
  },
  mutations: {

    /**
     * 現在選択中セットIDの更新
     *
     */

    update_current_set(state,payload){
      state.current_set_id = payload;
    },

    /**
     * 制限時間時間の更新
     *
     */

    update_limit_time(state,payload){
      state.limit_time = payload;
    },

    /**
     * 制限時間時間の更新
     *
     */

    update_current_items(state,payload){
      state.current_items = payload;
    },

    /**
     * 
     *
     */

    update_current_items_finished(state, payload){
      state.current_items[payload].finished = !state.current_items[payload].finished
    },

    /**
     * 
     *uncheck_all_current_items_finished
     */

    uncheck_all_current_items_finished(state){
      _.each(state.current_items, function(v,k){
        v.finished = false;
      })
    },


  },
  actions: {

  }
})
