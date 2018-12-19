import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { Frame } from './views/frame';

import { AddErrorInfoAction } from './actions/errorActions';

import { applicationStoreCreator } from './store/applicationStore';
import { ApplicationStoreProvider } from './flux/connect';

import '!style-loader!css-loader!./app.css';

const theme = createMuiTheme();

const applicationStore = applicationStoreCreator();

window.onerror = function (msg: string, url: string, line: number, col: number, error: Error) {
  // Note that col & error are new to the HTML 5 spec and may not be 
  // supported in every browser.  It worked for me in Chrome.
  var extra = !col ? '' : '\ncolumn: ' + col;
  extra += !error ? '' : '\nerror: ' + error;

  // You can view the information in an alert to see things working like this:
  applicationStore.dispatch(new AddErrorInfoAction({ error, message: msg, url, line, col, info: { extra } }));

  var suppressErrorAlert = true;
  // If you return true, then error alerts (like in older versions of 
  // Internet Explorer) will be suppressed.
  return suppressErrorAlert;
};

const App = (): JSX.Element => (
  <ApplicationStoreProvider applicationStore={ applicationStore } >
    <MuiThemeProvider theme={ theme }>
      <Frame />
    </MuiThemeProvider>
  </ApplicationStoreProvider>
);

ReactDOM.render(<App />, document.getElementById('app')); 
