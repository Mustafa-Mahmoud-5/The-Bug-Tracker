import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';

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

axios.defaults.baseURL = 'http://localhost:2200';

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
						<App />
					</SnackbarProvider>
				</ThemeProvider>
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

serviceWorker.unregister();
