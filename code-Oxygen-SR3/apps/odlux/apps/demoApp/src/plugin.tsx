import * as React from "react"; 
import { withRouter, RouteComponentProps, Route, Switch, Redirect } from 'react-router-dom';

import { faAddressBook } from '@fortawesome/free-solid-svg-icons';

import applicationManager from '../../../framework/src/services/applicationManager';
import connect, { Connect } from '../../../framework/src/flux/connect';

import { demoAppRootHandler } from './handlers/demoAppRootHandler';

import AuthorsList from './views/authorsList';
import EditAuthor from './views/editAuthor';

import { Counter } from './components/counter';

type AppProps = RouteComponentProps & Connect;

const App = (props: AppProps) => (
  <Switch>
    <Route exact path={ `${ props.match.path }/authors` } component={AuthorsList} /> 
    <Route path={ `${ props.match.path }/authors/:authorId` } component={EditAuthor } /> 
    <Redirect to={ `${ props.match.path }/authors` } />
   </Switch>
); 
 
const FinalApp = withRouter(connect()(App)); 

applicationManager.registerApplication({ 
  name: "demoApp",
  icon: faAddressBook,
  rootComponent: FinalApp,
  rootActionHandler: demoAppRootHandler,
  exportedComponents: { counter: Counter },
  menuEntry: "Demo App"
});

