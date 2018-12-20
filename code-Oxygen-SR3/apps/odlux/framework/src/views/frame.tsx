import * as React from 'react';
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import { faHome, faAddressBook, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

import AppFrame from '../components/routing/appFrame';
import TitleBar from '../components/titleBar';
import Menu from '../components/navigationMenu';
import ErrorDisplay from '../components/errorDisplay';

import Home from '../views/home';
import Login from '../views/login';
import About from '../views/about';


import applicationService from '../services/applicationManager';

const styles = (theme: Theme) => {
  return createStyles({
    root: {
      flexGrow: 1,
      height: '100%',
      zIndex: 1,
      overflow: 'hidden',
      position: 'relative',
      display: 'flex',
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3,
      minWidth: 0, // So the Typography noWrap works
      overflow: "auto"
    },
    toolbar: theme.mixins.toolbar
  })
};

export const Frame = withStyles(styles)(({ classes }: WithStyles<typeof styles>) => {
  const registrations = applicationService.applications;
  return (
    <Router>
      <div className={classes.root}>
        <ErrorDisplay />
        <TitleBar />
        <Menu />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/" component={() => (
              <AppFrame title={"Home"} icon={faHome} >
                <Home />
              </AppFrame>
            )} />
            <Route path="/about" component={() => (
              <AppFrame title={"About"} icon={faAddressBook} >
                <About />
              </AppFrame>
            )} />
            <Route path="/login" component={() => (
              <AppFrame title={"Login"} icon={faSignInAlt} >
                <Login />
              </AppFrame>
            )} />
            {Object.keys(registrations).map(p => {
              const application = registrations[p];
              return (<Route key={application.name} path={application.path || `/${application.name}`} component={() => (
                <AppFrame title={application.title || application.menuEntry || application.name} icon={application.icon} >
                  <application.rootComponent />
                </AppFrame>
              )} />)
            })}
            <Redirect to="/" />
          </Switch>
        </main>
      </div>
    </Router>
  );
});

export default Frame; 
