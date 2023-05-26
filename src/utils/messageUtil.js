"use strict";
/*
 * @Author: N0ts
 * @Date: 2023-03-03 08:59:14
 * @Description: messageUtil
 * @FilePath: /chat-gpt/src/utils/messageUtil.ts
 * @Mail：mail@n0ts.top
 */
var index = 0;
function message(type) {
    var bodyDom = document.querySelector("body");
    var div = document.createElement("div");
    div.id = "messageBox";
    div.className = "messageBox-".concat(++index);
    div.innerHTML = "<div class=\"".concat(type.type, "\">").concat(type.content, "</div>");
    bodyDom === null || bodyDom === void 0 ? void 0 : bodyDom.appendChild(div);
    setTimeout(function () {
        index--;
        div.remove();
    }, 3000);
}
export default message
