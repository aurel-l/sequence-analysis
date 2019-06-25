const { sleep } = require('timing-functions');

const customFetch = require('../../utils/custom-fetch');

const ROOT = 'https://www.ebi.ac.uk/Tools/services/rest/iprscan5';

const submit = async (sequence, email) => {
  const response = await customFetch(`${ROOT}/run`, {
    method: 'POST',
    body: new URLSearchParams({ email, sequence }),
  });
  const jobID = await response.text();

  // poll for the results
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // sleep 1 minute more or less 10 seconds
    await sleep((50 + 20 * Math.random()) * 1000);

    const statusResponse = await customFetch(`${ROOT}/status/${jobID}`);
    const status = await statusResponse.text();

    if (status === 'RUNNING') continue;

    if (status !== 'FINISHED') {
      throw new Error(
        `Something unexpected happened, received status "${status}"`,
      );
    }

    const response = await customFetch(`${ROOT}/result/${jobID}/json`);
    return response.json();
  }
};

module.exports = submit;
