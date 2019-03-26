// app configuration and main entry point for the app

import * as React from "react"; 
import { withRouter, RouteComponentProps, Route, Switch, Redirect } from 'react-router-dom';

import { faBell } from '@fortawesome/free-solid-svg-icons';  // select app icon

import { subscribe, IFormatedMessage } from '../../../framework/src/services/notificationService';
import applicationManager from '../../../framework/src/services/applicationManager';
import connect, { Connect } from '../../../framework/src/flux/connect';

import { faultAppRootHandler } from './handlers/faultAppRootHandler';
import { FaultApplication } from "./views/faultApplication";

import { Fault } from "models/fault";
import { AddFaultNotificationAction } from "./actions/notificationActions";
type AppProps = RouteComponentProps & Connect;

const App = (props: AppProps) => (
  <Switch>
    <Route exact path={ `${ props.match.path }` } component={ FaultApplication } />
    <Redirect to={ `${ props.match.path }` } />
  </Switch>
); 
 
const FinalApp = withRouter(connect()(App)); 
export function register(){

	const applicationApi = applicationManager.registerApplication({ 
	  name: "faultApp",
	  icon: faBell,
	  rootComponent: FinalApp,
	  rootActionHandler: faultAppRootHandler,
	  menuEntry: "Fault"
	});

	// subscribe to the websocket notifications
	subscribe<Fault & IFormatedMessage>("ProblemNotification", (fault  => {
	  const store = applicationApi && applicationApi.applicationStore;
	  if (fault && store) {
	    store.dispatch(new AddFaultNotificationAction(fault));
	  }
	}));
};
