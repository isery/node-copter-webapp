##node-copter-webapp

>Use smartphones, tablets or desktop to control the AR Parrot Drone 2.0 via Node.js server
>Record flights or take pictures
>Scan qr-codes through out the stream!
>Snap to flip
>Hook up and realease!
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

Some Modules need to be installed globally
```javascript
nvm use v0.8.14
	npm install -g mocha
	npm install -g grunt
	npm install -g connect
	npm install -g node-gyp
```

### Troubleshooting
If you have a problem with zombie and contextify, go to 
	xxx/node_modules/zombie/node_modules/jsdom
and here type:
	npm install contextify
because there is a dependency issue with zombie and jsdon/contextify

![drone](http://multimediatechnology.at/~fhs33718/upload/Foto.png)


