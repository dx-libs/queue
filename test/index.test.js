const Queue = require('../src');
const timeout = require('@dx-libs/timeout');
const sinon = require('sinon');

const queue = Queue.from('Hola Mundo'.split(''));
test('dx-libs/queue', async () => {

    expect(queue).toBeInstanceOf(Queue);
});

test('dx-libs/queue timeout', async () => {
    const thenSpy = sinon.spy();
    const catchSpy = sinon.spy();

    await queue
        .timeout(1000)
        .task(async () => await timeout(2000))
        .run(2)
        .then(thenSpy)
        .catch(catchSpy);

    expect(thenSpy.called).not.toBe(true);
    expect(catchSpy.called).toBe(true);
});

test('dx-libs/queue limit', async () => {
    const taskSpy = sinon.spy();
    const queue = Queue.from([1, 2, 3, 4, 5]);

    await queue.limit(3).task(async () => taskSpy()).run(1);

    expect(taskSpy.callCount).toBe(3);
});

// queue
//     .timeout(10000)
//     .task(async (c) => await timeout(() => String.fromCharCode(c.charCodeAt(0) + 1), 250))
//     .on('items', (items, arr) => {
//         console.log('Items:',items.length, ' Arr:', arr.length);
//     })
//     .run(3)
//     .then(result => {
//         console.log('result:', result.join(''));
//     })
//     .catch(error => console.error(error));