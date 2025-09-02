// imports and values
require('dotenv').config();
const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
const NEW_URL_PREFIX = process.env.URL_PREFIX || 'https://localhost:3000/';
// routers
app.get('/map_index.json', (req, res) => {
  const filePath = path.join(__dirname, 'files', 'map_index.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error at file reading');
    }
    try {
      let jsonData = JSON.parse(data);
      if (typeof jsonData.url === 'string' && jsonData.url.startsWith('https://static.resquared.studio/')) {
        jsonData.url = jsonData.url.replace('https://static.resquared.studio/', NEW_URL_PREFIX);
      }
      res.json(jsonData);
    } catch (parseErr) {
      res.status(500).send('Error at JSON parsing');
    }
  });
});
app.use('/', express.static(path.join(__dirname, 'files')));
app.use((req, res) => { res.status(404).send('404 Not Found'); });
// start app
app.listen(PORT);