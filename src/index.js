const { createWriteStream } = require('fs');
const { Writable } = require('stream');

const ora = require('ora');

const inputToString = require('./input-to-string');
const submitToHmmer = require('./services/hmmer');
const submitToInterProScan = require('./services/interproscan');

const MIN_SEQUENCE_SIZE = 11;

const main = async ({ input, type, email, output, forceOutput }) => {
  // retrieve input as string
  const inputString = await inputToString(input);

  const outputWriter =
    output instanceof Writable
      ? output
      : createWriteStream(output, { flags: forceOutput ? 'w+' : 'wx' });

  let parser;
  try {
    parser = require(`./parsers/${type.toLowerCase()}`);
  } catch (error) {
    throw new Error(`${type} is not an existing parser`);
  }

  const sequences = parser(inputString);

  const hmmerJobs = [];
  const interProScanJobs = [];

  // output object, will be mutated inside the different promises
  const outputObj = {};

  // for each of the sequences
  for (const [name, sequence] of sequences) {
    // store the sequence
    const oneOutput = (outputObj[name] = { sequence });
    // if the sequence is too small to analyse, skip
    if (sequence.length < MIN_SEQUENCE_SIZE) continue;
    // submit to HMMer
    hmmerJobs.push(
      submitToHmmer(sequence).then(result => (oneOutput.hmmer = result)),
    );
    // submit to InterProScan
    interProScanJobs.push(
      submitToInterProScan(sequence, email).then(
        result => (oneOutput.interproscan = result),
      ),
    );
  }

  const spinner = ora(
    `Found ${sequences.size} sequences, sending for analysis`,
  ).start();

  const allJobs = [...hmmerJobs, ...interProScanJobs];
  allJobs.forEach(job =>
    job.then(() => {
      spinner.text = `Found ${sequences.size} sequences, got ${
        Object.values(outputObj).filter(({ hmmer }) => hmmer).length
      } results out of ${hmmerJobs.length} from HMMer, and ${
        Object.values(outputObj).filter(({ interproscan }) => interproscan)
          .length
      } results out of ${interProScanJobs.length} from InterProScan`;
    }),
  );

  // wait for all the promises/jobs to finish
  await Promise.all(allJobs).then(
    () => spinner.succeed(),
    error => spinner.fail(error),
  );

  // return mutated output
  outputWriter.write(JSON.stringify(outputObj, null, 2));
};

module.exports = main;
