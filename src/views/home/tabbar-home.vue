<template>
  <div>
    <div id="chatgpt" :class="{ print: exportLoading }">
      <div
          id="sidebar"
          v-if="!exportLoading"
          :class="{ sideBarShow: sideBarShow }"
      >
        <div class="btns">
          <div class="btn" @click="newClient">新建会话 +</div>
        </div>
        <div id="chats" v-if="!exportLoading">
          <div
              v-for="(item, index) in clients"
              :key="index"
              @click="clientsIndex = index"
              :class="{ active: clientsIndex == index }"
          >
            <p>{{ item.name }}</p>
            <span @click.stop="removeClient(index)">🗑 删除</span>
          </div>
        </div>
        <div id="bottom" style="bottom: 10px;margin-bottom: 3.6rem;">
          <div class="btn" @click="themeUtil.switchTheme">
            {{
              themeUtil.themeCache.value == 'light'
                  ? '🌃 暗色模式'
                  : '🌇 亮色模式'
            }}
          </div>
        </div>
        <div id="showBtn" @click="sideBarShow = !sideBarShow">
          <div v-if="sideBarShow">
            <img src="@/assets/image/tab-left.png" style="width: 40px"/>
          </div>
          <div v-else>
            <img src="@/assets/image/tab-right.png" style="width: 40px"/>
          </div>
        </div>
      </div>
      <div id="main">
        <div
            id="messages"
            :class="{ print: exportLoading }"
            v-if="clients[clientsIndex]"
        >
          <div
              v-for="(item, index) in clients[clientsIndex].contents"
              :key="index"
              :class="item.role == 'user' ? 'right' : 'left'"
          >
            <div class="img">
              <div v-if="item.role == 'system'" class="system">SY</div>
              <div v-else-if="item.role == 'user'" class="user">Me</div>
              <div v-else class="ai">
                <img v-if="curChatVersion=='赛亚'"
                     src="@/assets/image/ai.png"
                     style="width: 60px; height: 60px"
                />
                <img v-if="curChatVersion=='超级赛亚'"
                     src="@/assets/image/ai.png"
                     style="width: 60px; height: 60px"
                />
              </div>
            </div>
            <div
                class="content"
                :class="{
                end:
                  !loading ||
                  index != clients[clientsIndex].contents.length - 1,
              }"
                v-html="item.content"
            ></div>
          </div>
          <div id="stretch" v-if="!exportLoading"></div>
        </div>
        <div v-else id="home">
          <div v-if="homeBackImgShow"
               style="width:40rem;margin-top:2.6rem;background-position: center center; background-image: url('https://www.xplanx.com/pic/home_back.jpeg');background-size: cover">
            <p style="margin-top:4px;margin-bottom:1px;border-radius:5px;padding-left:5px;padding-right:5px;color: #fa0076">
              解放人类大脑!(ChatGPT)</p>
            <p>超级AI已来！</p>
            <p>可针对性的连续提问</p>
            <div class="content">
              <p style="color: red">硅谷OPEN-AI、Google工程师参与开发</p>
              <div class="space"></div>
              <p>赶紧跟超级AI对话吧，让她帮你解决任何问题！</p>

              <p>帮你：创作内容|撰写文案|代码编写|AI教学|法律|解题</p>
              <p>毕业设计|金融分析|自动写作|语言翻译</p>
              <p>辅助哄女友|智能医疗|监测趋势并制定策略|等等等...</p>
              <p>
                机器星球计划 PC网址：<a href="https://www.xplanx.com" target="_blank"
                                       style="color: blue">https://www.xplanx.com</a
              >
              </p>
            </div>
          </div>
        </div>
        <div id="input" v-if="!exportLoading">
          <div class="stop" :class="{ stopShow: loading }" @click="stopMessage">
            停止回复 🛑
          </div>
          <!-- <p>tokens 总和：{{ tokensCountNum }}</p> -->
          <div class="textarea">
            <!--普通用户就是要显示变身升级-->
            <div class="btn"
                 :style="{fontWeight:'bold',backgroundSize: 'cover',
    marginRight: '5px', backgroundImage: 'url(' + require('@/assets/image/switch.png') + ')' }"
                 @click="chatSwitch">变身⇅
              <div style="text-align: center">{{ curChatVersion }}</div>
            </div>
            <!--
                        <div class="btn" style="padding:5px;font-weight: bold;margin-right: 5px">{{curChatVersion}}</div>
            -->
            <textarea
                placeholder="你想和我聊点什么？(按 Shift+Enter 键可换行)"
                v-model="message"
                @keydown="keydown"
                @keyup="keyup"
                style="height: 100%; line-height: 88%;padding-top: 1.1rem"
            ></textarea>
            <div class="btn" @click="send" style="font-weight: bold">发送</div>
          </div>
        </div>
      </div>
    </div>

    <van-popup v-model="showVersionUp">
      <van-cell-group>
        <van-image @click="upVipShow" src="https://www.xplanx.com/pic/up.jpeg"
                   style="width: 22rem;height: 50%">
        </van-image>
      </van-cell-group>
    </van-popup>
    <!--购买VIP-->
    <van-popup v-model="bBuyVip" style="width: 24rem;height: 25rem">
      <van-cell-group>
        <van-cell title="" center
                  style="height:6rem;text-align:center;font-weight:bold;background-image: url('https://www.xplanx.com/pic/buy_title.jpg');background-size: cover"
                  value=""/>
        <van-cell title="周VIP 10次对话" @click="pay('w10')"
                  style="background: linear-gradient(to right,#ff6034,#ee0a24);margin-top: 2px" value="¥3">
          <van-icon slot="right-icon" style="padding-left: 10px" size="1.5rem"
                    name="https://www.xplanx.com/pic/buyvip.png"/>
        </van-cell>
        <van-cell title="月VIP 200次对话" @click="pay('m200')"
                  style="background: linear-gradient(to right,#ff6034,#ee0a24);margin-top: 2px" value="¥30">
          <van-icon slot="right-icon" style="padding-left: 10px" size="1.5rem"
                    name="https://www.xplanx.com/pic/buyvip.png"/>
        </van-cell>
        <van-cell title="月VIP 无限次" @click="pay('mNoLim')"
                  style="background: linear-gradient(to right,#ff6034,#ee0a24);margin-top: 2px" value="¥99">
          <van-icon slot="right-icon" style="padding-left: 10px" size="1.5rem"
                    name="https://www.xplanx.com/pic/buyvip.png"/>
        </van-cell>
        <van-cell title="半年无限次VIP" @click="pay('hYNoLim')"
                  style="background: linear-gradient(to right,#ff6034,#ee0a24);margin-top: 2px" value="¥299">
          <van-icon slot="right-icon" style="padding-left: 10px" size="1.5rem"
                    name="https://www.xplanx.com/pic/buyvip.png"/>
        </van-cell>
        <van-cell title="年无限次VIP" @click="pay('YNoLim')"
                  style="background: linear-gradient(to right,#ff6034,#ee0a24);margin-top: 2px" value="¥399">
          <van-icon slot="right-icon" style="padding-left: 10px" size="1.5rem"
                    name="https://www.xplanx.com/pic/buyvip.png"/>
        </van-cell>
        <van-cell title="分享邀请3位好友可享免费与爆表AI对话10次"
                  style="background: linear-gradient(to right,#ff6034,#ee0a24);margin-top: 2px" value="¥0 邀请">
          <van-icon slot="right-icon" style="padding-left: 10px" size="2rem"
                    name="https://www.xplanx.com/pic/share.png"/>
        </van-cell>
      </van-cell-group>
    </van-popup>
    <!--显示gpt版本供选择-->
    <van-popup v-model="showVersionSwitch" style="width: 24rem;height: 25rem">
      <van-cell-group>
        <van-cell title="" center
                  style="height:6rem;text-align:center;font-weight:bold;background-image: url('https://www.xplanx.com/pic/buy_title.jpg');background-size: cover"
                  value=""/>
        <van-cell title="XPlanX3 (ChatGPT-3.5-turbo)" @click="switchVersion('赛亚')"
                  style="background: linear-gradient(to right,#ff6034,#ee0a24);margin-top: 2px" value="效率">
          <van-icon slot="right-icon" style="padding-left: 10px" size="1.5rem"
                    name="https://www.xplanx.com/pic/buyvip.png"/>
        </van-cell>
        <van-cell title="XPlanX4 (ChatGPT 4)" @click="switchVersion('超级赛亚')"
                  style="background: linear-gradient(to right,#ff6034,#ee0a24);margin-top: 2px" value="精准">
          <van-icon slot="right-icon" style="padding-left: 10px" size="1.5rem"
                    name="https://www.xplanx.com/pic/buyvip.png"/>
        </van-cell>
      </van-cell-group>
    </van-popup>
    <!--显示登录-->
    <login-module :showLogin="showLogin" ref="childLogin" @success-login="handleSuccessLogin"/>
  </div>
