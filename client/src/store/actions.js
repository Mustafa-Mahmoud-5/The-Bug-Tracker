import * as actionTypes from './actionTypes';
import { personalData } from '../Apis/user';

const start = () => ({
	type: actionTypes.start
});

const errorOccured = message => ({
	type: actionTypes.errorOccured,
	payload: {
		message
	}
});

const storeUserData = user => ({
	type: actionTypes.storeUserData,
	payload: {
		user
	}
});

export const fetchUser = () => {
	return async dispatch => {
		dispatch(start());
		try {
			const response = await personalData();
			console.log('fetchUser -> response', response.data.user);

			dispatch(storeUserData(response.data.user));
		} catch (error) {
			dispatch(errorOccured(error.response.data.error));
		}
	};
};
