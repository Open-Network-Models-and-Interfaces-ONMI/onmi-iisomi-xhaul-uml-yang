import * as React from 'react';

import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';

import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme: Theme) => createStyles({
  accordion: {
    background: theme.palette.secondary.dark,
    color: theme.palette.primary.main
  },
  detail: {
    background: theme.palette.primary.main,
    color: theme.palette.common.black,
  },
  textcolor: {
    color: theme.palette.common.white,
    fontSize: "1rem"
  },
});

type PanalProps = WithStyles<typeof styles> & {
  activePanel: string | null,
  panelId: string,
  title: string,
  onToggle: (panelId: string | null) => void;
}

const PanelComponent: React.SFC<PanalProps> = (props) => {
  const { classes, activePanel, onToggle } = props;
  return (
    <ExpansionPanel className={ classes.accordion } expanded={ activePanel === props.panelId } onChange={ () => onToggle(props.panelId) } >
      <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon /> }>
        <Typography className={ classes.textcolor } >{ props.title }</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={ classes.detail }>
        { props.children }
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export const Panel = withStyles(styles)(PanelComponent);
export default Panel;