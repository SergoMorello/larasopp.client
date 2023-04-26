# Laravel websocket client

### Connect app to websocket
```js
...
import Larasopp from "Larasopp";

const App = () => {
	...
	useEffect(() => {
		Larasopp.connect({
			token: 'user token',
			host: 'ws://127.0.0.1:9002'
		});
	});
	...

```

### Subscribe on channel and bind event
```js
const channel = Larasopp.subscribe('channel-1');
channel.bind('message', function(data) {
	console.log(data);
});

// Unsubscribe
channel.remove();
```

### Trigger event on subscribe channel

```js
Larasopp.trigger('channel-1', 'message', {
	test: "hello world"
},'public');
```