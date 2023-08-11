#!/usr/bin/env node

/* eslint-disable-next-line no-unused-vars */
import dotenv from 'dotenv/config';
import logger from './logger.js';
import {getAccessToken, getWebinarRegistrants} from './zoom.js';
import figlet from 'figlet';
import fs from 'node:fs';
import {Parser, transforms} from 'json2csv';

const json2csv = new Parser({
	transforms: [transforms.flatten({objects: true, arrays: true})]
});

function missingCredentials(creds) {
	logger.error(`${creds} missing in .env. Exit.`);
	process.exit(1);
}

logger.info(`\n${figlet.textSync('Zoom', 'Banner4')}\n`);

if (!process.env.accountID) missingCredentials('accountID');
if (!process.env.clientID) missingCredentials('clientID');
if (!process.env.clientSecret) missingCredentials('clientSecret');

import {Command} from 'commander';
const program = new Command();
program.name('./getWebinarUrls.js');
program.description(
	'getWebinarUrls\nThis is an example script that will output registrant URLs to a CSV file.'
);
program.showSuggestionAfterError();

program.option('-w ,--webinarid <webinarID>', 'Zoom Webinar ID to lookup');
program.option(
	'-d, --dir <directory>',
	'change the output directory',
	'./reports'
);

program.addHelpText(
	'after',
	`
Usage:
  getWebinarUrls.js -w 8675309
  getWebinarUrls.js --wid 8675309 --dir ./newdir`
);

program.parse();

let options = program.opts();
if (!options.webinarid) {
	logger.warn('No webinar ID found.  Nothing to do.');
	logger.info('See -h or --help for options.');
	process.exit(0);
}

try {
	if (!fs.existsSync(options.dir)) fs.mkdirSync(options.dir, {recursive: true});
} catch (e) {
	logger.error(e.message);
	process.exit(1);
}

const accessToken = await getAccessToken();
if (!accessToken) {
	logger.error('Unable to get access token.');
	process.exit(1);
}

const registrants = await getWebinarRegistrants(
	accessToken,
	options.webinarid,
	[]
);

if (!registrants) {
	logger.error('No registrants found.');
	process.exit(1);
}

let csv = await json2csv.parse(registrants);
let currentDate = new Date().toJSON().slice(0, 10);
let file = `${options.dir}/${currentDate}-${options.webinarid}-registrants.csv`;

try {
	fs.writeFileSync(file, csv, 'utf8');
} catch (e) {
	logger.error(`Unable to create csv | ${e.message}`);
	process.exit(1);
}

logger.info(`Created report ${file} sucessfully.`);
