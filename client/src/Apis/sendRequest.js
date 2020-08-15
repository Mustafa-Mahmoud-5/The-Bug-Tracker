import axios from 'axios';

const userToken = localStorage.getItem('token');

const sendRequest = (type, url, body, sendToken = true) => {
	const req =
		type === 'GET' ? axios.get : type === 'POST' ? axios.post : type === 'PATCH' ? axios.patch : axios.delete;

	const config = sendToken
		? { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` } }
		: null;

	return type === 'GET' ? req(url, config) : req(url, body, config);
};

export default sendRequest;
