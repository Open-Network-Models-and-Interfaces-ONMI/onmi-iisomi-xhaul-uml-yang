import * as React from "react";
import { withRouter, RouteComponentProps, Route, Switch, Redirect } from 'react-router-dom';

import { faNewspaper } from '@fortawesome/free-solid-svg-icons';

import applicationManager from '../../../framework/src/services/applicationManager';
import connect, { Connect } from '../../../framework/src/flux/connect';
import { ApiAction } from '../../../framework/src/middleware/api'; // for RestConf

import { apiDemoRootHandler } from './handlers/apiDemoRootHandler';
import { ModulesRequestSuccess } from './actions/modulesSuccess';
import { Module } from './models/module';

type AppProps = RouteComponentProps & Connect & { modules: Module[], requestModules: () => void };

const App = (props: AppProps ) => (
  <>
    <button onClick={ props.requestModules }>Load Modules</button>
    <ul>{ props.modules.map((mod, ind) => (<li key={ ind }>{ mod.name }</li>)) }</ul>
  </>
);

const FinalApp = withRouter(connect((state) => ({
  modules: state.apiDemo.modules
}), (dispatcher => ({
  requestModules: () => { dispatcher.dispatch(new ApiAction('restconf/modules', ModulesRequestSuccess, true)) }
})))(App));

applicationManager.registerApplication({
  name: "apiDemo",
  icon: faNewspaper,
  rootComponent: FinalApp,
  rootActionHandler: apiDemoRootHandler,
  menuEntry: "API Demo"
});

