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

		case actionTypes.updateUserData:
			console.log('ACTION =>>>', action);
			return {
				...state,
				currentUser: action.payload.updatedUser
			};

		case actionTypes.newKey:
			const updatedUser = { ...state.currentUser };

			updatedUser.privateKey = action.payload.updatedKey;

			return {
				...state,
				currentUser: updatedUser
			};
		default:
			return state;
	}
};

export default reducer;
