import * as React from 'react';
import connect from '../../../../framework/src/flux/connect';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MountPoints from '../components/mountPoint'
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core';
import { loadAllUnknownNetworkElementsAsync, LoadAllUnknownNetworkElementsAction } from '../actions/unknownNetworkElementsActions';
import { RequiredNetworkElementsListComponent } from '../components/requiredNetworkElements';
import { ConnectionStatusLogComponent } from '../components/connectionStatusLog';
import { UnknownNetworkElementsListComponent } from '../components/unknownNetworkElements';
import { TableApi } from '../../../../framework/src/components/material-table';


const actionStyles = (theme: Theme) => createStyles({
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

class ConnectApplicationComponent extends React.Component<any, any>{
  state = {
    expanded: null,
  };

  public handleChange = (panel: string) => (event: React.MouseEvent<HTMLButtonElement>, expanded: any) => {
    this.setState({
      expanded: expanded ? panel : false
    }, () => {
      if (expanded) {
        switch (panel) {
          case 'panel1':
         //   this.updateTableapi.forceRefresh && this.updateTableapi.forceRefresh();
            break;
          case 'panel2':
          this.props.onLoadUnknownNetworkElements();
            break;
          case 'panel4':
         //   this.updateTableapi.forceRefresh && this.updateTableapi.forceRefresh();
            break;
        }
      }
    }
    );
  }


  render(): JSX.Element {
    const {
      busy,
      unknownNetworkElements,
      classes
    }: any = this.props;
    const { expanded } = this.state;


    return (
      <div>
        <ExpansionPanel className={classes.accordion} expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')} >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.textcolor} >Required Network Elements</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.detail}>
            <RequiredNetworkElementsListComponent />
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel className={classes.accordion} expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')} >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.textcolor} >Unknown Network Elements</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.detail} >
            <UnknownNetworkElementsListComponent unknownNetworkElements={unknownNetworkElements} busy={busy} />
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel className={classes.accordion} expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')} >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.textcolor} >Mount NETCONF Servers (devices, nodes, mediators, controllers, ...)</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.detail} >
            <MountPoints />
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel className={classes.accordion} expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')} >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.textcolor} >Connection Status Log</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.detail} >
            <ConnectionStatusLogComponent />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  };
  public componentDidMount() {
    this.props.onLoadUnknownNetworkElements();
  }
}


export const ConnectApplication = withRouter(
  connect(
    ({ connectApp: state }) => ({
      unknownNetworkElements: state.listUnknown.unknownNetworkElements,
    }),
    (dispatcher) => ({
      onLoadUnknownNetworkElements: () => {
        dispatcher.dispatch(loadAllUnknownNetworkElementsAsync);
      }
    }))(ConnectApplicationComponent));

export default withStyles(actionStyles)(ConnectApplication);