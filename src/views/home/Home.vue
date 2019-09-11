<template>
  <div id="home">
    <nav-bar class="nav-bar">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" :titles="['流行', '新款', '精选']" @tabClick="tabClick" v-show="isShowTabControl" ref="tabControl2" ></tab-control>
    <scroll class="content" ref="scroll" :probeType="3" :pull-up-load="true" @scorll="contentScroll" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control :titles="['流行', '新款', '精选']" @tabClick="tabClick" ref="tabControl1" ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar"
  import TabControl from "components/common/TabControl/TabControl";
  import GoodsList from "components/common/goods/GoodsList";
  import Scroll from "components/common/scroll/scroll";
  // import BackTop from "components/common/backTop/BackTop";

  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";

  import {getHomeMultidata,getHomeGoods} from "network/home"
  import {itemListenerMixin,topBackMixin} from "common/mixin";

  export default {
    name: "Home",
    mixins: [itemListenerMixin,topBackMixin],
    components: {
      // BackTop,
      Scroll,
      GoodsList,
      TabControl,
      FeatureView,
      RecommendView,
      HomeSwiper,
      NavBar
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop' : {page : 0, list:[]},
          'new' : {page : 0, list:[]},
          'sell': {page : 0, list:[]}
        },
        currentType:'pop',
        // isShowBackTop: false,
        isShowTabControl: false,
        saveY: 0,
        tabOffsetTop: 0

      }
    },
    created() {
      //1.头数据
      this.getHomeMultidata()
      //2.tabcontrol数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    destroyed() {
      console.log('home destroyed');
    },
    mounted() {

    },
    activated() {
      // console.log('activated');
      // console.log(this.saveY);
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()

    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()

      // console.log('deactivated');
      console.log(this.$refs.scroll.getScrollY());
      //离开时监听itemImageLoad关闭
      this.$bus.$off('itemImageLoad',this.itemListener)
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    methods: {
      //事件监听方法
      tabClick(index) {
        // console.log(index);
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      // backClick() {
      //   this.$refs.scroll.scrollTo(0,0,800)
      // },
      contentScroll(position){
        // this.isShowBackTop = (-position.y) > 1000]
        this.listenerShowBackTop(position)
        this.isShowTabControl = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl1.$el.offsetTop
        // console.log(this.$refs.tabControl1.$el.offsetTop);
      },
      //网络请求方法
      getHomeMultidata() {
        getHomeMultidata().then(res=>{
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        let page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
  .nav-bar{
    background-color: var(--color-tint);
    color:#fff;
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  .tab-control {
    /*position: sticky;*/
    position: relative;
    /*top: 44px;*/
    z-index: 9;
  }
  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0px;
    right: 0px;
    overflow: hidden;
  }
</style>

