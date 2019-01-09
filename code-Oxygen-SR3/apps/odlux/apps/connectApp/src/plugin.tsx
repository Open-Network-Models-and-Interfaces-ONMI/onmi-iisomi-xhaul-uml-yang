import * as React from "react";
import { withRouter, RouteComponentProps, Route, Switch, Redirect } from 'react-router-dom';
import { faPlug } from '@fortawesome/free-solid-svg-icons';
import applicationManager from '../../../framework/src/services/applicationManager';
import connect, { Connect } from '../../../framework/src/flux/connect';
import connectAppRootHandler from './handlers/connectAppRootHandler';
import ConnectApplication  from './views/connectView';

type AppProps = RouteComponentProps & Connect;       
const App = (props: AppProps) => (   
  <Switch>                  
    <Route exact path={`${props.match.path}`} component={ConnectApplication} />
    <Redirect to={ `${ props.match.path }` } />
  </Switch>
);


const FinalApp = withRouter(connect()(App));
export function register(){
	applicationManager.registerApplication({  
	  name: "connectApp",
	  icon: faPlug,
	  rootComponent: FinalApp,
	  rootActionHandler: connectAppRootHandler,
	  menuEntry: "Connect App"
}); 
};                                                            