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
			});


			describe('.removeListener(event, listener)', function () {

			});


			describe('.removeAllListeners([event])', function () {

			});


			describe('.setMaxListeners(n)', function () {

			});


			describe('.listeners(event)', function () {

			});


			describe('.emit(event, [arg1], [arg1], [...])', function () {

			});


			describe('newListener event', function () {

			});


			describe('removeListener event', function () {

			});
		});


		describe('.listenerCount(emitter, event)', function () {

		});

	});
});