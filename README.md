<h1>Event.Emitter</h1>

##	Easy EventEmitter

### Install
```
npm i easy-event-emitter
```

### Create isolated emitter
```
import EventEmitter from "easy-event-emitter";

const events = new EventEmitter();
```

### Global
```
const events = new EventEmitter(true);
```

### Methods

```
addListener(event name, callback); //return {remove()}
```

```
emit(event name, data); //return void
```

```
removeAllListeners(); //return void
```

### Examples

#### Isolated
```
const events1 = new EventEmitter();
const events2 = new EventEmitter();

events1.addListener('test', (val) => {
	console.log(val); //hello
});

const listener = events2.addListener('test', (val) => {
	console.log(val); //world
});

events2.addListener('test2', (val) => {
	console.log(val); //hi :-)
});

events1.emit('test', 'hello');
events2.emit('test', 'world');
events2.emit('test2', 'hi :-)');

listener.remove(); //Remove current listener

events2.removeAllListeners(); //Remove all listeners in current instance
```

#### Groups
```
const events1 = new EventEmitter('test_group');
const events2 = new EventEmitter('test_group');

events1.addListener('test', (val) => {
	console.log(val); //"hello" replace "world"
});

events2.addListener('test', (val) => {
	console.log(val); //"hello" replace "world"
});

events1.emit('test', 'hello');
events2.emit('test', 'world');
```

#### Global
```
const events = new EventEmitter(true);
events.addListener('test', (val) => {
	console.log(val); //"hello" replace "world"
});

const listener = EventEmitter.addListener('test', (val) => {
	console.log(val); //"hello" replace "world"
});

events.emit('test', 'hello');
EventEmitter.emit('test', 'world');

listener.remove(); //Remove current global listener

events.removeAllListeners(); //Remove all global listeners
//Or
EventEmitter.removeAllListeners();
```