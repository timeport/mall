<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "scroll",
    data() {
      return {
        scroll: null
      }
    },
    props: {
      probeType: {
        type:Number,
        default:0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      this.scroll = new BScroll(this.$refs.wrapper,{
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })
      //监听滚动位置
      if(this.probeType == 2 || this.probeType === 3){
        this.scroll.on("scroll",(position)=>{
          // console.log(position);
          this.$emit('scorll',position)
        })
      }
      //监听到底部
      if(this.pullUpLoad){
        this.scroll.on('pullingUp',()=>{
          console.log('pullingUp');
          this.$emit('pullingUp')
        })
      }

    },
    methods:{
      scrollTo(x,y,time=500){
        this.scroll && this.scroll.scrollTo(x,y,time)
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
        // console.log('imageLoad');
      },
      getScrollY() {
        console.log(this.scroll.y);
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>
.content {
}
</style>
