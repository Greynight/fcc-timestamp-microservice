'use strict';

const express = require('express');
const app = express();

app.get('/:timestring', (req, res) => {
  const timestring = req.params.timestring;
  const unix = +timestring;
  
  let timestamp = {
    unix: null,
    natural: null
  };
  
  if (!isNaN(unix)) {
    const dateObj = new Date(unix*1000);
    const locale = "en-us";
    const month = dateObj.toLocaleString(locale, { month: "long" });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    
    timestamp.unix = timestring;
    timestamp.natural = `${month} ${day}, ${year}`;
  } else if (new Date(timestring) !== 'Invalid Date') {
    const dateObj = new Date(timestring);
    
    timestamp.natural = timestring;
    timestamp.unix = dateObj.getTime() / 1000;
  }

  res.json(timestamp);
});

// Respond not found to all the wrong routes
app.use((req, res, next) => {
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use((err, req, res, next) => {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, () => {
  console.log('Node.js listening ...');
});