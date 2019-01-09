import * as React from 'react';

import { withRouter, RouteComponentProps } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';  

import { MaterialTable, ColumnType, DataCallback, TableApi } from '../../../../framework/src/components/material-table';
import { Panel } from '../../../../framework/src/components/material-ui';

import { createSearchDataHandler } from '../../../../framework/src/utilities/elasticSearch';
import connect, { Connect } from '../../../../framework/src/flux/connect';

import { Fault, FaultResult, FaultLog } from '../models/fault';
import { IApplicationStoreState } from '../../../../framework/src/store/applicationStore';

const mapProps = (state: IApplicationStoreState) => ({
  faultNotifications: state.faultApp.faultNotifications,
});

type PanelId = null | "CurrentProblem" | "AlarmNotifications" | "AlarmLog";

type FaultApplicationComponentProps = RouteComponentProps &Connect<typeof mapProps> & { };

type FaultApplicationComponentState = {
  activePanel: PanelId;
  currentProblems: Fault[];
};

class FaultApplicationComponent extends React.Component<FaultApplicationComponentProps, FaultApplicationComponentState>{
  state = {
    activePanel: null,
    currentProblems: [],
  };

  private readonly currentProblemApi: TableApi = {};
  private readonly alarmLogApi: TableApi = {};

  render(): JSX.Element {
    
    const { activePanel } = this.state;
    
    const onTogglePanel = (panelId: PanelId) => {
      const nextActivePanel = panelId === this.state.activePanel ? null : panelId;
      switch (nextActivePanel) {
        case 'CurrentProblem':
          this.currentProblemApi.forceRefresh && this.currentProblemApi.forceRefresh();
          break;
        case 'AlarmLog':
          this.alarmLogApi.forceRefresh && this.alarmLogApi.forceRefresh();
          break;
        case null:
        default:
          // nothing to do
          break;
      }
      this.setState({
        activePanel: nextActivePanel
      });
    };

    return (
      <>
        <Panel activePanel={ activePanel } panelId={ 'CurrentProblem' } onToggle={ onTogglePanel } title={ "Current Problem List" }>
          <MaterialTable onRequestData={ this.fetchCurrentProblems } tableApi={ this.currentProblemApi } columns={ [ 
              { property: "icon", title: "", type: ColumnType.custom, customControl: this.renderIcon },
              { property: "timeStamp", title: "Time Stamp" },
              { property: "nodeName", title: "Node Name" },
              { property: "counter", title: "Count", type: ColumnType.numeric, width: "100px" },
              { property: "objectId", title: "Object Id" },
              { property: "problem", title: "Alarm Type" },
              { property: "severity", title: "Severity", width: "140px" },
              ] } idProperty={ '_id' }  />
        </Panel>
        <Panel activePanel={ activePanel } panelId={ 'AlarmNotifications' } onToggle={ onTogglePanel } title={ `Alarm Notifications ${this.props.faultNotifications.faults.length} ${this.props.faultNotifications.since}` }>
          <MaterialTable rows={ this.props.faultNotifications.faults } asynchronus columns={ [
            { property: "icon", title: "", type: ColumnType.custom, customControl: this.renderIcon },
            { property: "timeStamp", title: "Time Stamp" },
            { property: "nodeName", title: "Node Name" },
            { property: "counter", title: "Count", type: ColumnType.numeric, width: "100px" },
            { property: "objectId", title: "Object Id" },
            { property: "problem", title: "Alarm Type" },
            { property: "severity", title: "Severity", width: "140px" },
            ] } idProperty={ '_id' } />
        </Panel>
        <Panel activePanel={ activePanel } panelId={ 'AlarmLog' } onToggle={ onTogglePanel } title={ "Alarm Log" }>
          <MaterialTable onRequestData={ this.fetchAlarmLog } tableApi={ this.alarmLogApi } columns={ [
              { property: "icon", title: "", type: ColumnType.custom, customControl: this.renderIcon },
              { property: "timeStamp", title: "Time Stamp" },
              { property: "nodeName", title: "Node Name" },
              { property: "counter", title: "Count", type: ColumnType.numeric, width: "100px" },
              { property: "objectId", title: "Object Id" },
              { property: "problem", title: "Alarm Type" },
              { property: "severity", title: "Severity", width: "140px" },
            ] } idProperty={ '_id' } />
         </Panel>
      </>
    );
  };

  private renderIcon = (props: { rowData: Fault }) => {
    return (
      <FontAwesomeIcon icon={ faExclamationTriangle } /> 
    );
  }; 

  private fetchCurrentProblems = createSearchDataHandler<FaultResult>(
    'sdnevents/faultcurrent',
    null,
    (hit) => ({ _id: hit._id, ...hit._source.faultCurrent }),
    (name) => `faultCurrent.${name}`
  );
  
  private fetchAlarmLog = createSearchDataHandler<FaultLog>(
    'sdnevents/faultlog',
    null,
    (hit) => ({ _id: hit._id, ...hit._source.fault }),
    (name) => `fault.${ name }`
  );

}

export const FaultApplication = withRouter(connect(mapProps)(FaultApplicationComponent));
export default FaultApplication;
