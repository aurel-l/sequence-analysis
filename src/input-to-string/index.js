const { readFile } = require('fs');
const { Readable } = require('stream');

const inputToString = async input => {
  if (typeof input === 'string') {
    return new Promise((resolve, reject) => {
      // try to read a file provided as a path
      readFile(input, 'utf8', (error, data) => {
        if (error) {
          // Can't read, assume the string was a sequence
          resolve(input);
        } else if (data) {
          resolve(data);
        } else {
          reject(new Error(`No content in file "${input}"`));
        }
      });
    });
  }
  // didn't use -i or --input, try to get from stdin
  if (input instanceof Readable) {
    if (input.isTTY) {
      throw new Error('No input provided');
    }
    return new Promise(resolve => {
      const rl = require('readline').createInterface({ input });
      let output = '';
      rl.on('line', line => (output = output + '\n' + line));
      rl.on('close', () => resolve(output.trim()));
    });
  } else {
    throw new Error('Something bad happened');
  }
};

module.exports = inputToString;
