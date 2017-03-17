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

To create a practicall configuration of the app I used gulp-convict.
