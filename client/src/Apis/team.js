import sendRequest from './sendRequest';

// Teams
export function newTeam(body) {
	return sendRequest('POST', '/teams/newTeam', body);
}

export function addMembers(body) {
	return sendRequest('POST', '/teams/addMembers');
}

export function teamDetails(teamId) {
	return sendRequest('GET', `/teams/getTeam/${teamId}`);
}

export function teamNotifications(teamId) {
	return sendRequest('GET', `/teams/teamNotifications/${teamId}`);
}

export function kickMember(body) {
	return sendRequest('PATCH', '/teams/kickMember', body);
}