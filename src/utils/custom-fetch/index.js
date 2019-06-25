const fetch = require('node-fetch');
const { sleep } = require('timing-functions');

const MAX_RETRIES = 3;

// 30 seconds more or less 10 seconds
const GET_WAIT_TIME = () => (20 + 20 * Math.random()) * 1000;

// custom fetch logic
// fails if response is not ok
// retries multiple times before actually throwing
const customFetch = async (...args) => {
  let tries = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const response = await fetch(...args);

      if (!response.ok) throw new Error(response.statusText);

      return response;
    } catch (error) {
      // just in case anything bad happens, catch it
      tries += 1;

      // OK, if we've tried enough, just rethrow the error and stop there
      if (tries >= MAX_RETRIES) throw error;

      // otherwise, wait a bit before retrying
      await sleep(GET_WAIT_TIME());
    }
  }
};

module.exports = customFetch;
