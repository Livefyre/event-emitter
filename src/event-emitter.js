var slice = Array.prototype.slice;


/**
 * Defines the base class for all event emitting objects to extend.
 * @exports streamhub-sdk/event-emitter
 * @constructor
 */
var EventEmitter = module.exports = function() {
    this._listeners = {};
};


EventEmitter.listenerCount = function (emitter, eventName) {
    var listeners = emitter._listeners[eventName];
    if ( ! listeners) {
        return 0;
    }
    return listeners.length;
};


/**
 * Binds a listener function to an event name.
 * @param name {string} The event name to bind to.
 * @param fn {function} The callback function to call whenever the event is emitted.
 * @returns {EventEmitter} Returns 'this' for chaining
 */
EventEmitter.prototype.on = function(name, fn) {
    this._listeners[name] = this._listeners[name] || [];
    this._listeners[name].push(fn);
    return this;
};
EventEmitter.prototype.addListener = EventEmitter.prototype.on;


EventEmitter.prototype.once = function (name, fn) {
    function doAndRemoveListener () {
        this.removeListener(name, doAndRemoveListener);
        fn.apply(this, arguments);
    }
    // Store original listener
    doAndRemoveListener.listener = fn;
    return this.on(name, doAndRemoveListener);
};


/**
 * Removes a bound listener from the named event.
 * @param name {string} The name of the event to remove this listener from.
 * @param fn {function} The original callback function to remove.
 */
EventEmitter.prototype.removeListener = function(name, fn) {
    if (fn && this._listeners[name]) {
        var index = indexOf(this._listeners[name], fn);
        if (index === -1) {
            return;
        }
        this._listeners[name].splice(index, 1);
    }
};

/**
 * Remove all listeners for a given event or, if not passed, all events
 * @param [eventName] {string} event to remove listeners for, or falsy for all
 *     events
 * @returns {EventEmitter} this
 */
EventEmitter.prototype.removeAllListeners = function (eventName) {
    var eventMap = {};
    if (eventName) {
        eventMap[eventName] = this.listeners(eventName);
    } else {
        eventMap = this._listeners;
    }
    var listenersForEvent;
    var numListenersForEvent = 0;
    for (var event in eventMap) {
        if ( ! eventMap.hasOwnProperty(event)) return;
        listenersForEvent = eventMap[event].slice();
        forEach(listenersForEvent, function (listener) {
            this.removeListener(event, listener);
        }, this);
    }
    return this;
};

/**
 * Get all listeners for a given event
 * @param [eventName] {string} event to get listeners for
 * @returns {Array<Function>} the listeners for that eventName
 */
EventEmitter.prototype.listeners = function (eventName) {
    return this._listeners[eventName].slice() || [];
};

/**
 * Emits an event from the object this is called on. Iterates through bound
 * listeners and passes through the arguments emit was called with.
 * @param name {string} The name of the event to emit.
 * @param {...Object} Optional arguments to pass to each listener's callback.
 */
EventEmitter.prototype.emit = function(name) {
    var listeners = this._listeners[name] || [],
        args = slice.call(arguments, 1),
        err;

    // Copy listeners in case executing them mutates the array
    // e.g. .once() listeners remove themselves
    if (listeners.length) {
        listeners = listeners.slice();
    }

    // Throw on error event if there are no listeners
    if (name === 'error' && ! listeners.length) {
        err = args[0];
        if (err instanceof Error) {
            throw err;
        } else {
            throw TypeError('Uncaught, unspecified "error" event');
        }
    }

    for (var i=0, numListeners=listeners.length; i < numListeners; i++) {
        try {
            listeners[i].apply(this, args);
        } catch(err) {
            switch (name) {
                case 'error':
                    // @bengo: Ok so this this means that we should fired
                    // your error callback, but then THAT also threw an
                    // error. I think that node uses Domains for this
                    // http://nodejs.org/api/domain.html
                    // But I don't want to implement that now.
                    // I assume if you bothered to bind an event handler,
                    // you probably don't want any uncaught exceptions,
                    // so I'm not going to re-throw.
                    // I will fire an event for you. Tell me if this is
                    // insefficient for your needs.
                    try {
                        this.emit('errorOnError', err);
                    } catch (e) {
                        // screw you pal stop throwing exceptions in your
                        // double-ultra-super-failsafe-error callback
                        // I will throw in this case.
                        throw new Error(
                            'event-emitter: There was an exception'+
                            'in the errorInOnError listener', err, this);
                    }
                    break;
                default:
                    this.emit('error', err);
            }
        }
    }
};

/**
 * Helper for Array.prototype.indexOf since IE8 does not have it.
 * Note this does not implement a "fromIndex" param.
 * @param {Array} arr
 * @parma {*} obj
 */
function indexOf(arr, obj) {
    if (Array.prototype.indexOf) {
        return arr.indexOf(obj);
    }

    for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i] === obj) {
            return i;
        }
    }
    return -1;
}

/**
 * Array forEach
 */
function forEach(arr, callback, thisObj) {
    if (arr == null) {
        return;
    }
    var i = -1,
        len = arr.length;
    while (++i < len) {
        // we iterate over sparse items since there is no way to make it
        // work properly on IE 7-8. see #64
        if ( callback.call(thisObj, arr[i], i, arr) === false ) {
            break;
        }
    }
}
