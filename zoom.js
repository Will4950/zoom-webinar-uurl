import axios from 'axios';

const zoomAuth = 'https://zoom.us/oauth/';
const zoomAPI = 'https://api.zoom.us/v2/';

export async function getAccessToken() {
	try {
		let oauthToken = Buffer.from(
			`${process.env.clientID}:${process.env.clientSecret}`
		).toString('base64');

		let res = await axios({
			method: 'post',
			url: `${zoomAuth}token?grant_type=account_credentials&account_id=${process.env.accountID}`,
			headers: {Authorization: `Basic ${oauthToken}`}
		});
		return res.data.access_token;
	} catch (e) {
		return false;
	}
}

export async function getWebinarRegistrants(
	accessToken,
	webinarID,
	registrants,
	token
) {
	try {
		let res = await axios({
			method: 'get',
			url: `${zoomAPI}/webinars/${webinarID}/registrants`,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			params: {
				page_size: 300,
				next_page_token: token ? token : null
			}
		});
		registrants = registrants.concat(res.data.registrants);
		if (res.data.next_page_token) {
			return await getWebinarRegistrants(
				accessToken,
				webinarID,
				registrants,
				res.data.next_page_token
			);
		} else {
			return registrants;
		}
	} catch (e) {
		return false;
	}
}
