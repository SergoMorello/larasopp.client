import EventEmitter from "easy-event-emitter";

export default class Larasopp {
	static #token;
	static #host;
	static #socket;
	static #status = false;
	static #events = new EventEmitter;
	static #stepReconnect = 0;

	static connect(params) {
		Larasopp.#host = params.host ?? '127.0.0.1';
		Larasopp.#token = params.token ?? '0';
		const onOpen = params.onOpen ?? (()=>{});
		const onClose = params.onClose ?? (()=>{});

		if (Larasopp.#status) {
			return;
		}
		Larasopp.#socket = new WebSocket(Larasopp.#host + '/token=' + Larasopp.#token);

		Larasopp.#socket.onopen = function(event) {
			Larasopp.#stepReconnect = 0;
			Larasopp.#status = true;
			Larasopp.#events.emit("open", event);
			onOpen(event);
		};

		Larasopp.#socket.onclose = function(event) {
			if (event.wasClean) {
				console.log('Соединение закрыто чисто');
			} else {
				if (Larasopp.#stepReconnect >= 5) {
					console.log('connect error');
				}else{
					setTimeout(() => {
						console.log('try reconnect...');
						Larasopp.connect(params);
						++Larasopp.#stepReconnect;
					}, 3000);
				}
			}
			Larasopp.#status = false;
			Larasopp.#events.emit("close", event);
			onClose(event);
		};

		Larasopp.#socket.onmessage = function(event) {
			if (Larasopp.#_isJsonString(event.data)) {
				const json = JSON.parse(event.data);
				
				Larasopp.#events.emit(json.channel + ':' + json.event, json.message);
			}
		};

		Larasopp.#socket.onerror = function(error) {
			Larasopp.#events.emit("error", error);
		};
	}

	static disconnect() {
		Larasopp.#socket.close();
	}

	static #_isJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	static subscribe(channel) {
		if (Larasopp.#status) {
			Larasopp.send({
				subscribe: channel
			});
		}else{
			const event = Larasopp.#events.addListener('open',() => {
				Larasopp.send({
					subscribe: channel
				});
				event.remove();
			});
		}
		
		return {
			bind: (event, callback) => {
				const retEvent = Larasopp.#events.addListener(channel + ':' + event, callback);
				return {
					remove: () => {
						Larasopp.send({
							unsubscribe: channel
						});
						retEvent.remove();
					}
				}
			},
			remove: () => {
				Larasopp.send({
					unsubscribe: channel
				});
			}
		}
	}

	static trigger(channel, event, message, access) {
		Larasopp.send({
			channel: channel,
			event: event,
			message: message,
			type: access ?? 'public'
		});
	}

	static send(message, json) {
		json = json ?? true;
		if (!Larasopp.#status) {
			return;
		}
		Larasopp.#socket.send(json ? JSON.stringify(message) : message);
	}
}