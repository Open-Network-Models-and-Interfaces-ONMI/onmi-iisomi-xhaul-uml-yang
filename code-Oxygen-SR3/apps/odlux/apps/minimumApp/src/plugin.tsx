// app configuration and main entry point for the app

import * as React from "react"; 
import { withRouter, RouteComponentProps, Route, Switch, Redirect } from 'react-router-dom';

import { faLock } from '@fortawesome/free-solid-svg-icons';  // select app icon

import applicationManager from '../../../framework/src/services/applicationManager';
import connect, { Connect } from '../../../framework/src/flux/connect';

import { minimumAppRootHandler } from './handlers/minimumAppRootHandler';

type AppProps = RouteComponentProps & Connect;

const App = (props: AppProps) => (
  <div>Start your app here!!</div>
); 
 
const FinalApp = withRouter(connect()(App)); 
export function register(){
	applicationManager.registerApplication({ 
	  name: "minimumApp",
	  icon: faLock,
	  rootComponent: FinalApp,
	  rootActionHandler: minimumAppRootHandler,
	  menuEntry: "Minimum App"
	});
};
