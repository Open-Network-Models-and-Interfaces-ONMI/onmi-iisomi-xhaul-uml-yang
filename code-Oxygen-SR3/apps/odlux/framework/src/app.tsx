/******************************************************************************
 * Copyright 2018 highstreet technologies GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *****************************************************************************/

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { ThemeOptions, Theme } from '@material-ui/core/styles/createMuiTheme';
import { Frame } from './views/frame';

import { AddErrorInfoAction } from './actions/errorActions';

import { applicationStoreCreator } from './store/applicationStore';
import { ApplicationStoreProvider } from './flux/connect';

import theme from './styles/att';
import '!style-loader!css-loader!./app.css';

declare module '@material-ui/core/styles/createMuiTheme' {

  interface IDesign {
    id: string,
    name: string,
    url: string,        // image url of a company logo, which will be presented in the ui header
    height: number,     // image height [px] as delivered by the url
    width: number,      // image width [px] as delivered by the url
    logoHeight: number  // height in [px] of the logo (see url) within the ui header
  }

  interface Theme {
    design: IDesign
  }
  interface ThemeOptions {
    design: IDesign
  }
}

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
