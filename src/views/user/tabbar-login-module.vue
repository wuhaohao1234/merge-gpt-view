<template>
  <div class="user_module">
    <van-popup v-model="showLogin" :close-on-click-overlay="false">
      <van-cell-group>
        <van-cell style="padding:0;" title-style="text-align: center;" title="微信扫码关注公众号，自动登录"></van-cell>
        <van-image style="width: 13.5rem" :src="url"></van-image>
        <van-cell title-style="text-align: center;" title="机器星球计划"></van-cell>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
import { Popup, Cell, CellGroup,Image } from 'vant';
import {getLocalStorage, setLocalStorage} from "@/utils/local-storage";
import {loginInfo, loginQRCodePic} from "@/api/api";
export default {
  props: ['showLogin'],
  data() {
    return {
      url: '', //二维码地址
      sceneId:'',//二维码带的参数，用来判断是那个用户扫码的
      timer: null,//定时器
      timer_times: 0,//定时器超时停止重置
    };
  },
  created(){
  },
  beforeDestroy() {//离开页面，停止定时器
    window.clearInterval(this.timer);
  },
  methods: {
    async getLoginQRCode(){
      this.url = '';
      window.clearInterval(this.timer);//重置定时器
      this.timer_times=0;//重置定时请求信息次数

      loginQRCodePic().then(res => {
        var data=res.data.data;
        if(data.succ == '1'){
          this.url = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+data.data;
          this.sceneId = data.scene_id;
          this.timer = setInterval(this.getUserByScene, 2000);
        }
      });
    },
    //根据 sceneId 轮询查询用户信息，判断用户是否登录成功
    async getUserByScene(){
      if(!this.sceneId) return;
      loginInfo({
        token: this.sceneId
      }).then(res => {

        if(res.data.errno == 0 && res.data.data){
          setLocalStorage({
            Authorization: res.data.data.loginToken,
            avatar: res.data.data.avatar,
            nickName: res.data.data.nickname
          });
          this.user = res.data.data;
          window.clearInterval(this.timer);
          this.url = '';
          this.sceneId = '';
          // 登录成功后，触发 success-login 事件并传递数据
          this.$emit('success-login', true);
        }else{
          this.timer_times++
          if(this.timer_times>150){//5分钟后如果还没登录刷新登录二维码，换一个token试试
            this.getLoginQRCode();
          }
        }
      });

    }
  },
  name: 'login-module',
  components: {
    [Popup.name]: Popup,
    [Cell.name]: Cell,
    [Image.name]: Image,
    [CellGroup.name]: CellGroup
  }
};
</script>

<style scoped lang="scss">
.user_module {
  background-color: #fff;
}
.van-popup {
  width: 16rem;
  padding: 20px;
  box-sizing: border-box;
}
</style>
