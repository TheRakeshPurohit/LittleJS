# LittleJS FAQ

Welcome to the LittleJS FAQ!
This document addresses common questions and issues to help developers get started and troubleshoot their projects.
If you don’t find an answer here, feel free to ask the community or check the documentation.

---

## Getting Started
### What is LittleJS, and how is it different from other JavaScript game engines?

LittleJS is a lightweight and fast JavaScript game engine designed for simplicity and super fast sprite rendering.
It focuses on 2D games and provides essential features like game objects, particle effects, and physics out of the box.
Unlike larger engines, LittleJS has a small footprint and avoids unnecessary complexity, making it perfect for quick prototyping or smaller projects. 

### How do I set up a basic LittleJS project?

Download the LittleJS repository via GitHub or npm.
Include one of the LittleJS builds from the dist folder.
Several examples are included for you to build on.
The most basic example is just an empty project.

[Empty Example HTML file:](https://github.com/KilledByAPixel/LittleJS/blob/main/examples/empty/index.html)
```html
<!DOCTYPE html><head>
<title>LittleJS Hello World Demo</title>
<meta charset=utf-8>
</head><body>

<script src=../../dist/littlejs.js></script>
<script src=game.js></script>
```

[Empty Example JavaScript file:](https://github.com/KilledByAPixel/LittleJS/blob/main/examples/empty/game.js)
```javascript
/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

'use strict';

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // called once after the engine starts up
    // setup the game
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    // called every frame at 60 frames per second
    // handle input and update the game state
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
    // called after physics and objects are updated
    // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    drawTextScreen('Hello World!', mainCanvasSize.scale(.5), 80);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);
```

### Why do I see a blank screen when I run my game?

If you are seeing a blank screen, first try opening the dev tools console (F12 in most browsers).
This will show you any errors that occur and allows stepping through code to help debug.
A common issue is the image data failing to load with a message like "The image element contains cross-origin data, and may not be loaded."
This is likely because the game was loaded directly without first setting up a local web server.

### Do I need a local server to run LittleJS games, and how do I set one up?

Yes, this is a necessary step because web browsers just have protection from loading local files which includes images.
So any JavaScript projects that load images like games must be opened from a local web server.
Don't panic though, it's easy to fix! 

If you are using [Visual Studio Code](https://code.visualstudio.com/) there is a [Live Preview Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) that will handle this for you automatically.

Another option is to setup a simple local web server like [http-server](https://www.npmjs.com/package/http-server) via npm.

### What browsers are supported by LittleJS?

LittleJS has been tested and is fully supported in all modern web browsers including Chrome, Firefox, Safari, Opera, and Edge.

---

## Graphics and Assets

### How do I load and add images to my game?

First you need to load an image file. For LittleJS this is typically done on startup via a parameter to engineInt that is a list of images to load. The engine will ensure that the images are all loaded before starting. Each source image can be up to 4096x4096 in size so most games only need one texture, though its possible to load as many as you need.

```engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);```

LittleJS works best when your tile sheet is broken up into grids of tiles because the rendering system can be batched up. To draw a tile from a source image you can call drawTile and pass in TileInfo object. Another common approach is to create an EngineObject and set it's tileInfo, it will automatically be rendered.

```drawTile(vec2(21,5), vec2(4.5), tile(3,128));```

### What is the tile function and how do tile indexes work?

The tile function is a very useful function that takes a tile index and size and returns a TileInfo object which can be passed to functions like drawTile. It works by accepting using the tileIndex multiplied by the tileSize to get the coordinates for the TileInfo. It's also possible to pass in padding for sheets that are set up for it.

### Can I add and switch between multiple sprites for a game object?

You can set the object's tileInfo to a new sprite, or just call drawTile directly with any sprite.

```this.tileInfo = tile(3, 32);```

### How do I handle animations in LittleJS?

You can use the TileInfo.frame function passing in the number of animation frames to offset the sprite. It sounds kind of weird at first but imagine your sprites are all aligned on a grid with frames of animations being next to eachother. Thos allows easily indexing into those animations from the base sprite location. For example to animate the player sprite you might do something like this...

```this.tileInfo = spriteAtlas.player.frame(animationFrame);```

### What file formats are supported for images and sounds?

---

## Gameplay and Programming

### How do I add keyboard or mouse input to my game?
### How do I create and update game objects?
### What is the correct way to handle collisions in LittleJS?
### Can I use physics with LittleJS?
### How do I add particle effects to my game?

---

## Debugging and Development

### How do I debug my game in LittleJS?
### What are some common reasons for errors or crashes in LittleJS?
### How do I optimize performance for larger games?
### How do I organize my code as my game gets bigger?
### Can I use modules with LittleJS?

---

## Advanced Features
### Does LittleJS support tilemaps, and how can I implement them?
### Can I use custom shaders or WebGL features with LittleJS?
### How do I add audio to my game?
### Is it possible to export LittleJS games to mobile or desktop?
### Can I integrate external libraries or tools with LittleJS?

---

## Community and Resources
### Where can I find documentation or tutorials for LittleJS?
### How do I share my game with the LittleJS community?
### Are there any open-source LittleJS projects I can learn from?
### How can I contribute to LittleJS development or documentation?
### Who do I contact if I find a bug or have a feature request?

---

## Contribute to the FAQ
If you have additional questions or think something should be added to this FAQ, please open an issue or pull request on the [LittleJS GitHub repository](https://github.com/FrankForce/LittleJS).

---

Happy coding with LittleJS! 🎮