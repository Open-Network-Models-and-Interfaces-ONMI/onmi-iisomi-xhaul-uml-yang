import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

import { faHome, faAddressBook } from '@fortawesome/free-solid-svg-icons';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';

import Divider from '@material-ui/core/Divider';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ListItemLink from '../components/material-ui/listItemLink';

import connect, { Connect } from '../flux/connect';

const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar
});

export const NavigationMenu = withStyles(styles)(connect()(({ classes, state }: WithStyles<typeof styles> & Connect) => {
  return (
    <Drawer
      variant="permanent"
      classes={ {
        paper: classes.drawerPaper,
      } }
    >
      <div className={ classes.toolbar } />
      { /* https://fiffty.github.io/react-treeview-mui/ */ }
      <List component="nav">
        <ListItemLink exact to="/" primary="Home" icon={ <FontAwesomeIcon icon={ faHome } /> } />
        <Divider />
        {
          state.framework.applicationRegistraion && Object.keys(state.framework.applicationRegistraion).map(key => {
            const reg = state.framework.applicationRegistraion[key];
            return reg && (
              <ListItemLink 
                key={ reg.name } 
                to={ reg.path || `/${ reg.name }` }
                primary={ reg.menuEntry }
                icon={ reg.icon && <FontAwesomeIcon icon={ reg.icon } /> || null } />
            ) || null;
          }) || null
        }
        <Divider />
       <ListItemLink to="/about" primary="About" icon={ <FontAwesomeIcon icon={ faAddressBook } /> } />
       </List>
      {/* <Divider />
            <List>
              <ListItemLink to="/inbox" primary="Inbox" icon={ <InboxIcon /> } />
              <ListItemLink to="/drafts" primary="Drafts" icon={ <DraftsIcon /> } />
            </List> */}
    </Drawer>)
}));

export default NavigationMenu;