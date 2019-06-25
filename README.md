<h1 align="center">Sequence analyses</h1>
<p align="center">
  <b>Extract sequences and submit them to external analysis services</b>
</p>

[![NPM version](https://img.shields.io/npm/v/sequence-analyses.svg)](https://www.npmjs.com/package/sequence-analyses)

## Description

Extract sequences from input file or from standard input.
Sends them to external services, HMMer web server, and InterProScan.
Retrieve the results and store them into a JSON file

## Installation and usage

Global installation:

```bash
npm install -g sequence-analyses
```

Usage without installation:

```bash
npx sequence-analyses
```

Usage after global installation:

```bash
sequence-analyses
```

### Options

| flag | alias          | description                                            | choices     | default  |
| ---- | -------------- | ------------------------------------------------------ | ----------- | -------- |
| -i   | --input        | Input file or string                                   | _[string]_  | `stdin`  |
| -t   | --type         | Type of input                                          | `pdb`       | `pdb`    |
|      | --email        | Email address (required by InterProScan)               | _[string]_  |          |
| -o   | --output       | Output file                                            | _[string]_  | `stdout` |
|      | --force-output | Force overwriting the output file if it already exists | _[boolean]_ | `false`  |
| -s   | --silent       | Don't output anything to stderr (no spinner)           | _[boolean]_ | `false`  |
|      | --version      | Show version number                                    |             |          |
|      | --help         | Show help                                              |             |          |
