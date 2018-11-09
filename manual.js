/*
MIT License

Copyright (c) 2018 tkpphr

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * @returns {string}
 * "ja-JP" will be "ja"
 */
function getLanguage() {
    var navigator = window.navigator;
    var language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || navigator.browserLanguage;
    if (language.split("-")[0] === "ja") {
        language = "ja";
    }
    return language;
}

/**
 * @param contents {Object}
 * @example
 * "default" key is required. 
 * var contents = {
 *   "default":{
 *     "title": "Title"
 *     "desc": "<p>Desc</p><p>Paragraph1</p>"
 *   },
 *   "ja":{
 *     "title": "題名",
 *     "desc": "<p>概要</p><p>段落1</p>"
 *   }
 * };
 * localizeContents(contents);
 */
function localizeContents(contents) {
    var language = getLanguage();
    if (!Object.keys(contents).some(function (lang) { return lang === language; })) {
        language = "default";
    }
    Array.prototype.forEach.call(document.querySelectorAll("*[data-localize-content]"), function (element) {
        element.innerHTML = contents[language][element.getAttribute("data-localize-content")];
    });
}

/**
 * @param optionalLanguages {string[]}
 */
function localizeImages(optionalLanguages) {
    var imgElements = document.querySelectorAll("img[data-localize-image-name]");
    var language = getLanguage();
    if (!optionalLanguages.some(function (optionalLanguage) { return language === optionalLanguage; })) {
        language = "default";
    }
    Array.prototype.forEach.call(imgElements, function (imgElement) {
        var src = "./images/" + language + "/";
        src = src + imgElement.getAttribute("data-localize-image-name");
        imgElement.src = src;
    });
}

/**
 * @param img {HTMLImgElement}
 * @param canvas {HTMLCanvasElement}
 * @param rect {x:number,y:number,width:number,height:number}
 */
function drawClippedImage(img, canvas, rect) {
    canvas.width = rect.width * (img.width / img.naturalWidth);
    canvas.height = rect.height * (img.height / img.naturalHeight);
    canvas.getContext("2d").drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height);
}

/**
 * @param position {x:number,y:number}
 * @param rect {x:number,y:number,width:number,height:number}
 */
function pointInRect(position, rect) {
    return rect.x <= position.x && position.x <= rect.width + rect.x && rect.y <= position.y && position.y <= rect.height + rect.y;
}

/**
 * @param {HTMLImgElement} img Source of image
 * @param {HTMLCanvasElement} canvas Destination of drawing
 * @param {key:{name:{"default": rectName:string, "optional_language": string, "optional_language": string}, x:number,y:number,width:number,height:number},...} clipRects
 * @param {(rectName:string) => void} clickRect OnClick handler of the rect that cursor is hovered 
 * @param {r:number,g:number,b:number} [rectColor={r:0,g:0,b:255}] rectColor is optional. Number must be between 0 and 255
 * @param {r:number,g:number,b:number} [nameColor={r:0,g:140,b:255}] nameColor is optional. Number must be between 0 and 255
 */
function drawNavigationCanvas(img, canvas, clipRects, clickRect,rectColor,nameColor) {
    var ctx = canvas.getContext("2d");
    var hRatio = img.width / img.naturalWidth;
    var vRatio = img.height / img.naturalHeight;
    var rectColorString;
    var nameColorString;
    if(rectColor){
        rectColorString = String(rectColor.r) + "," + String(rectColor.g) + "," + String(rectColor.b) + ",";
    }else{
        rectColorString = "0,140,255,"; 
    }
    if(nameColor){
        nameColorString = String(nameColor.r) + "," + String(nameColor.g) + "," + String(nameColor.b) + ",";
    }else{
        nameColorString = "254,140,0,";
    }
    canvas.width = img.width;
    canvas.height = img.height;
    var clipRectKeys = Object.keys(clipRects);
    if (clipRectKeys.length === 0) {
        return;
    }
    ctx.font = "20px sans";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    var language = getLanguage();
    if (!Object.keys(clipRects[clipRectKeys[0]].name).some(function (lang) { return lang === language; })) {
        language = "default";
    }


    var hoveredRectKey = undefined;
    var drawCanvasContent = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
        clipRectKeys.forEach(function (key) {
            var clipRect = clipRects[key];
            ctx.lineWidth = 2;
            ctx.strokeStyle = " rgba("+ rectColorString + "1.0) ";
            ctx.strokeRect(clipRect.x * hRatio, clipRect.y * vRatio, clipRect.width * hRatio, clipRect.height * vRatio);
            ctx.fillStyle = " rgba("+ nameColorString + "1.0) ";
            ctx.fillText(clipRects[key].name[language], (clipRect.x + (clipRect.width / 2)) * hRatio, (clipRect.y + (clipRect.height / 2)) * vRatio);
        });
    };
    var handleMouseInCanvas = function(e) {
        var canvasRect = canvas.getBoundingClientRect();
        var mousePosition = { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top };

        var detectedRects = clipRectKeys.filter(function (key) {
            var clipRect = clipRects[key];
            var adjustedRect = { x: clipRect.x * hRatio, y: clipRect.y * vRatio, width: clipRect.width * hRatio, height: clipRect.height * vRatio };
            return pointInRect(mousePosition, adjustedRect);
        });

        if (detectedRects.length === 0) {
            if (hoveredRectKey === undefined) {
                return;
            }
            hoveredRectKey = undefined;
            canvas.style.cursor = "default";
            drawCanvasContent();
        } else {
            if (hoveredRectKey === detectedRects[0]) {
                return;
            }
            hoveredRectKey = detectedRects[0];
            canvas.style.cursor = "pointer";
            drawCanvasContent();
            var clipRect = clipRects[detectedRects[0]];
            ctx.fillStyle = " rgba("+ rectColorString + "0.2) ";
            ctx.fillRect(clipRect.x * hRatio, clipRect.y * vRatio, clipRect.width * hRatio, clipRect.height * vRatio);
        }
    };
    drawCanvasContent();
    canvas.addEventListener("mousemove", handleMouseInCanvas);
    canvas.addEventListener("mouseenter", handleMouseInCanvas);
    canvas.addEventListener("mouseleave", function (e) {
        hoveredRectKey = undefined;
        canvas.style.cursor = "default";
        drawCanvasContent();
    });
    canvas.addEventListener("click", function (e) {
        if (hoveredRectKey) {
            clickRect(hoveredRectKey, clipRects[hoveredRectKey]);
        }
    });
}

function initializeModal() {
    Array.prototype.forEach.call(document.querySelectorAll("*[data-modal]"), function (modalElement) {
        var modalName = modalElement.getAttribute("data-modal");
        modalElement.style.visibility = "hidden"; 
        Array.prototype.forEach.call(document.querySelectorAll("*[data-modal-openable=" + modalName + "]"), function (element) {
            element.addEventListener("click", function () {
                modalElement.style.visibility = "visible";
            });
        });
        Array.prototype.forEach.call(document.querySelectorAll("*[data-modal-closable=" + modalName + "]"), function (element) {
            element.addEventListener("click", function () {
                modalElement.style.visibility = "hidden";
            });
        });
    });
}

/**
 * @param url {string}
 * @param target {string:"\_blank"|"\_self"|"\_top"|"\_parent"}
 */
function jumpToURL(url, target) {
    var a = document.createElement("a");
    a.href = url;
    if (target) {
        a.target = target;
    }
    a.click();
}
