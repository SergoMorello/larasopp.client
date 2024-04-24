# Laravel websocket client

#### Server
```
https://github.com/SergoMorello/larasopp.server
```
#### Laravel package
```
composer require larasopp/larasopp
```

### Connect app to websocket

```js
...
import Larasopp from "Larasopp";

const larasopp = new Larasopp({
	host: 'ws://127.0.0.1:3001',
	token: 'token'
});

larasopp.connect();
//or
larasopp.connect('token');

```

### Update user token

```js
larasopp.setToken('new token');
```

### Subscribe on channel and listen event

```js
const listener = larasopp.subscribe('chat').listen('message',(data) => {
	console.log(data.text); // Hello World
});

// Unsubscribe event
listener.remove();
```

### Trigger event on subscribe channel

```js
larasopp.trigger('chat','message',{
	text: 'Hello World'
},'public');
```

### Unsubscribe channel

```js
larasopp.unsubscribe('chat');
```

### Disconnect

```js
larasopp.disconnect();
```

### Permissions

```js
'public' | 'protected' | 'private'
```
