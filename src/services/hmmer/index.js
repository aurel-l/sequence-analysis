const { sleep } = require('timing-functions');

const customFetch = require('../../utils/custom-fetch');

const ROOT = 'https://www.ebi.ac.uk/Tools/hmmer/';

const headers = { Accept: 'application/json' };

const submit = async sequence => {
  const response = await customFetch(`${ROOT}/search/phmmer`, {
    method: 'POST',
    headers,
    body: new URLSearchParams({ seqdb: 'pdb', seq: sequence }),
  });
  const { uuid, ...payload } = await response.json();

  // no uuid was assigned, it means that the job was interactive
  if (!uuid) return payload;

  // if we got a uuid, it means the service switched to batch mode
  // so we're gonna poll for the results
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // sleep 1 minute more or less 10 seconds
    await sleep((50 + 20 * Math.random()) * 1000);

    const response = await customFetch(`${ROOT}/results/${uuid}`, { headers });
    const { status, ...payload } = await response.json();

    if (status === 'DONE') return payload;
  }
};

module.exports = submit;
