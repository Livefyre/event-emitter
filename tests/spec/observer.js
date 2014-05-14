define(['jasmine', 'observer', 'event-emitter'], function (jasmine, Observer, EventEmitter) {
    describe('observer', function () {
        it ('is a function', function () {
            expect(Observer).toEqual(jasmine.any(Function));
        });

        describe('mixed in', function () {
            var eventEmitter;
            var observer;
            beforeEach(function () {
                eventEmitter = new EventEmitter();
                observer = Observer({});
            });

            it('can listen to an event', function () {
                var spy = jasmine.createSpy();
                observer.listenTo(eventEmitter, 'batman', spy);
                eventEmitter.emit('batman');
                expect(spy).toHaveBeenCalled();
            });

            it('can stop listening to events', function () {
                var spy = jasmine.createSpy();
                observer.listenTo(eventEmitter, 'batman', spy);
                observer.stopListening();
                eventEmitter.emit('batman');
                expect(spy).not.toHaveBeenCalled();
            });

            it('can stop listening to events on a particular object', function () {
                var spy = jasmine.createSpy();
                var anotherSpy = jasmine.createSpy();
                var anotherEventEmitter = new EventEmitter();
                observer.listenTo(eventEmitter, 'batman', spy);
                observer.listenTo(anotherEventEmitter, 'batman', anotherSpy);
                observer.stopListening(anotherEventEmitter);
                eventEmitter.emit('batman');
                anotherEventEmitter.emit('batman');
                expect(spy).toHaveBeenCalled();
                expect(anotherSpy).not.toHaveBeenCalled();
            });
        });
    });
});
