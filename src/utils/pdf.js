"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

// 页面导出为pdf格式
var html2canvas_1 = require("html2canvas");
var jspdf_1 = require("jspdf");
function exportPdf(title, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var dom = document.querySelector(id);
                    if (!dom) {
                        return;
                    }
                    (0, html2canvas_1["default"])(dom).then(function (canvas) {
                        var pdf = new jspdf_1["default"]("p", "mm", "a4");
                        var ctx = canvas.getContext("2d");
                        // a4
                        var a4w = 190;
                        var a4h = 272;
                        // 计算一页高度
                        var imgHeight = Math.floor((a4h * canvas.width) / a4w);
                        if (!ctx)
                            return;
                        var renderedHeight = 0;
                        while (renderedHeight < canvas.height) {
                            var page = document.createElement("canvas");
                            page.width = canvas.width;
                            page.height = Math.min(imgHeight, canvas.height - renderedHeight); //可能内容不足一页
                            //用getImageData剪裁指定区域，并画到前面创建的canvas对象中
                            var context = page.getContext("2d");
                            if (!context)
                                return;
                            context.putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0);
                            pdf.addImage(page.toDataURL("image/jpeg", 1.0), "JPEG", 10, 10, a4w, Math.min(a4h, (a4w * page.height) / page.width)); //添加图像到页面，保留10mm边距
                            renderedHeight += imgHeight;
                            if (renderedHeight < canvas.height) {
                                pdf.addPage(); //如果后面还有内容，添加一个空页
                            }
                        }
                        pdf.save("".concat(title, ".pdf"));
                        resolve(null);
                    });
                })];
        });
    });
}

export default {
    __esModule: true,
    exportPdf
}
