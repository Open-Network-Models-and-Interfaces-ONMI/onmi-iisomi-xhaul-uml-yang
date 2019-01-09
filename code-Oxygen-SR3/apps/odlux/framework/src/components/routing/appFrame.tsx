import * as React from 'react';

import connect, { Connect } from '../../flux/connect';

import { SetTitleAction } from '../../actions/titleActions';
import { AddErrorInfoAction } from '../../actions/errorActions';

import { IconType } from '../../models/iconDefinition'; 

export interface IAppFrameProps  {
  title: string;
  icon?: IconType;
}

/** 
 * Represents a component to wich will embed each single app providing the 
 * functionality to update the title and implement an exeprion border.
 */
export class AppFrame extends React.Component<IAppFrameProps & Connect> {
  
  public render(): JSX.Element {
    return (
      <div style={{ height: "100%", overflow: "auto" }}> 
        { this.props.children }
      </div>
     )
    }
    
  public componentDidMount() {
    this.props.dispatch(new SetTitleAction(this.props.title, this.props.icon));
  }
  public componentDidCatch(error: Error | null, info: object) {
    this.props.dispatch(new AddErrorInfoAction({ error, info }));
  }
}

export default connect()(AppFrame);