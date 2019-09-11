<template>
    <div class="toast">
        <div v-show="isShow">{{message}}</div>
    </div>
</template>

<script>
  export default {
    name: "Toast",
    data() {
      return {
        isShow: false,
        message: ''
      }
    },
    methods: {
      show(message='',duration=2000) {
        this.isShow = true
        this.message = message
        setTimeout(()=>{
          this.isShow = false
          this.message = ''
        },duration)
      }
    }
  }
</script>

<style scoped>
    .toast div {
        position: fixed;
        top:50%;
        left:50%;
        padding: 8px 10px;
        color: #fff;
        background: rgba(0,0,0,.75);
        z-index: 99;
        transform: translate(-50%);
    }
</style>