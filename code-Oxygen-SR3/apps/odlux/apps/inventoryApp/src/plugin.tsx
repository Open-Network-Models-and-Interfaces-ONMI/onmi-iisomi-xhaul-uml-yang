// app configuration and main entry point for the app

import * as React from "react"; 
import { withRouter, RouteComponentProps, Route, Switch, Redirect } from 'react-router-dom';

import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';  // select app icon

import applicationManager from '../../../framework/src/services/applicationManager';
import connect, { Connect } from '../../../framework/src/flux/connect';

import { Dashboard } from  './views/dashboard';

type AppProps = RouteComponentProps & Connect;

const App = (props: AppProps) => (
  <Switch>
    <Route exact path={ `${props.match.path}/` } component={ Dashboard }/>
    <Redirect to={ `${props.match.path}/` }/>
  </Switch>
); 
 
const FinalApp = withRouter(connect()(App)); 

applicationManager.registerApplication({ 
  name: "inventoryApp",
  icon: faShoppingBag,
  rootComponent: FinalApp,
  menuEntry: "Inventory App"
});

