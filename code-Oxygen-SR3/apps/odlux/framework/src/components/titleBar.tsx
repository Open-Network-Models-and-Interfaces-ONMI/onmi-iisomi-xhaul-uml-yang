import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ToggleButton from '../components/material-ui/toggleButton';

import { UpdateAuthentication } from '../actions/authentication';

import connect, { Connect, IDispatcher } from '../flux/connect';

const styles = (theme: Theme) => createStyles({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  icon: {
    marginRight: 12
  }
});

const mapDispatch = (dispatcher: IDispatcher) => {
  return {
    logout: () => { dispatcher.dispatch(new UpdateAuthentication(null)); }
  }
};

type TitleBarProps = RouteComponentProps<{}> & WithStyles<typeof styles> & Connect<undefined, typeof mapDispatch>

class TitleBarComponent extends React.Component<TitleBarProps, { anchorEl: HTMLElement | null }> {

  constructor(props: TitleBarProps) {
    super(props);

    this.state = {
      anchorEl: null
    }

  }
  render(): JSX.Element {
    const { classes, state, history, location } = this.props;
    const open = !!this.state.anchorEl;

    return (
      <AppBar position="absolute" className={ classes.appBar }>
        <Toolbar>
          <IconButton className={ classes.menuButton } color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="title" color="inherit" className={ classes.grow }>
            { state.framework.applicationState.icon
              ? (<FontAwesomeIcon className={ classes.icon } icon={ state.framework.applicationState.icon } />)
              : null }
            { state.framework.applicationState.title }
          </Typography>
          <ToggleButton value="toggleTheme">MenuIcon</ToggleButton>
          { state.framework.authentication.user
            ? (<div>
              <Button
                aria-owns={ open ? 'menu-appbar' : undefined }
                aria-haspopup="true"
                onClick={ this.openMenu }
                color="inherit"
              >
                <AccountCircle />
                { state.framework.authentication.user.user }
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={ this.state.anchorEl }
                anchorOrigin={ {
                  vertical: 'top',
                  horizontal: 'right',
                } }
                transformOrigin={ {
                  vertical: 'top',
                  horizontal: 'right',
                } }
                open={ open }
                onClose={ this.closeMenu }
              >
                <MenuItem onClick={ this.closeMenu }>Profile</MenuItem>
                <MenuItem onClick={ () => {
                  this.props.logout();
                  this.closeMenu();
                } }>Logout</MenuItem>
              </Menu>
            </div>)
            : (<Button onClick={ () => { history.push('/login') } } color="inherit" disabled={ location.pathname == "/login" }>Login</Button>) }
        </Toolbar>
      </AppBar>
    );
  };


  private openMenu = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  private closeMenu = () => {
    this.setState({ anchorEl: null });
  };
}

//todo: ggf. https://github.com/acdlite/recompose verwenden zur Vereinfachung

export const TitleBar = withStyles(styles)(withRouter(connect(undefined, mapDispatch)(TitleBarComponent)));
export default TitleBar;