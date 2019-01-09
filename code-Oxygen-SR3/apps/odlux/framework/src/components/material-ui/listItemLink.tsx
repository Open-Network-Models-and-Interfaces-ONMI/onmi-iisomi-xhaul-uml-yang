import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  active: {
    backgroundColor: theme.palette.action.active
  }
});

export interface IListItemLinkProps extends WithStyles<typeof styles> {
  icon: JSX.Element | null;
  primary: string;
  to: string;
  exact?: boolean;
}

export const ListItemLink = withStyles(styles)((props: IListItemLinkProps) => {
  const { icon, primary, classes, to, exact = false } = props;
  const renderLink = (itemProps: any): JSX.Element => (<NavLink exact={ exact } to={ to } activeClassName={ classes.active } { ...itemProps } />);

  return (
      <li>
        <ListItem button component={ renderLink }>
          { icon
            ? <ListItemIcon>{ icon }</ListItemIcon>
            : null
          }
          <ListItemText primary={ primary } />
        </ListItem>
      </li>
    );
  }
);

export default ListItemLink;

