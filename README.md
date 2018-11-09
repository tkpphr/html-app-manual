# HTML App Manual

## Overview
Create the Manual for application that is made of simple html framework. 

## Usage

<a href="https://tkpphr.github.io/html-app-manual/index.html">Open sample</a>

### Localization

<a href="https://tkpphr.github.io/html-app-manual/localization-demo.html">Open demo</a>

- Content

1. Create element with attribute[data-localize-content="&lt;key&gt;"].
```html
<h1 data-localize-content="title"></h1>
<div data-localize-content="desc"></div>
```

2. Create contents value like this. "default" key is required.
```javascript
var contents = {
  "default": {
      "title":"Title",
      "desc": "<p>Description</p><p>Paragraph1</p>"
  },
  "ja": {
      "title":"タイトル",
      "desc": "<p>説明</p><p>段落1</p>"
  }
};           
```

3. Execute "localizeContents".
```javascript
localizeContents(contents);
```

- Image
1. Create the "images" folder in same location of html.

2. Create the "default" folder and "optional-language" folders to "images" folder.
"optional-language" folder name must be language code or language-country code.

3. Add same name image files to "default" folder and "optional-language" folders.

4. Create the img element with attribute[data-localize-image-name="&lt;filename&gt;.&lt;extension&gt;"];
```html
<img data-localize-image-name="<filename>.<extension>">
```

5. Execute "localizeImages" 
```javascript
localizeImages(["optional-language"]);
```

### Modal

<a href="https://tkpphr.github.io/html-app-manual/modal-demo.html">Open demo</a>

1. Create the elements like this.
```html
<span class="button" data-modal-openable="modal">Open modal</span>
...
<div class="modal-background" data-modal="modal">
  <div class="modal-foreground light-theme" style="width:50%; height:50%;">
    <div class="modal-head">
      <div>
          <span>Title</span>
      </div>
      <div>
          <span class="button" data-modal-closable="modal">X</span>
      </div>
    </div>
      <div class="modal-body">
        <p>Mesaage</p>
      </div>  
    </div>
</div>
```
- Attribute[data-modal="&lt;modal-name&gt;"] must be unique.
- Attribute[data-modal-openable="&lt;modal-name&gt;"] should set the element for opening modal. Modal will be opened by click the element.
- Attribute[data-modal-closable="&lt;modal-name&gt;"] should set the element for closing modal. Modal will be closeed by click the element.

2. Execute "initializeModal"
```javascript
initializeModal();
```

### Canvas

<a href="https://tkpphr.github.io/html-app-manual/canvas-demo.html">Open demo</a>

- Image Clipping
1. Create the element.
```html
<img id="image" src="image.jpg">
<canvas id="canvas"></canvas>
```

2. Execute "drawClippedImage"
"rect" position and size must based on original image. 
```javascript
drawClippedImage(img, canvas, rect:{x:number,y:number,width:number,height:number});
```

- Image Navigation
1. Create the element.
```html
<img src="image.jpg" hidden>
<canvas></canvas>
```
2. Create "clipRects" value like this. "default" key is required.
```javascript
var clipRects = {
  "rect_1_key": {
      name: {
        "default": "name",
        "ja": "名前",
    },
    x: 50, y: 50, width:  100, height: 100
  },
  ...
  "rect_n_key": {
};
```

3. Execute "drawNavigationCanvas"
```javascript
drawNavigationCanvas(img, canvas, clipRects, function (key, clipRect) { /* do something */ },{r:0,g:0,b:255},{r:0,g:0,b:0});
```

## License
Released under the MIT License.
See LICENSE File.