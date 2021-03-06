define(['jasmine', 'event-emitter'], function (jasmine, EventEmitter) {
	describe('event-emitter', function () {
		it ('is a function', function () {
			expect(EventEmitter).toEqual(jasmine.any(Function));
		});


		describe('instance', function () {
			var ee;
			beforeEach(function () {
				ee = new EventEmitter();
			});


			it('is instanceof EventEmitter', function () {
				expect(ee instanceof EventEmitter).toBe(true);
			});


			describe('.addListener(event, listener)', function () {
				it('is .on', function () {
					expect(ee.on).toBe(ee.addListener);
				});
			});
			describe('.on(event, listener)', function () {
				it('causes all listeners to be fired each time event is emitted', function () {
					var onEvent1 = jasmine.createSpy('onEvent1'),
						onEvent2 = jasmine.createSpy('onEvent2');
					ee.on('event', onEvent1);
					ee.on('event', onEvent2);
					ee.emit('event');
					ee.emit('event');
					expect(onEvent1.callCount).toBe(2);
					expect(onEvent2.callCount).toBe(2);
				});
				it('returns this', function () {
					expect(ee.on('a', function () {})).toEqual(ee);
				});
			});


			describe('.once(event, listener)', function () {
				it('is a method', function () {
					expect(ee.once).toEqual(jasmine.any(Function));
				});
				it('causes the listener to only be called the next time event fires', function () {
					var onEvent = jasmine.createSpy('onEvent');
					ee.once('event', onEvent);
					ee.emit('event');
					ee.emit('event');
					expect(onEvent.callCount).toBe(1);
				});
				it('returns this', function () {
					expect(ee.once('a', function () {})).toEqual(ee);
				});
				it('fires all listeners if there are multiple', function () {
					var onEvent1 = jasmine.createSpy('onEvent1');
					var onEvent2 = jasmine.createSpy('onEvent2');
					ee.once('event', onEvent1);
					ee.once('event', onEvent2);
					ee.emit('event', 1);
					ee.emit('event', 2);
					expect(onEvent1.callCount).toBe(1);
					expect(onEvent2.callCount).toBe(1);
				});
			});


			describe('.removeListener(event, listener)', function () {
				it('removes an event listener', function () {
					var func = function () {};
					ee.on('cat', func);
					expect(ee._listeners.cat.length).toBe(1);
					ee.removeListener('cat', func);
					expect(ee._listeners.cat.length).toBe(0);
				});
				it('does not remove a listener if there is no bound function', function () {
					ee.on('cat', function () {});
					expect(ee._listeners.cat.length).toBe(1);
					ee.removeListener('cat', function () {});
					expect(ee._listeners.cat.length).toBe(1);
				});
			});


			describe('.removeAllListeners([event])', function () {
				it('removes all listeners when not passed an arg', function () {
					var ee = new EventEmitter();

					var aSpy1 = jasmine.createSpy();
					var aSpy2 = jasmine.createSpy();
					ee.on('a', aSpy1);
					ee.on('a', aSpy2);
					var bSpy = jasmine.createSpy();
					ee.on('b', bSpy);

					ee.removeAllListeners();

					expect(EventEmitter.listenerCount(ee, 'a')).toBe(0);
					expect(EventEmitter.listenerCount(ee, 'b')).toBe(0);
					ee.emit('a');
					ee.emit('b');
					expect(aSpy1.callCount).toBe(0);
					expect(aSpy2.callCount).toBe(0);
					expect(bSpy.callCount).toBe(0);
				});
				it('removes only listeners of right event if passed an eventName', function () {
					var ee = new EventEmitter();

					var aSpy1 = jasmine.createSpy();
					var aSpy2 = jasmine.createSpy();
					ee.on('a', aSpy1);
					ee.on('a', aSpy2);
					var bSpy = jasmine.createSpy();
					ee.on('b', bSpy);

					ee.removeAllListeners('a');

					expect(EventEmitter.listenerCount(ee, 'a')).toBe(0);
					expect(EventEmitter.listenerCount(ee, 'b')).toBe(1);
					ee.emit('a');
					ee.emit('b');
					expect(aSpy1.callCount).toBe(0);
					expect(aSpy2.callCount).toBe(0);
					expect(bSpy.callCount).toBe(1);
				});
				it('returns this', function () {
					var ee = new EventEmitter();
					expect(ee.removeAllListeners()).toEqual(ee);
				});
			});


			describe('.setMaxListeners(n)', function () {

			});


			describe('.listeners(event)', function () {

			});


			describe('.emit(event, [arg1], [arg1], [...])', function () {
				it('throws an Error on emit("error") if there are no error listeners', function () {
					expect(function () {
						ee.emit('error');
					}).toThrow();
				});
				it('throws err on emit("error", err) if there are no error listeners', function () {
					var err = new Error();
					expect(function () {
						ee.emit('error', err);
					}).toThrow(err);
				});
				it('what if your error handler throws an error? Emit errorOnError', function () {
					var err = new Error();
					var didError;
					var didErrorOnError;

					runs(function () {
						ee.on('errorOnError', function () {
							didErrorOnError = true;
						})
						ee.on('error', function () {
							didError = true;
							throw err;
						});
						ee.emit('error');
					});

					waitsFor(function () {
						return didError && didErrorOnError;
					});
				});
			});


			describe('newListener event', function () {

			});


			describe('removeListener event', function () {

			});
		});


		describe('.listenerCount(emitter, event)', function () {
			it('is a static method on EventEmitter', function () {
				expect(EventEmitter.listenerCount).toEqual(jasmine.any(Function));
			});
			it('returns the number of listeners for an event', function () {
				var ee = new EventEmitter(),
					eventName = 'error';
				ee.on(eventName, function () {});
				ee.on(eventName, function () {});
				expect(EventEmitter.listenerCount(ee, eventName)).toBe(2);
			})
		});

	});
});
