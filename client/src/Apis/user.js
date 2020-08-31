import sendRequest from './sendRequest';

// User
export function personalData() {
	return sendRequest('GET', '/users/personalData');
}

export function editPersonalData(body) {
	return sendRequest('PATCH', '/users/editPersonalData', body);
}

export function userNotifications() {
	return sendRequest('GET', '/users/userNotifications');
}

export function personalProjects() {
	return sendRequest('GET', '/users/personalProjects');
}

export function findUserWithPrivateKey(privateKey) {
	return sendRequest('GET', `/users/getUserWithPrivateKey/${privateKey}`);
}

export function regeneratePrivateKey() {
	return sendRequest('PATCH', '/users/regeneratePrivateKey');
}

export function userTeams(forTeamSelecting) {
	return sendRequest('GET', `/users/userTeams?forTeamSelecting=${forTeamSelecting}`);
}
