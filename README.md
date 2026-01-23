# Larasopp Client

WebSocket client for Laravel with full TypeScript support and type safety.

## Features

- 🔌 **WebSocket Connection** - Real-time bidirectional communication
- 🎯 **Full TypeScript Support** - Complete type safety for channels, events, and users
- 📡 **Channel Subscriptions** - Subscribe to multiple channels
- 🎧 **Event Listeners** - Listen to specific events with typed callbacks
- 👥 **Presence Channels** - Track users joining/leaving channels
- 🔐 **Authentication** - Token-based authentication
- 🔄 **Auto Reconnect** - Automatic reconnection with configurable delays
- ✅ **Type Safety** - Compile-time type checking for all operations

## Installation

```bash
npm install larasopp
# or
yarn add larasopp
# or
pnpm add larasopp
```

## Related Packages

- **Server**: [larasopp-server](https://www.npmjs.com/package/larasopp-server)
- **Laravel Package**: `composer require larasopp/larasopp`

## Quick Start

```typescript
import Larasopp from 'larasopp';

const larasopp = new Larasopp({
  host: 'ws://127.0.0.1:3001',
  token: 'your-auth-token'
});

larasopp.connect();
```

## TypeScript Support

Larasopp provides full TypeScript support with generic types for channels, events, and users.

### Defining Types

```typescript
// Define your channel events structure
type ChannelsEvents = {
  chat: {
    message: { text: string; author: string; timestamp: number };
    typing: { user: string };
    userJoined: { user: string };
  };
  notifications: {
    alert: { title: string; body: string; type: 'info' | 'warning' | 'error' };
    update: { version: string };
  };
};

// Define your user type
interface MyUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

// Create typed instance
const larasopp = new Larasopp<ChannelsEvents, MyUser>({
  host: 'ws://127.0.0.1:3001',
  token: 'your-token'
});
```

## API Reference

### Configuration

```typescript
interface IConfig {
  host: string;                    // WebSocket server URL
  token?: string;                  // Authentication token
  reviver?: (key: string, value: any) => any;  // JSON reviver function
  dataReviver?: { [key: string]: (value: any) => any };  // Per-key revivers
  reconnect?: number;              // Max reconnection attempts
  reconnectDelay?: number;         // Delay between reconnections (ms)
}
```

### Connection

#### `connect(token?: string)`

Connect to the WebSocket server.

```typescript
larasopp.connect();
// or with token
larasopp.connect('new-token');
```

#### `disconnect()`

Disconnect from the WebSocket server.

```typescript
larasopp.disconnect();
```

#### `setToken(token: string)`

Update authentication token.

```typescript
larasopp.setToken('new-token');
```

### Channels

#### `subscribe<K>(channel: K): Listener`

Subscribe to a channel. Returns a `Listener` instance for the channel.

```typescript
// TypeScript will enforce that 'chat' exists in ChannelsEvents
const listener = larasopp.subscribe('chat');
```

#### `unsubscribe<K>(channel: K)`

Unsubscribe from a channel.

```typescript
larasopp.unsubscribe('chat');
```

#### `countListeners<K>(channel: K): number`

Get the number of listeners for a channel.

```typescript
const count = larasopp.countListeners('chat');
```

### Events

#### `listen<K>(event: K, callback, withCache?: boolean): this`

Listen to a specific event on the subscribed channel.

```typescript
const listener = larasopp.subscribe('chat');

// TypeScript knows 'message' exists and its data type
listener.listen('message', (data) => {
  // data is typed as { text: string; author: string; timestamp: number }
  console.log(data.text, data.author);
});

// withCache: true will call callback immediately if cached data exists
listener.listen('typing', (data) => {
  console.log(data.user, 'is typing');
}, true);
```

#### `trigger<K, E>(channel: K, event: E, message, permission?, waitSubscribe?): void`

Trigger an event on a channel.

**Permission Levels:**

- **`'public'`** - Event will be sent to all channel subscribers AND to the API application
- **`'protected'`** - Event will be sent to all channel subscribers but NOT to the API application
- **`'private'`** - Event will be sent ONLY to the API application, not to channel subscribers

```typescript
// TypeScript ensures 'chat' channel and 'message' event exist
// and that the message matches the event type

// Public: sent to all subscribers and API
larasopp.trigger('chat', 'message', {
  text: 'Hello World',
  author: 'John Doe',
  timestamp: Date.now()
}, 'public');

// Protected: sent to subscribers only, not to API
larasopp.trigger('chat', 'message', {
  text: 'User message',
  author: 'Jane Doe',
  timestamp: Date.now()
}, 'protected');

// Private: sent to API only, not to subscribers
larasopp.trigger('chat', 'message', {
  text: 'Admin notification',
  author: 'System',
  timestamp: Date.now()
}, 'private', true); // waitSubscribe: true waits for subscription
```

### Event Permissions

When triggering events, you can specify one of three permission levels:

| Permission | Channel Subscribers | API Application | Use Case |
|------------|---------------------|-----------------|----------|
| `'public'` | ✅ Yes | ✅ Yes | Broadcast to everyone including server-side processing |
| `'protected'` | ✅ Yes | ❌ No | Client-to-client communication without server handling |
| `'private'` | ❌ No | ✅ Yes | Server-side only events (notifications, admin actions) |

**Examples:**

```typescript
// Public: Broadcast message to all users and process on server
larasopp.trigger('chat', 'message', {
  text: 'Hello everyone!',
  author: 'John'
}, 'public');

// Protected: Send to users but don't trigger server-side handlers
larasopp.trigger('chat', 'typing', {
  user: 'John'
}, 'protected');

// Private: Server-side only (e.g., admin notifications, system events)
larasopp.trigger('notifications', 'alert', {
  title: 'System Maintenance',
  body: 'Scheduled maintenance in 5 minutes'
}, 'private');
```

### Presence Channels

#### `here(callback, withCache?: boolean): this`

Get list of users currently in the channel.

```typescript
listener.here((users) => {
  // users is typed as MyUser[]
  users.forEach(user => {
    console.log(user.name, 'is here');
  });
});
```

#### `joining(callback, withCache?: boolean): this`

Listen for users joining the channel.

```typescript
listener.joining((user) => {
  // user is typed as MyUser
  console.log(user.name, 'joined');
});
```

#### `leaving(callback, withCache?: boolean): this`

Listen for users leaving the channel.

```typescript
listener.leaving((user) => {
  // user is typed as MyUser
  console.log(user.name, 'left');
});
```

### User Management

#### `user(callback): void`

Get current authenticated user.

```typescript
larasopp.user((user) => {
  // user is typed as MyUser
  console.log('Current user:', user.name);
});
```

#### `userRefresh(callback): void`

Refresh current user data.

```typescript
larasopp.userRefresh((user) => {
  // user is typed as MyUser
  console.log('Refreshed user:', user);
});
```

### Socket Events

#### `addListener(event, callback): EventListener | undefined`

Listen to socket-level events: `'open'`, `'close'`, `'error'`.

```typescript
larasopp.addListener('open', () => {
  console.log('Connected to WebSocket');
});

larasopp.addListener('close', () => {
  console.log('Disconnected from WebSocket');
});

larasopp.addListener('error', (error) => {
  console.error('WebSocket error:', error);
});
```

### Listener Management

#### `remove()`

Remove all event listeners from a channel subscription.

```typescript
const listener = larasopp.subscribe('chat');
listener.listen('message', handleMessage);

// Later, remove all listeners
listener.remove();
```

#### `unsubscribe()`

Unsubscribe from the channel and remove all listeners.

```typescript
listener.unsubscribe();
```

## Complete Example

```typescript
import Larasopp from 'larasopp';

// Define types
type AppChannels = {
  chat: {
    message: { text: string; author: string };
    typing: { user: string };
  };
  notifications: {
    alert: { title: string; body: string };
  };
};

interface AppUser {
  id: number;
  name: string;
  email: string;
}

// Create instance
const larasopp = new Larasopp<AppChannels, AppUser>({
  host: 'ws://127.0.0.1:3001',
  token: 'auth-token',
  reconnect: 5,
  reconnectDelay: 1000
});

// Connect
larasopp.connect();

// Listen to connection events
larasopp.addListener('open', () => {
  console.log('Connected');
});

// Subscribe to channel
const chatListener = larasopp.subscribe('chat');

// Listen to events with full type safety
chatListener.listen('message', (data) => {
  // TypeScript knows data structure
  console.log(`${data.author}: ${data.text}`);
});

chatListener.listen('typing', (data) => {
  console.log(`${data.user} is typing...`);
});

// Presence channel features
chatListener.here((users) => {
  console.log('Users in channel:', users.map(u => u.name));
});

chatListener.joining((user) => {
  console.log(`${user.name} joined`);
});

chatListener.leaving((user) => {
  console.log(`${user.name} left`);
});

// Trigger events
larasopp.trigger('chat', 'message', {
  text: 'Hello!',
  author: 'John'
}, 'public');

// Get current user
larasopp.user((user) => {
  console.log('Logged in as:', user.name);
});

// Cleanup
chatListener.remove();
larasopp.unsubscribe('chat');
larasopp.disconnect();
```

## Type Safety Benefits

With TypeScript support, you get:

- ✅ **Compile-time checks** - Catch errors before runtime
- ✅ **Autocomplete** - IDE suggests available channels and events
- ✅ **Type inference** - Automatic type detection for callbacks
- ✅ **Refactoring safety** - Rename channels/events with confidence
- ✅ **Documentation** - Types serve as inline documentation

## License

MIT

## Author

Sergey Serov

## Links

- [GitHub Repository](https://github.com/SergoMorello/larasopp.client)
- [NPM Package](https://www.npmjs.com/package/larasopp)
- [Server Package](https://www.npmjs.com/package/larasopp-server)