</template>

<script>
import '@/assets/css/global.css';
import '@/assets/css/messageUtil.css';
import '@/assets/css/markdown.css';
import {Popup, Image, Dialog} from 'vant';
import axios from 'axios';
import DialogCom from '@/components/dialogCom';
import messageUtil from '@/utils/messageUtil';
import hljs from 'highlight.js';
import Clipboard from 'clipboard';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import themeUtil from '@/utils/themeUtil';
import cacheUtil from '@/utils/cacheUtil';
import MarkdownIt from 'markdown-it';
import mk from '@iktakahiro/markdown-it-katex';
import pdfUtil from '@/utils/pdf';
import {collectAddOrDelete, orderH5pay, orderPrepay, userIndex} from '@/api/api';
import {getLocalStorage, setLocalStorage} from "@/utils/local-storage";
import loginModule from '@/views/user/tabbar-login-module';
import userModule from "@/views/user/tabbar-user-module.vue";

const md = new MarkdownIt();
md.use(mk);

const {config, read, save} = cacheUtil;
// 读取配置
read();

// 聊天窗口的 DOM
let messageDom = null;
// Viewer
let viewer = null;

// 会话列表
const cacheClients = window.localStorage.getItem('message-data');

export default {
  name: 'tabbarHome',
  components: {DialogCom, [Popup.name]: Popup, [Image.name]: Image, [loginModule.name]: loginModule},
  data() {
    return {
      themeUtil,
      config,
      read,
      save,
      // 输入 key dialog
      okKeyDialog: config.key == '',
      // 确认 key
      confirmKey: '',
      showLogin: false,
      loading: false,   // 是否正在加载
      // 消息内容
      message: '',
      // 滚动到底部
      scrollLock: false,
      // shift 是否按住
      shiftDown: false,
      // 消息框高度
      textareaHeight: 24,
      // 消息列表
      IMessage: {
        role: '',
        content: '',
        tokens: null,
        stream: '',
      },
      // 回话列表
      IClient: {name: '', contents: '', exceedTokens: null},
      clients: cacheClients ? JSON.parse(cacheClients) : [],
      clientsIndex: -1,
      // 侧边栏显示
      sideBarShow: false,
      homeBackImgShow: true,
      // 设置显示
      settingShow: false,
      // 获取余额
      moneyData: null,
      // tokens 总和
      tokensCountNum: 0,
      // 导出 pdf
      exportLoading: false,
      bBuyVip: false,
      vipInfo: [],
      showVersionUp: false,//是否展示升级页面
      showVersionSwitch: false,//是否展示切换版本页面
      curChatVersion: "赛亚",//当前版本，默认赛亚
    };
  },
  created() {
    this.init();
  },
  mounted() {
    viewer = new Viewer(document.querySelector('#main'));
    messageDom = document.querySelector('#messages');
    themeUtil.load();
    /*    wxToken().then(res => {
          config.key = "sk-"+res.data.data;
        });*/

    /*   if (config.key) {
         this.getMoeny();
       }*/
    //判断用户是否已经登录
    //取用户vipTpye即userLevel

  },
  methods: {
    handleSuccessLogin(isSuccess) {
      // 登录成功后的逻辑
      if (isSuccess) {
        this.showLogin = false; // 隐藏登录模块
        this.init();
      }
    },
    init() {
      userIndex().then(res => {
        if (res.data.errno == 200) {
          //判断是否登录
          this.vipInfo = res.data.data.vipInfo;
        }
      }).catch(err => {
        if (err.data.errno == 501) {
          this.showLogin = true;
          this.$refs.childLogin.getLoginQRCode()
        }
      });
    },
    /* 确认 key ---*/
    okKey() {
      if (this.confirmKey == '') {
        return messageUtil({
          type: 'warning',
          content: 'key 不能为空',
        });
      }

      config.key = this.confirmKey;
      this.confirmKey = '';
      save();

      this.okKeyDialog = false;
      messageUtil({
        type: 'success',
        content: 'key 存储成功，开始提问吧',
      });

      this.getMoeny();
    },
    pay(vipType) {
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') != -1;
      if (isWeixin) {
        orderPrepay({vipType: vipType})
            .then(res => {
              let data = res.data.data;
              let prepay_data = JSON.stringify({
                appId: data.appId,
                timeStamp: data.timeStamp,
                nonceStr: data.nonceStr,
                package: data.packageValue,
                signType: 'MD5',
                paySign: data.paySign
              });
              setLocalStorage({prepay_data: prepay_data});

              if (typeof WeixinJSBridge == 'undefined') {
                if (document.addEventListener) {
                  document.addEventListener(
                      'WeixinJSBridgeReady',
                      this.onBridgeReady,
                      false
                  );
                } else if (document.attachEvent) {
                  document.attachEvent(
                      'WeixinJSBridgeReady',
                      this.onBridgeReady
                  );
                  document.attachEvent(
                      'onWeixinJSBridgeReady',
                      this.onBridgeReady
                  );
                }
              } else {
                this.onBridgeReady();
              }
            })
            .catch(err => {
              Dialog.alert({message: err.data.errmsg});
              that.$router.replace({
                name: 'paymentStatus',
                params: {
                  status: 'failed'
                }
              });
            });
      } else {
        orderH5pay({vipType: vipType})
            .then(res => {
              let data = res.data.data;
              window.location.replace(
                  data.wxPayInfo.mwebUrl +
                  '&redirect_url=' +
                  encodeURIComponent(
                      window.location.origin +
                      '/#/?orderId=' +
                      data.orderId +
                      '&tip=yes'
                  )
              );
            })
            .catch(err => {
              Dialog.alert({message: err.data.errmsg});
            });
      }
    },
    onBridgeReady() {
      let that = this;
      let data = getLocalStorage('prepay_data');
      // eslint-disable-next-line no-undef
      WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          JSON.parse(data.prepay_data),
          function (res) {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              that.$router.replace({
                name: 'paymentStatus',
                params: {
                  status: 'success'
                }
              });
            } else if (res.err_msg == 'get_brand_wcpay_request:cancel') {
              that.$router.replace({
                name: 'paymentStatus',
                params: {
                  status: 'cancel'
                }
              });
            } else {
              that.$router.replace({
                name: 'paymentStatus',
                params: {
                  status: 'failed'
                }
              });
            }
          }
      );
    },
    /* 切换 chat版本 */
    chatSwitch() {//点击Switch 变身的时候
      //检查是否有chatgpt4的权限
      //没有就发起充值
      if (this.vipInfo) {
        if (this.vipInfo.userLevel == 0) {  //普通用户
          this.showVersionUp = true;
        } else if (this.vipInfo.userLevel > 0) {//有vip,可以随意切换版本
          this.showVersionSwitch = true;
        }
      }

    },
    switchVersion(data) {
      this.$dialog.confirm({message: '确定切换AI版本吗？'}).then(() => {
        window.localStorage.setItem("AIVersion", data);
        this.curChatVersion = data;
      });
    },
    upVipShow() {//弹窗升级会员页面
      this.showVersionUp = false;
      this.bBuyVip = true;
    },

    /* 提交问题 ---*/
    submit() {
      this.loading = true;
      const clientCache = this.clients[this.clientsIndex].contents;
      const lastClientCache = clientCache[clientCache.length - 1];
      if (lastClientCache.role != 'assistant') this.pushResult('assistant', '');

      let cacheSystemClient = null;
      if (clientCache[0].role == 'system') {
        cacheSystemClient = clientCache[0];
      }
      const messages = clientCache.slice(
          this.clients[this.clientsIndex].exceedTokens * 2
      );
      if (cacheSystemClient) {
        messages.unshift(cacheSystemClient);
      }
      this.clients[this.clientsIndex].contents[
      this.clients[this.clientsIndex].contents.length - 1
          ].content = md.render('思考中...');

      fetch('https://api.n0ts.top/chatgpt-stream', {
        method: 'POST',
        body: JSON.stringify({
          key: config.key,
          model: config.data.model,
          messages: messages.map((item) => {
            // HACK 过滤掉前几个聊天会话
            return {
              role: item.role,
              content: item.stream,
            };
          }),
          timeout: 60000,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
          .then((res) => {
            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let streamCache = '';
            let that = this;
            reader.read().then(async function processText(res) {
              if (res.done || !that.loading) {
                return;
              }

              const decodeContent = decoder.decode(res.value);

              // error
              if (decodeContent.includes(`"error": {\n`)) {
                that.loading = false;
                return that.errorHandle(decodeContent);
              }

              // done
              if (decodeContent.includes('data: [DONE]')) {
                that.loading = false;
                const client =
                    that.clients[that.clientsIndex].contents[
                    that.clients[that.clientsIndex].contents.length - 1
                        ];
                client.tokens = await that.computedToken(client.content);
                that.saveMessage();
                await that.$nextTick(() => {
                });
                that.hljsInit();
                viewer.update();
                return;
              }

              decodeContent
                  .replaceAll('data: ', '')
                  .split('\n')
                  .filter(Boolean)
                  .forEach(async (item) => {
                    const itemObj = JSON.parse(item);
                    if (!itemObj.choices[0].delta.content) {
                      return;
                    }

                    const str = itemObj.choices[0].delta.content;

                    streamCache += str;

                    that.clients[that.clientsIndex].contents[
                    that.clients[that.clientsIndex].contents.length - 1
                        ].content = md.render(streamCache);
                    that.clients[that.clientsIndex].contents[
                    that.clients[that.clientsIndex].contents.length - 1
                        ].stream = streamCache;
                    await that.$nextTick(() => {
                    });
                    that.hljsInit();
                  });
              return reader.read().then(processText);
            });
          })
          .catch(() => {
            this.clients[this.clientsIndex].contents[
            this.clients[this.clientsIndex].contents.length - 1
                ].content =
                '<p>发起网络请求失败，服务器可能正在维护中，请稍后重试</p>';
            messageUtil({
              type: 'danger',
              content: '发起网络请求失败，请稍后重试',
            });
            this.saveMessage();
            this.loading = false;
          });
    },

    /* 存入数据 */
    async pushResult(role, content, errContent) {
      const resultContent = errContent ? errContent : content;
      const contentData = {
        role,
        content: resultContent,
        tokens: 0,
        stream: resultContent,
      };
      this.clients[this.clientsIndex].contents.push(contentData);
      contentData.tokens = await this.computedToken(contentData.stream);
      this.saveMessage();
      await this.$nextTick(() => {
      });
      this.hljsInit();
      viewer.update();
    },

    /* 保存会话 */
    saveMessage() {
      window.localStorage.setItem('message-data', JSON.stringify(this.clients));
      this.tokensCount();
    },

    /* 发送消息 */
    send() {
      if (this.message == '' || this.message.trim() == '' || this.loading) {
        return;
      }

      // 没有对话时
      if (this.clientsIndex == -1) {
        this.clients.unshift({
          name: '',
          contents: [],
          exceedTokens: 0,
        });
        this.clientsIndex = 0;
      }

      // 是否设置了行为
      if (
          config.system &&
          this.clients[this.clientsIndex].contents.length == 0
      ) {
        this.pushResult('system', md.render(config.system));
      }

      this.pushResult('user', md.render(this.message));

      // 第一句对话修改标题
      if (
          this.clients[this.clientsIndex].contents.length == 1 ||
          (this.clients[this.clientsIndex].contents[0].role == 'system' &&
              this.clients[this.clientsIndex].contents.length == 2)
      ) {
        const cacheName = this.message;
        let num = 1;
        this.clients.forEach((item) => {
          if (item.name.indexOf(cacheName) == 0) {
            num++;
          }
        });
        this.clients[this.clientsIndex].name =
            cacheName + (num == 1 ? '' : ` #${num}`);
        document.title = cacheName + ' | ChatGPT';
      }

      // 清空输入框
      this.message = '';

      this.submit();
    },
    /* 滚动到底部 */
    scrollToBottom() {
      if (this.scrollLock) {
        return;
      }
      this.scrollLock = true;
      setTimeout(() => {
        this.scrollLock = false;
        messageDom = document.querySelector('#messages');
        if (messageDom) {
          messageDom.scrollTo({
            top: messageDom.scrollHeight,
            behavior: 'smooth',
          });
        } else {
          this.scrollToBottom();
        }
      }, 300);
    },

    /* 消息框键盘按下 */
    keydown(event) {
      // shift 是否按下
      if (event.keyCode === 16) {
        this.shiftDown = true;
      }
      // shift 不按住与 enter 按下，则发送
      if (!this.shiftDown && event.keyCode === 13) {
        this.send();
        event.preventDefault();
        return false;
      }
    },

    /* 消息框键盘抬起 */
    keyup(event) {
      // shift 是否取消按下
      if (event.keyCode === 16) {
        this.shiftDown = false;
      }
    },

    /* 创建新会话 */
    newClient() {
      this.saveMessage();
      let num = 1;
      this.clients.forEach((item) => {
        if (item.name.indexOf('新会话') == 0) {
          num++;
        }
      });
      this.clients.unshift({
        name: '新会话' + (num == 1 ? '' : ` #${num}`),
        contents: [],
        exceedTokens: 0,
      });
      this.message = '';
      this.clientsIndex = 0;
    },
    /* 删除会话 */
    removeClient(i) {
      // 删除会话
      document.title = '机器星球计划';
      this.clients.splice(i, 1);
      this.clientsIndex = -1;
      this.saveMessage();
    },
    /* 代码高亮 */
    async hljsInit() {
      const dom = [];
      const codeBlocks = document.querySelectorAll('#messages pre code');
      codeBlocks.forEach((cache) => {
        const item = cache;
        if (item.getAttribute('class').includes('hljs')) {
          return;
        }
        const copyBtn = document.createElement('div');
        copyBtn.className = 'copyBtn';
        copyBtn.innerHTML = '复制';
        copyBtn.setAttribute('code', item.innerText);
        copyBtn.addEventListener('click', (e) => {
          this.copyCode(e);
        });
        item.parentElement.appendChild(copyBtn);
        hljs.highlightElement(item);
        dom.push(item);
      });
      this.addCodeNum(dom);
      this.scrollToBottom();
    },
    /* 添加代码行号 */
    addCodeNum(dom) {
      for (let i = 0; i < dom.length; i++) {
        const enter = dom[i].innerHTML.replace(/\n/g, '</li><li>');
        dom[i].innerHTML = `<ol><li>${enter}</li></ol>`.replace(
            '<li></li></ol>',
            '</ol>'
        );
      }
    },
    /* 复制代码块 */
    copyCode(el) {
      const code = el.target.getAttribute('code');
      if (code) {
        Clipboard.copy(code);
        messageUtil({
          type: 'success',
          content: '复制成功',
        });
      }
    },
    /* 重置配置 */
    reloadConfig() {
      window.localStorage.removeItem('message-data');
      window.localStorage.removeItem('n0ts-chatgpt-theme');
      window.localStorage.removeItem('n0ts-chatgpt-config');
      window.location.reload();
    },
    /* 确认设定 */
    toggleSetting() {
      this.settingShow = !this.settingShow;
      save();
      messageUtil({
        type: 'success',
        content: '设置已保存',
      });
    },
    /* 获取余额 */
    async getMoeny() {
      const {data} = await axios({
        method: 'post',
        url: 'https://api.n0ts.top/cors',
        data: {
          method: 'GET',
          url: 'https://api.openai.com/dashboard/billing/credit_grants',
          headers: {
            authorization: `Bearer ${config.key}`,
          },
        },
      });
      this.moneyData = data.data;
    },
    /* 保留两位 */
    moneyToFixed(num, fixed) {
      return Number(num.toFixed(fixed));
    },
    /* 错误处理 */
    errorHandle(error) {
      const errorObj = JSON.parse(
          error.replace('未知错误，请联系站长解决！', '')
      );
      console.error('报错了哥们', errorObj);

      if (errorObj.error.code == 'invalid_api_key') {
        messageUtil({
          type: 'danger',
          content: 'API Key 错误，请重新配置',
        });
        config.key = '';
        save();
        this.okKeyDialog = true;
        return;
      } else if (errorObj.error.code == 'context_length_exceeded') {
        this.clients[this.clientsIndex].exceedTokens += 1;
        return this.submit();
      } else if (errorObj.error.code === null) {
        // 未知错误
        messageUtil({
          type: 'danger',
          content: '发生了未知的错误，请稍后重试',
        });
      } else {
        this.clients[this.clientsIndex].contents[
        this.clients[this.clientsIndex].contents.length - 1
            ].content = error;
      }
    },
    /* token 计算 */
    async computedToken(content) {
      return 0;
      // if (!content) {
      //     return 0;
      // }
      // const { data } = await axios({
      //     method: "GET",
      //     url: "https://api.n0ts.top/chatgpt/encoder",
      //     params: {
      //         content
      //     }
      // });
      // if (data.status == 400) {
      //     return 0;
      // }
      // return data.data.tokens / 2;
    },
    /* tokens 总和 */
    tokensCount() {
      if (!this.clients[this.clientsIndex]) {
        return;
      }
      let count = 0;
      this.clients[this.clientsIndex].contents.forEach((item) => {
        count += item.tokens;
      });
      this.tokensCountNum = count;
    },
    /* 暂停会话 */
    stopMessage() {
      this.loading = false;
    },
    /* 导出 pdf */
    async exportPdf() {
      this.exportLoading = true;
      this.$nextTick(() => {
      });
      await pdfUtil(
          'ChatGPT 对话导出 | ' +
          new Date().toLocaleDateString().replaceAll('/', '-').toString(),
          '#main'
      );
      messageUtil({
        type: 'success',
        content: '正在导出中，耐心稍等一会~',
      });
      this.exportLoading = false;
    }
  },
  watch: {
    /* 监听消息框内容变化改变高度 */
    message(nmsg) {
      // 根据换行符计算高度
      const lines = nmsg.split('\n').length;
      this.textareaHeight = lines * 24;
    },
    /* 会话索引切换 */
    async clientsIndex(nIndex) {
      if (this.clients[nIndex]) {
        document.title = this.clients[nIndex].name + ' | 机器星球计划';
        await this.$nextTick(() => {
        });
        this.tokensCount();
        this.hljsInit();
        viewer.update();
      }
    },
  },
};
</script>

<style scoped>
@import url('https://cdn.bootcdn.net/ajax/libs/firacode/6.2.0/fira_code.min.css');
@import './style.css';
</style>