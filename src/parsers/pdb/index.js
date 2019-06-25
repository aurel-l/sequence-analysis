// REFERENCE: https://www.cgl.ucsf.edu/chimera/docs/UsersGuide/tutorials/pdbintro.html
const ATOM_LINE = /^ATOM\s{2}(?<atomSerialNumber>[\d ]{5})\s{1}(?<atomName>.{4})(?<alternameLocation>.)(?<residueName>.{4})(?<chainIdentifier>.)(?<residueSequenceNumber>[\d ]{4})/gim;

const AA_MAP = new Map([
  ['ALA', 'A'],
  ['ARG', 'R'],
  ['ASN', 'N'],
  ['ASP', 'D'],
  ['CYS', 'C'],
  ['GLN', 'Q'],
  ['GLU', 'E'],
  ['GLY', 'G'],
  ['HIS', 'H'],
  ['ILE', 'I'],
  ['LEU', 'L'],
  ['LYS', 'K'],
  ['MET', 'M'],
  ['PHE', 'F'],
  ['PRO', 'P'],
  ['SER', 'S'],
  ['THR', 'T'],
  ['TRP', 'W'],
  ['TYR', 'Y'],
  ['VAL', 'V'],
  //
  ['SEC', 'U'],
  ['PYL', 'O'],
  //
  ['ASX', 'B'],
  ['GLX', 'Z'],
  ['XLE', 'J'],
]);

const parser = input => {
  const residues = new Set();
  const sequences = new Map();

  for (const line of input.split('\n')) {
    const match = ATOM_LINE.exec(line);

    if (!match) continue;

    const {
      residueName,
      chainIdentifier,
      residueSequenceNumber,
    } = match.groups;

    if (!chainIdentifier.trim()) continue;
    if (residues.has(residueSequenceNumber)) continue;

    residues.add(residueSequenceNumber);
    sequences.set(
      chainIdentifier,
      (sequences.get(chainIdentifier) || '') +
        (AA_MAP.get(residueName.trim().toUpperCase()) || 'X'),
    );
  }

  for (const [chain, sequence] of sequences.entries()) {
    if (sequence === 'X') sequences.delete(chain);
  }

  return sequences;
};

module.exports = parser;
