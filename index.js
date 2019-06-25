#!/usr/bin/env node
const process = require('process');

const yargs = require('yargs');
const updateNotifier = require('update-notifier');

const pkg = require('./package.json');

updateNotifier({ pkg }).notify();

const main = require('./src');

const argv = yargs
  .option('i', {
    alias: 'input',
    default: 'stdin',
    description: 'Input file or string',
    type: 'string',
    coerce: value => (value === 'stdin' ? process.stdin : value),
  })
  .option('t', {
    alias: 'type',
    default: 'pdb',
    description: 'Type of input',
    choices: ['pdb'],
  })
  .option('email', {
    description: 'Email address (required by InterProScan)',
    type: 'string',
    coerce: string => {
      if (
        !string.includes('@') ||
        string.toLowerCase().endsWith('example.com')
      ) {
        throw new Error('Invalid email');
      }
      return string;
    },
  })
  .option('o', {
    alias: 'output',
    default: 'stdout',
    description: 'Output file',
    type: 'string',
    coerce: value => (value === 'stdout' ? process.stdout : value),
  })
  .option('force-output', {
    default: false,
    description: 'Force overwriting the output file if it already exists',
    type: 'boolean',
  })
  .option('s', {
    alias: 'silent',
    default: false,
    description: "Don't output anything to stderr (no spinner)",
  })
  .demandOption(
    'email',
    'Please provide a contact email, it is required by InterProScan',
  )
  .help().argv;

main(argv).catch(console.error);
