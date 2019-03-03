const express = require('express');

const app = express();

app.enable("trust proxy");

app.get('/', (req, res) => {
  res.send('Hello Express app!');
});

app.listen(process.env.PORT || 8080, () => {
  console.log('server started');
});
