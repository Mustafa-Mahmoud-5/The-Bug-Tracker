import * as actionTypes from './actionTypes';

const initialState = {
	currentUser: null,
	currentUserNotifications: [],
	loading: false
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.start:
			return {
				...state,
				loading: true
			};

		case actionTypes.errorOccured:
			return {
				...state,
				loading: false
			};

		case actionTypes.storeUserData:
			return {
				...state,
				loading: false,
				currentUser: action.payload.user
			};

		default:
			return state;
	}
};

export default reducer;
