<template>
    <div class="p-taskcard">
        <div class="p-icon_check">checked</div>
    </div>
</template>

<script>
export default {
    props: {
        row:{
            type:Object
        }
    },
    data:function(){
        return{
        }
    }
}
</script>

<style lang="scss" scoped>
    .p-taskcard{
        width: 200px;
        height: 150px;
        background:#fff;
        border-radius: 4px;
        position: relative;
        .p-icon_check {
            position: absolute;
            top: 50%;
            left: 50%;
            margin: -25px 0 0 -25px;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            background:green;
        }

    }
</style>
