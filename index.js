/* eslint-disable-next-line no-unused-vars */
import dotenv from 'dotenv/config';
import logger from './logger.js';
import {getAccessToken, getWebinarRegistrants} from './zoom.js';

import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

if (!process.env.accountID) logger.warn('accountID missing in .env');
if (!process.env.clientID) logger.warn('clientID missing in .env');
if (!process.env.clientSecret) logger.warn('clientSecret missing in .env');

app.set('query parser', 'simple');

app.get('/:webinarID', express.json(), async (req, res) => {
	// Get an access token for use in future requests
	const accessToken = await getAccessToken();
	if (!accessToken) {
		res.status(500).json({error: 'Unable to get access token'});
		return;
	}

	logger.info(`Getting registrant list for webinar: ${req.params.webinarID}`);

	const registrants = await getWebinarRegistrants(
		accessToken,
		req.params.webinarID,
		[]
	);
	if (!registrants) {
		res.status(404).json({error: 'no registrants found'});
		return;
	}

	res.status(200).json(registrants);
});

app.listen(port, () => {
	logger.info(`listening on port ${port}`);
});
