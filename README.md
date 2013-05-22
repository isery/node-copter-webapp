##node-copter-webapp

>Use a mobile browser to control the AR Parrot Drone 2.0 via Node.js
>Furthermore we can scan qr-code through out the stream!
>The Project ist still under heavy development!

```javascript
npm install
npm test
npm start
```

###Collaborators
======
- Eschbacher Georg
- Hettegger Michael

###Installation
--------

Some Modules of the Testframework need to be installed globally
```javascript
nvm use v0.8.14
	npm install -g mocha
	npm install -g grunt
	npm install -g connect
	npm install -g node-gyp
```
	
After finishing to install those global modules, in order to get node-canvas
(which we use to decode qr-codes in livestream) to work, you need to have 
http://cairographics.org/download/ installed; for further installation-information
visit their page
http://cairographics.org/download/ - automatic! [Cairographics](http://cairographics.org/download/)


### Troubleshooting
If you have a problem with zombie and contextify, go to 
	xxx/node_modules/zombie/node_modules/jsdom
and here type:
	npm install contextify
because there is a dependency issue with zombie and jsdon/contextify

![drone](http://multimediatechnology.at/~fhs33718/upload/Foto.png)


