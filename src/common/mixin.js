import {debounce} from "./Utils";

export const itemListenerMixin = {
  data() {
    return {
      itemListener: null,
      newRefresh: null
    }
  },
  mounted() {
    //重新刷新高度
    this.newRefresh = debounce(this.$refs.scroll.refresh,200)
    this.itemListener = ()=> {
      this.newRefresh()
    }
    this.$bus.$on('itemImageLoad',this.itemListener)
  }
}

import BackTop from "components/common/backTop/BackTop";

export const topBackMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0,0,800)
    },
    listenerShowBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000
    }
  }
}
