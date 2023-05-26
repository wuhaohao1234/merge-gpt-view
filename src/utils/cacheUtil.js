"use strict";
/*
 * @Author: N0ts
 * @Date: 2023-03-07 17:15:32
 * @Description: 缓存配置操作
 * @FilePath: /chat-gpt/src/utils/cacheUtil.ts
 * @Mail：mail@n0ts.top
 */
import config_1 from "../config/config"
function save() {
    window.localStorage.setItem("n0ts-chatgpt-config", JSON.stringify(config_1));
    return config_1;
}
function read() {
    var _a;
    var cache = JSON.parse((_a = window.localStorage.getItem("n0ts-chatgpt-config")) !== null && _a !== 0 ? _a : "{}");
    if (cache.key && cache.key === config_1.key) {
        config_1.key = cache.key;
        config_1.data = cache.data;
        config_1.system = cache.system;
        return config_1;
    }
    return save();
}
export default {
    __esModule: true,
    save: save,
    read: read,
    config: config_1
};
