# @dx-libs/queue <sub><sup><sub><sup>v0.1.0</sup></sub></sup></sub>
~~~
Otra simple cola de tareas
~~~

## Scripts
```powershell
npm run eslint
```
```powershell
npm run test-watch
```
```powershell
npm run test
```
```powershell
npm run sonar
```

## Instalación

### Como libreria
```powershell
npm install --save @dx-libs/queue
```

## Modo de uso

```javascript
const timeout = require('@dx-libs/timeout');
const Queue = require("@dx-libs/queue");

const queue = Queue.from("Hola mundo");
queue
    .timeout(10000)
    .task(async (c) => await timeout(() => c.toUpperCase(), 250))
    .on('items', (items, arr) => {
        console.log('Items:',items.length, ' Arr:', arr.length);
    })
    .run(3)
    .then(result => {
        console.log('result:', result.join(''));
    })
    .catch(error => console.error(error));
```
---
