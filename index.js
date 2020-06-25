/*

build the esn source tree.

Usage: node index.js [name of the source tree to geenrate]

Valid names are:

- common-libs
- inbox
- calendar
- contacts
- account
- admin
- videoconference


*/

const commandLineArgs = require('command-line-args');
const builder = require('./builder');
const SpaBuilder = require('./spa-builder');
const CONSTANTS = require('./constants');

const VALID_PACKAGES = [
  'common-libs',
  'inbox',
  'calendar',
  'contacts',
  'account',
  'admin',
  'videoconference'
];
const PACKAGE_PREFIX='esn-frontend-';

const cmdOptions = [
  { name: 'target', alias: 't', defaultValue: 'common-libs', defaultOption: true }
];

const args = commandLineArgs(cmdOptions);

if (!VALID_PACKAGES.includes(args.target)) {
  console.log('invalid target', args.target);
  console.log('valid targets are', VALID_PACKAGES.join(', '));
  process.exit(1);
}

const moduleName = `${PACKAGE_PREFIX}${args.target}`;

if (args.target === 'common-libs') {
  console.log('Building', moduleName);
  builder();
} else if (args.target === 'account') {
  const spaBuilder = new SpaBuilder(CONSTANTS.spa.account);
  spaBuilder.build();
} else if (args.target === 'inbox') {
  const spaBuilder = new SpaBuilder(CONSTANTS.spa.inbox);
  spaBuilder.build();
} else if (args.target === 'contacts') {
  const spaBuilder = new SpaBuilder(CONSTANTS.spa.contacts);
  spaBuilder.build();

} else if (args.target === 'calendar') {
  const spaBuilder = new SpaBuilder(CONSTANTS.spa.calendar);
  spaBuilder.build();

} else {
  console.log('Not implemented yet.');
  console.log('Building the source tree of', moduleName, 'is not supported yet.');
}
