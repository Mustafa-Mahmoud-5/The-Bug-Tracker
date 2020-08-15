import sendRequest from './sendRequest';
// Project

export function projectDetails(projectId) {
	return sendRequest('GET', `/users/projectDetails/${projectId}`);
}

export function newProject(body) {
	return sendRequest('POST', '/users/newProject', body);
}

export function editProject(body) {
	return sendRequest('PATCH', '/users/editProject', body);
}

export function projectTimeline(projectId) {
	return sendRequest('GET', `/users/projectTimeline/${projectId}`);
}

export function closeOrReOpenProject(body) {
	return sendRequest('PATCH', '/users/closeOrReOpenProject', body);
}