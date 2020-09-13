import sendRequest from './sendRequest';

// Auth
export function signup(body) {
	return sendRequest('POST', '/auth/signup', body, false);
}

export function signin(body) {
	const loginResponse = sendRequest('POST', '/auth/signIn', body, false);
	console.log('signin -> Loginresponse', loginResponse);
	return loginResponse;
}
