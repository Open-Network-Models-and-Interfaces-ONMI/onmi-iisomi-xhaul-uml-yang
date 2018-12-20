import * as React from 'react';
import connect from '../../../../framework/src/flux/connect';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MountPoints from '../components/mountPoint'
import { withStyles, Theme, WithStyles, createStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Typography } from '@material-ui/core';
import { loadAllRequiredNetworkElementsAsync } from '../actions/requiredNetworkElementsActions';
import { loadConnectionStatusLogAsync } from '../actions/connectionStatusLogActions';
import { loadAllUnknownNetworkElementsAsync } from '../actions/unknownNetworkElementsActions';
import { RequiredNetworkElementsListComponent } from '../components/requiredNetworkElements';
import { ConnectionStatusLogComponent } from '../components/connectionStatusLog';
import { UnknownNetworkElementsListComponent } from '../components/unknownNetworkElements';
  

const actionStyles = (theme: Theme) => createStyles({ 
  accordion: {
    background: '#428bca'
  },
  detail: {
    background: "white"
  },
  textcolor: {
    color: "white",
    fontSize: "1rem"
  }
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
            this.props.onLoadAllRequiredNetworkElements();
            break;
          case 'panel2':
            this.props.onLoadUnknownNetworkElements();
            break;
        }
      }
    }
    );
  }

  render(): JSX.Element {
    const { networkelements,
      busy,
      onLoadAllRequiredNetworkElements,
      connectionLog,
      onLoadConnectionStatusLog,
      unknownNetworkElements,
      onLoadUnknownNetworkElements,
      classes
    }: any = this.props;
    const { expanded } = this.state;

    return (
      <div>
        <ExpansionPanel className={ classes.accordion } expanded={expanded==='panel1'} onChange ={this.handleChange('panel1')} >
          <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon /> }>
            <Typography className={ classes.textcolor } >Required Network Elements</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={ classes.detail }>
            <RequiredNetworkElementsListComponent networkElements={ networkelements } busy={ busy }
              onLoadAllRequiredNetworkElements={ onLoadAllRequiredNetworkElements }
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
 
        <ExpansionPanel className={ classes.accordion } expanded={expanded==='panel2'} onChange ={this.handleChange('panel2')} >
          <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon /> }>
            <Typography className={ classes.textcolor } >Unknown Network Elements</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={ classes.detail } >
            <UnknownNetworkElementsListComponent unknownNetworkElements ={ unknownNetworkElements } busy ={ busy }
            onLoadUnknownNetworkElements={ onLoadUnknownNetworkElements } />
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel className={ classes.accordion } expanded={expanded==='panel3'} onChange ={this.handleChange('panel3')} >
          <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon /> }>
            <Typography className={ classes.textcolor } >Mount NETCONF Servers (devices, nodes, mediators, controllers, ...)</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={ classes.detail } >
            <MountPoints />
          </ExpansionPanelDetails>
        </ExpansionPanel>
 
        <ExpansionPanel className={ classes.accordion } expanded={expanded==='panel4'} onChange ={this.handleChange('panel4')} >
          <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon /> }>
            <Typography className={ classes.textcolor } >Connection Status Log</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={ classes.detail } >
            <ConnectionStatusLogComponent connectionLog={ connectionLog } busy={ busy }
              onLoadConnectionStatusLog={ onLoadConnectionStatusLog }
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  };
  public componentDidMount() {
    this.props.onLoadAllRequiredNetworkElements();
    this.props.onLoadUnknownNetworkElements();
    this.props.onLoadConnectionStatusLog();
  }
}


export const ConnectApplication = withRouter(
  connect(
    ({ connectApp: state }) => ({
      networkelements: state.listRequired.networkelements,
      connectionLog: state.listLog.connectionLog,
      unknownNetworkElements: state.listUnknown.unknownNetworkElements,
      busy: state.listRequired.busy
    }),
    (dispatcher) => ({
      onLoadAllRequiredNetworkElements: () => {
        console.log('dispatcher: ', dispatcher);
        dispatcher.dispatch(loadAllRequiredNetworkElementsAsync);
      },
      onLoadUnknownNetworkElements: () => {
        dispatcher.dispatch(loadAllUnknownNetworkElementsAsync);
      },
      onLoadConnectionStatusLog: () => {
        dispatcher.dispatch(loadConnectionStatusLogAsync);
      }
    }))(ConnectApplicationComponent));

export default withStyles(actionStyles)(ConnectApplication);