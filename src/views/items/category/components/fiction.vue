<template>
  <div class="fiction">
    <div class="fiction-select_content">
      <div class="items">
        <span>小说题材</span>
        <div class="items-input">
          <input
            v-model="theme"
            placeholder="输入内容"
            style="background-color: transparent"
          />
          <span @click="changeShowPicker(true, 0)">选择</span>
        </div>
      </div>
      <div class="items">
        <span>模仿书籍</span>
        <div class="items-input">
          <input
            v-model="book"
            placeholder="输入内容"
            style="background-color: transparent"
          />
          <span @click="changeShowPicker(true, 1)">选择</span>
        </div>
      </div>
      <div class="items">
        <span>语气风格</span>
        <div class="items-input">
          <input
            v-model="style"
            placeholder="输入内容"
            style="background-color: transparent"
          />
          <span @click="changeShowPicker(true, 2)">选择</span>
        </div>
      </div>
    </div>
    <!-- 故事背景 -->
    <div class="storyBackground">
      <div class="writeHeader">
        <h4>故事背景</h4>
        <span
          class="van-typography"
          @click="generateStoryBackground"
          type="text"
          >帮我生成故事背景</span
        >
      </div>
      <van-field
        v-model="storyBackgroundText"
        clearable
        autosize
        center
        placeholder="请输入...(你的要求越多、越详细，我回答的越好)"
        type="textarea"
        rows="3"
        size="large"
        style="background-color: #fff; border-radius: 10px"
      />
    </div>
    <!-- 人物关系 -->
    <div class="characterRelationships">
      <div class="writeHeader">
        <h4>人物关系</h4>
        <span
          class="van-typography"
          @click="generatecharacterRelationships"
          type="default"
          >帮我生成人物关系</span
        >
      </div>
      <van-field
        v-model="characterRelationshipsText"
        clearable
        autosize
        center
        placeholder="请输入...(你的要求越多、越详细，我回答的越好)"
        type="textarea"
        rows="3"
        size="large"
        style="background-color: #fff; border-radius: 10px"
      />
    </div>
    <!-- 前文 -->
    <div class="characterRelationships">
      <div class="writeHeader">
        <h4>前文</h4>
      </div>
      <van-field
        v-model="preambleText"
        clearable
        autosize
        center
        placeholder="请写出前文"
        type="textarea"
        rows="3"
        size="large"
        style="background-color: #fff; border-radius: 10px"
      />
    </div>

    <!-- 输出剧情选项 -->
    <div class="characterRelationships">
      <div class="writeHeader">
        <h4>输出字数</h4>
      </div>
      <div class="outFontNum">
        <van-button @click="foucsBtn = 0" :class="foucsBtn === 0 ? 'focus' : ''"
          >300字</van-button
        >
        <van-button @click="foucsBtn = 1" :class="foucsBtn === 1 ? 'focus' : ''"
          >500字</van-button
        >
        <van-button @click="foucsBtn = 2" :class="foucsBtn === 2 ? 'focus' : ''"
          >1000字</van-button
        >
      </div>
      <van-button
        type="primary"
        @click="generatePlot"
        style="width: 100%; margin-top: 20px; border-radius: 5px"
      >
        生成剧情
      </van-button>
    </div>

    <div class="characterRelationships">
      <div class="writeHeader">
        <h4>剧情详情</h4>
      </div>
      <van-field
        v-model="plotText"
        clearable
        autosize
        center
        placeholder="请写剧情概要"
        type="textarea"
        rows="3"
        size="large"
        style="background-color: #fff; border-radius: 10px"
      />
    </div>

    <van-popup round position="bottom" v-model="showPicker">
      <van-picker
        show-toolbar
        :columns="columns[index]"
        @cancel="changeShowPicker(false)"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import { Popup, Picker, Field } from 'vant';

import cacheUtil from '@/utils/cacheUtil';
const { config, read, save } = cacheUtil;

