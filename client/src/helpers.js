import io from 'socket.io-client';

export const toDate = date => {
	return new Date(date).toLocaleDateString();
};
