# Laravel websocket client

### Connect app to websocket
```js
...
import Larasopp from "Larasopp";

const larasopp = new Larasopp({
	host: '127.0.0.1:9002',
	token: 'token'
});

larasopp.connect();

export default larasopp;

```

### Subscribe on channel and bind event
```js
const listener = larasopp.subscribe('chat').bind('message',(data) => {
	console.log(data.text); // Hello World
});

// Unsubscribe
listener.remove();
```

### Trigger event on subscribe channel

```js
larasopp.trigger('chat','message',{
	text: 'Hello World'
},'public');
```

### Disconnect
```js
larasopp.disconnect();
```

### Permissions

```js
'public' | 'protected' | 'private'
```