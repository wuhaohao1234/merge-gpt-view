<template>
  <div class="login" style="background-color: #333333">
    <div class="text-desc text-center" style="margin-top: 10%;font-size: large">扫码关注公众号，自动登录</div>
    <div class="clearfix" style="position:absolute;left:50%; top:50%; margin-left: -100px; margin-top: -150px;">
      <div class="float-l">
        <img :src="url" width="200" height="200">
      </div>
    </div>
    <div class="text-desc text-center bottom_positon">机器星球计划 </div>
  </div>
</template>

<script>
import field from '@/components/field/';
import fieldGroup from '@/components/field-group/';

import {authInfo, authLoginByAccount, brandDetail, loginInfo, loginQRCodePic} from '@/api/api';
import { setLocalStorage,getLocalStorage } from '@/utils/local-storage';
import { emailReg, mobileReg } from '@/utils/validate';

import QRCode from 'qrcodejs2'
import { Toast } from 'vant';


export default {
  name: 'login-request',
  components: {
    [field.name]: field,
    [fieldGroup.name]: fieldGroup,
    Toast
  },
  data() {
    return {
      url: '', //二维码地址
      sceneId:'',//二维码带的参数，用来判断是那个用户扫码的
      timer: null,//定时器
      timer_times: 0,//定时器超时停止重置
      account: '',
      password: '',
      visiblePass: false,
      isLogining: false,
      userInfo: {}
    };
  },
  created(){
    const { Authorization } = getLocalStorage(
        'Authorization'
    );
    if (!Authorization) {
      this.getLoginQRCode();
    }
  },beforeDestroy() {//离开页面，停止定时器
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
          //登录成功，处理登录成功逻辑
          //this.$Message.success('登录成功')
          this.routerRedirect();
        }else{
          this.timer_times++
          if(this.timer_times>150){//5分钟后如果还没登录刷新登录二维码，换一个token试试
            this.getLoginQRCode();
          }
        }
      });

    }, routerRedirect() {
      // const { query } = this.$route;
      // this.$router.replace({
      //   name: query.redirect || 'home',
      //   query: query
      // });
      window.location = '#/home/';
    }
  }
};
</script>


<style lang="scss" scoped>
@import '../../assets/scss/mixin';
.login {
  position: relative;
  background-color: #fff;
}
.store_header {
  text-align: center;
  padding: 30px 0;
  .store_avatar img {
    border-radius: 50%;
  }
  .store_name {
    padding-top: 5px;
    font-size: 16px;
  }
}
.register {
  padding-top: 40px;
  color: $font-color-gray;
  a {
    color: $font-color-gray;
  }
  > div {
    width: 50%;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .connect {
    @include one-border(right);
    text-align: right;
  }
}
.bottom_positon {
  position: absolute;
  bottom: 30px;
  width: 100%;
}
</style>
