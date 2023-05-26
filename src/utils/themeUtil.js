"use strict";
/*
 * @Author: N0ts
 * @Date: 2023-03-07 11:43:13
 * @Description: 主题色配置
 * @FilePath: /chat-gpt/src/utils/themeUtil.ts
 * @Mail：mail@n0ts.top
 */

var vue_1 = require("vue");
var themeCache = (0, vue_1.ref)("");
function setLocalStorage(theme) {
    window.localStorage.setItem("n0ts-chatgpt-theme", theme);
    themeCache.value = theme;
}
function load() {
    var cache = window.localStorage.getItem("n0ts-chatgpt-theme");
    if (!cache) {
        setLocalStorage("light");
    }
    else {
        themeCache.value = cache;
    }
    document.documentElement.setAttribute("theme", cache || "light");
}
function switchTheme() {
    themeCache.value = window.localStorage.getItem("n0ts-chatgpt-theme");
    themeCache.value = themeCache.value === "light" ? "dark" : "light";
    setLocalStorage(themeCache.value);
    load();
}
export default {
    __esModule: true,
    switchTheme: switchTheme,
    load: load,
    themeCache: themeCache
};
