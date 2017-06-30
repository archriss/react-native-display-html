# react-native-display-html
Display HTML content in an automatically sized webview and eases javascript injection inside it.
Pull requests are very welcome!

The motivation behind this is to stop parsing HTML to render it as native components. It might work on simple HTML when you have the freedom of tweaking it, but on much more complex HTML... it's just not possible yet. Don't even get me started on platform's specific rendering issues (don't you ever render an image inside a text component on Android !).

We gave up, so here's `react-native-display-html`.

## Table of contents

1. [Usage](#usage)
1. [Props](#props)
1. [Tips and tricks](#tips-and-tricks)
1. [TODO](#todo)
1. [Credits](#credits)

![](https://puu.sh/uVFAX/963cb53848.png)

## Installation

```
$ npm install --save react-native-display-html
```

**You also need to link `react-native-webview-bridge` as native dependency.** [Check the README here](https://github.com/archriss/react-native-webview-bridge) (you don't have to add the package manually, it will be installed by `react-native-display-html` in your `node_modules` folder).

> We will continue relying on it until the `Webview` component backed into react-native's core is stable enough for our needs.

## Usage

```javascript
...

render () {
    return (
        <DisplayHTML
            htmlString={'<p>Hello there !</p><img src="http://placehold.it/500x1000" />'}
            HTMLStyles={'body { background-color:lightblue }'}
        />
    );
}
```

## Props

> In addition to these props, you can provide **any prop from the [Webview component](https://facebook.github.io/react-native/docs/webview.html)** except for `injectedJavaScript`, `source` and `onMessage` which are handled in a specific way.

Prop | Description | Type | Default
------ | ------ | ------ | ------
htmlString | HTML to display (`doctype` & `<body>` not needed) | `string` | **Required**
onMessage | Function called when webview sent data from `window.WebViewBridge.send` | `func` |
additionalScripts | Array of functions to be injected in webview | `array` |
title | Title of the page for easier debugging | `string` | `react-native-display-html-${Date.now()}`
style | Style of the webview component | Webview style object | `{flex: 1}`
containerStyle | Style the container wrapping the webview | View style object | `{}`
HTMLStyles | CSS style to be injected | `string` |
defaultHeight | Webview's height before it's updated | `number` | 100
additionalHeight | Add some height to the webview once it's calculated | `number` | 0
bodyClass | Add some height to the webview once it's calculated | `string` | `''`

## Tips and tricks

### Injecting javascript

Instead of sending plain strings as in React Native's core Webview component, you can now directly send functions. Just make an array of all the functions you need to inject, and `react-native-display-html` will handle the heavy-lifting by itself by stringify-ing your functions and adding closures, ez pz.

Using an array might allow you to inject javascript only on some devices that could need it with ease.

**Note : you need to write them in ES5, as they won't be transpiled !**

### Sending data from webview to react-native

You can send data by using `window.WebViewBridge.send` from the webview's javascript. You should use it in your injected code. For a demo of how it's working, check out the `heightScript` method of this component.
The best way to send objects is to stringify them and parse them back in your `onMessage` prop.

For instance, this is a great way to implement specific actions on links. We had to rewrite an old hybrid application with react-native and keep the HTML of every article which contained a lot of `data-action`. Some opening maps, articles, webviews...

We could easily add these functionalities back thanks to this component.

### Fonts

This is a bit tricky and doesn't work for now on Android < 4.4. You need the                   `allowUniversalAccessFromFileURLs` and `allowFileAccess` props to be set to `true` on your `DisplayHTML` component.
Then, in your `HTMLStyles` prop, you can declare a font with `url("/pathtoyourfont.ttf")` for iOS and `url("file:///android_asset/pathtoyourfont.ttf")` on Android.

**Note : Be sure to have your fonts inside your XCode and Android projects.**

### Debugging

You can debug your webview just as you would inspect a regular web page on iOS. Just open Safari and go to `Development/Your Device/Title of your component`.
This way, you can check your console logs you injected, or work on your HTML/CSS.

![](https://puu.sh/uVFsD/b73d6f3c49.png)

### TypeScript

This plugin ships with typescript definitions. Feel free to improve these declarations and open a pull request if you're a ts lover.

## TODO

- [ ] Use the webview from React Native's core instead of [react-native-webview-bridge](https://github.com/alinz/react-native-webview-bridge)

## Credits

Written by [Maxime Bertonnier](https://fr.linkedin.com/in/maxime-bertonnier-744351aa) at
[Archriss](http://www.archriss.com/).
