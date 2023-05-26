<template>
	<van-tabbar v-model="active" style="z-index: 1999">
		<van-tabbar-item
			v-for="(tab, index) in tabbar"
			:icon="tab.icon"
			:to="tab.path"
			:dot="tab.dot"
			:info="tab.info"
			:key="index">
			{{tab.name}}
		</van-tabbar-item>
	</van-tabbar>
</template>


<script>
import { Tabbar, TabbarItem } from 'vant';

export default {
  data() {
    return {
      active: 0,
      tabbar: [
        {
          name: '对话',
          path: '/',
          pathName: 'home',
          icon: 'wangwang-full',
          dot: false,
          info: ''
        },
        {
          name: '场景',
          path: '/items',
          pathName: 'class',
          icon: 'class-full',
          dot: false,
          info: ''
        },
        {
          name: '绘画',
          path: '/pic',
          pathName: 'pic',
          icon: 'gold-bean',
          dot: false,
          info: ''
        },
        {
          name: '我的',
          path: '/user',
          pathName: 'user',
          icon: 'wode',
          dot: false,
          info: ''
        }
      ]
    };
  },

  watch: {
    $route: 'changeActive'
  },

  created() {
    const toName = this.$route.name;
    this.setActive(toName);
  },

  methods: {
    changeActive({ name }) {
      this.setActive(name);
    },
    setActive(name) {
      this.tabbar.forEach((tab, i) => {
        if (tab.pathName == name) {
          this.active = i;
          return false;
        }
      });
    }
  },

  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  }
};
</script>
