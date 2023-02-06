import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { io } from "socket.io-client";
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import {GoogleOAuthProvider} from "@react-oauth/google";
// NOTISTACK
import { SnackbarProvider } from 'notistack';

// THEME
import { ThemeProvider } from '@material-ui/core';
import theme from './theme';

// AXIOS
import axios from 'axios';

// REDUX
import { Provider } from 'react-redux';

import { createStore, compose, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';

import reducer from './store/reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

const {REACT_APP_GOOGLE_CLIENT_ID} = process.env;
const baseUrl = 'https://the-bug-tracker-server.glitch.me/';
// const baseUrl = 'http://localhost:2300';

axios.defaults.baseURL = baseUrl;

export const socket = io(`${baseUrl}/`, {transports: ['websocket']});

socket.on("connect", () => {
	console.log("SCOKET", socket.id);
});

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});



ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<SnackbarProvider
						maxSnack={3}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left'
						}}
					>
						<GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
							<App />
						</GoogleOAuthProvider>
					</SnackbarProvider>
				</ThemeProvider>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

serviceWorker.unregister();
