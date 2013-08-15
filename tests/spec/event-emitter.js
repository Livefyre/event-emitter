define(['jasmine', 'event-emitter'], function (jasmine, EventEmitter) {
	describe('event-emitter', function () {
		it ('is a function', function () {
			expect(EventEmitter).toEqual(jasmine.any(Function));
		});
		describe('when constructed', function () {
			var ee;
			beforeEach(function () {
				ee = new EventEmitter();
			});
			it('is instanceof EventEmitter', function () {
				expect(ee instanceof EventEmitter).toBe(true);
			});
		});
	});
});