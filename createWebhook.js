const fetch = require('node-fetch');
require('dotenv').config();

fetch(
  `https://api.trello.com/1/webhooks/?key=${process.env.TRELLO_KEY}&token=${process.env.TRELLO_SERVER_TOKEN}&callbackURL=${process.env.CALLBACK_URL}&idModel=${process.env.ID_MODEL}`,
  {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  }
)
  .then((response) => {
    console.log(`Response: ${response.status} ${response.statusText}`);
    return response.text();
  })
  .then((text) => console.log(text))
  .catch((err) => console.error(err));
