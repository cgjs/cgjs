const cluster = require('../index');

if (cluster.isMaster) {
  console.log('master');
  const worker = cluster.fork();
  worker
    .on('message', console.log)
    .on('online', () => {
      console.log('online');
      setTimeout(() => worker.disconnect(), 1000);
    })
    .on('disconnect', () => {
      console.log('disconnect');
    });
  worker.send('it works!');
} else if (cluster.isWorker) {
  process.on('message', console.log);
  process.send('Hello');
  setTimeout(() => console.log('worker'), 100);
  setTimeout(() => process.send('World'), 300);
  setTimeout(() => console.log('fuck'), 2000);
}