export default {
  name: 'Fiction',
  components: {
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Field.name]: Field,
  },
  data() {
    return {
      showPicker: false,
      theme: '',
      book: '',
      style: '',
      // 玄幻奇幻武侠仙侠都市言情历史军事体育科幻悬疑
      // 平静稳重慷慨激昂热情奔放轻松自如慢条斯理愤怒沮丧轻蔑嘲讽富有幽默感神秘的纯真的痴情的钦佩的悲伤的高兴的幸福的愤怒的紧张的友善的严谨的情感化世俗化夸张的惊悚的
      // 《球场上的婚姻》《灵与肉欲》《冠军之夜》《风靡全球的女主播》《超级经纪人》《重生冠军之路》《当年冠军》《棋魂》《洪荒之森罗万象》《长夜漫漫短梦》
      columns: [
        [
          { text: '玄幻', value: 'Fantasy' },
          { text: '奇幻', value: 'Fantasy' },
          { text: '武侠', value: 'Martial Arts' },
          { text: '仙侠', value: 'Xianxia' },
          { text: '都市', value: 'Urban' },
          { text: '言情', value: 'Romance' },
          { text: '历史', value: 'Historical' },
          { text: '军事', value: 'Military' },
          { text: '体育', value: 'Sports' },
          { text: '科幻', value: 'Science Fiction' },
          { text: '悬疑', value: 'Mystery' },
        ],

        [
          { text: '平静', value: 'Calm' },
          { text: '稳重', value: 'Steady' },
          { text: '慷慨', value: 'Generous' },
          { text: '激昂', value: 'Passionate' },
          { text: '热情', value: 'Enthusiastic' },
          { text: '奔放', value: 'Unrestrained' },
          { text: '轻松', value: 'Relaxed' },
          { text: '自如', value: 'Easygoing' },
          { text: '慢条斯理', value: 'Leisurely' },
          { text: '愤怒', value: 'Angry' },
          { text: '沮丧', value: 'Depressed' },
          { text: '轻蔑', value: 'Contemptuous' },
          { text: '嘲讽', value: 'Sarcastic' },
          { text: '富有幽默感', value: 'Humorous' },
          { text: '神秘的', value: 'Mysterious' },
          { text: '纯真的', value: 'Innocent' },
          { text: '痴情的', value: 'Devoted' },
          { text: '钦佩的', value: 'Admiring' },
          { text: '悲伤的', value: 'Sad' },
          { text: '高兴的', value: 'Happy' },
          { text: '幸福的', value: 'Content' },
          { text: '愤怒的', value: 'Furious' },
          { text: '紧张的', value: 'Tense' },
          { text: '友善的', value: 'Friendly' },
          { text: '严谨的', value: 'Meticulous' },
          { text: '情感化', value: 'Emotional' },
          { text: '世俗化', value: 'Secularized' },
          { text: '夸张的', value: 'Exaggerated' },
          { text: '惊悚的', value: 'Thrilling' },
        ],
        [
          { text: '球场上的婚姻', value: 'Marriage on the Pitch' },
          { text: '灵与肉欲', value: 'Spirit and Carnal Desire' },
          { text: '冠军之夜', value: 'Night of the Champions' },
          {
            text: '风靡全球的女主播',
            value: 'The Globally Popular Female Anchor',
          },
          { text: '超级经纪人', value: 'Super Agent' },
          { text: '重生冠军之路', value: "The Rebirth of a Champion's Path" },
          { text: '当年冠军', value: 'Former Champion' },
          { text: '棋魂', value: 'Chess Soul' },
          {
            text: '洪荒之森罗万象',
            value: 'All Things in the Primordial Chaos',
          },
          { text: '长夜漫漫短梦', value: 'Long Night, Short Dream' },
        ],
      ],
      index: 0,
      storyBackgroundText: '',
      characterRelationshipsText: '',
      preambleText: '',
      foucsBtn: 1,
      plotText: '',
    };
  },

  methods: {
    onConfirm(selectedOptions) {
      this.showPicker = false;
      if (this.index === 0) {
        this.theme = selectedOptions.text;
      }
      if (this.index === 1) {
        this.book = selectedOptions.text;
      }
      if (this.index === 2) {
        this.style = selectedOptions.text;
      }
    },
    changeShowPicker(boo, num) {
      if (num) {
        this.index = num;
      }
      this.showPicker = boo;
    },
    generateStoryBackground() {
      this.submit('storyBackgroundText');
    },
    generatecharacterRelationships() {
      this.submit('characterRelationshipsText');
    },
    generatePlot() {
      this.submit('generatePlot');
    },
    submit(text) {
      // 使用 fetch API 获取响应流
      fetch('https://api.n0ts.top/chatgpt-stream', {
        method: 'POST',
        body: JSON.stringify({
          key: config.key,
          model: config.data.model,
          messages: [
            {
              role: 'user',
              content:
                text === 'characterRelationshipsText'
                  ? '写小说帮我生成人物关系'
                  : text === 'generatePlot'
                  ? '生成剧情' +
                    (this.foucsBtn === 0
                      ? '300字'
                      : this.foucsBtn === 1
                      ? '500字'
                      : '1000字')
                  : `帮我生成故事背景${this.theme} ${this.style} ${this.theme}`,
            },
            {
              role: 'assistant',
              content: '',
            },
          ],
          timeout: 60000,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          // 获取 ReadableStream 对象
          const stream = response.body;

          // 获取流的阅读器
          const reader = stream.getReader();
          const decoder = new TextDecoder('utf-8');
          // 定义接受返回数据的函数
          const processStream = () => {
            reader.read().then((result) => {
              // 处理返回的数据
              const message = result.value;
              const decodeContent = decoder.decode(message);

              // done
              if (decodeContent.includes('data: [DONE]')) {
                Toast('生成完毕！');
                // this.scrollToBottom();
                return;
              }

              if (decodeContent) {
                // 在这里将返回的消息添加到页面中
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
                    if (text === 'storyBackgroundText') {
                      this.storyBackgroundText += str;
                    }
                    if (text === 'characterRelationshipsText') {
                      this.characterRelationshipsText += str;
                    }
                    if (text === 'generatePlot') {
                      this.plotText += str;
                    }
                  });
              } else {
                Toast('生成完毕！');
              }
              // 持续读取数据
              processStream();
            });
          };
          // 开始持续读取数据
          processStream();
        })
        .catch((err) => {
          console.log('error:', err);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.fiction {
  &-select_content {
    display: flex;

    .items {
      width: 120px;
      margin-right: 20px;

      &-input {
        position: relative;
        margin-top: 10px;

        input {
          height: 30px;
          width: 100%;
          border-radius: 5px;
          border: 1px solid #ccccca;
          padding-left: 10px;

          &::placeholder {
            margin-left: 10px;
          }
        }

        input {
          cursor: pointer;
        }

        span {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 10px;
          color: #4c83ff;
          line-height: 50px;
          border: none;
          outline: none;
          cursor: pointer;
        }
      }
    }
  }
}

.writeHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .van-typography {
    cursor: pointer !important;
    color: #4c83fc;
  }
}

.outFontNum {
  .van-button {
    margin-right: 10px;
  }

  .focus {
    color: #4c83fc !important;
    border: 1px solid #4c83fc !important;
  }
}
.characterRelationships {
  margin-top: 10px;
}
</style>
