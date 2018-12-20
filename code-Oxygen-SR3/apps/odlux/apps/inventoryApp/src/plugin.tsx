// app configuration and main entry point for the app

import * as React from "react"; 
import { withRouter, RouteComponentProps, Route, Switch, Redirect } from 'react-router-dom';

import { faLock } from '@fortawesome/free-solid-svg-icons';  // select app icon

import applicationManager from '../../../framework/src/services/applicationManager';
import connect, { Connect } from '../../../framework/src/flux/connect';

import { inventoryAppRootHandler } from './handlers/inventoryAppRootHandler';

import { Dashboard } from  './views/dashboard';
import { Detail } from  './views/detail';

type AppProps = RouteComponentProps & Connect;

const App = (props: AppProps) => (
  <Switch>
    <Route exact path={ `${props.match.path}/` } component={ Dashboard }/>
    <Route path={ `${props.match.path}/detail/:id?` } component={ Detail }/>
    <Redirect to={ `${props.match.path}/` }/>
  </Switch>
); 
 
const FinalApp = withRouter(connect()(App)); 

applicationManager.registerApplication({ 
  name: "inventoryApp",
  icon: faLock,
  rootComponent: FinalApp,
  rootActionHandler: inventoryAppRootHandler,
  menuEntry: "Inventory App"
});

