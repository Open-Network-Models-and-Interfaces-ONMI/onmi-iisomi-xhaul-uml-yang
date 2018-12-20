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
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { WithStyles, withStyles, createStyles, Theme } from '@material-ui/core/styles'; // infra for styling

const styles = (theme: Theme) => createStyles({
  headerLogo: {
    backgroundImage: "url(" + theme.design.url + ")",
    backgroundColor: theme.palette.primary.main,
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto " + theme.design.logoHeight + "px",
    height: theme.design.logoHeight,
    width: theme.design.width / theme.design.height * theme.design.logoHeight
  }
});

type LogoProps = RouteComponentProps<{ id: string }> & WithStyles<typeof styles>;
interface ILogoState {
  windowWidth: number
}

class LogoComponent extends React.Component<LogoProps, ILogoState> {

  private hideLogoWhenWindowWidthIsLower: number = 800;

  constructor(props: LogoProps) {
    super(props);
    this.state = {
      windowWidth: 0
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

  componentDidMount(): void {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  };
  componentWillUnmount(): void {
    window.removeEventListener('resize', this.updateWindowDimensions);
  };
  updateWindowDimensions(): void {
    this.setState({ windowWidth: window.innerWidth });
  }

  render(): JSX.Element {
    let div: JSX.Element = <div />;
    if (this.state.windowWidth >= this.hideLogoWhenWindowWidthIsLower) {
      div = <div className={this.props.classes.headerLogo} />;
    } else {
      console.info([
        "Logo hidden, because browser window width (",
        this.state.windowWidth,
        "px) is lower thershold (",
        this.hideLogoWhenWindowWidthIsLower,
        "px)."].join(''));
    }
    return div;
  }
}

export const Logo = withStyles(styles)(withRouter(LogoComponent));
export default Logo;
