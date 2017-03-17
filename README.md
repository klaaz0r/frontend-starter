# ⚒ frontend-starter
A starter for your frontend projects, made with Gulp and Webpack2. 

## features
* hot module reloading 
* injecting css on the fly
* linting 
* purify css 
* DLL

The core of the starter is the gulpfile, and I head you thinking "gulp? It's 2017 we are using webpack". Before this turns in a blog post, the reasons are simple. Webpack is great for bundleing javascript. But I do not like it for loading assets, assets do not belong in logic. Personally I think Gulp is perfect for loading images, styles and all other assets. 

Webpack is used in combination with Browsersync for HMR and for creating DLL files of your NPM modules.

To create a practicall configuration of the app I used gulp-convict. You can find more info on it [here](https://github.com/klaaz0r/gulp-convict).

## Tasks
The following tasks are pressent 
```
Available tasks
  build:prod  building production [clean]
  clean       cleaning dist/
  config      get the correct config
  css         building custom stylus
  default     starts dev server and watching files [clean]
  dll         making dll files (change dll.loader.js for new seperations)
  help        Display this help text.
  html        minify html and move to dist
  preserve    building files
  scripts     bundle app (only used for builds)
  serve       browserSync with webpack middleware [preserve]
```

## DLL
Or Dynamically Linked Library, seperate vendor files from your own code and speed up the reloading. Currently we are looking add a reload speed of 200ms in production for an application containing around 3000 lines of code. You can find more information about DLL on [robertknight's blog](https://robertknight.github.io/posts/webpack-dll-plugins/).

## HMR
Hot module reloading is an really nice thing, you can replace chunks of code live so that you don't get to reload the entire application. If you want to do this for a framework you need to tweek some thing.

If you want to work with cycle you need to change your `.babelrc` to

```javascript
{
  "presets": ["es2015", "stage-0", "stage-1"],
  "env": {
    "development": {
      "plugins": [
        "espower",
        ["cycle-hmr/most", {
          "include": [
            "**/app/**"
          ]
        }]
      ]
    },
    "production": {
      "plugins": []
    }
  }
}
```
change the include patt to your application folder and run  `npm install cycle-hmr`
