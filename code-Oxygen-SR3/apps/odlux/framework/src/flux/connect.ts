import * as React from 'react';
import * as PropTypes from 'prop-types';

import { Dispatch } from '../flux/store';

import { ApplicationStore, IApplicationStoreState } from '../store/applicationStore';

interface IApplicationStoreContext {
  applicationStore: ApplicationStore;
}

export interface IDispatcher {
  dispatch: Dispatch;
}

interface IApplicationStoreProps {
  state: IApplicationStoreState;
}

interface IDispatchProps {
  dispatch: Dispatch;
}

type FuncInfer<T> = {
  ([...args]: any): T;
};

type FunctionResult<T> = T extends FuncInfer<infer U> ? U : never;

type ComponentDecoratorInfer<TMergedProps> = {
  <TProps>(wrappedComponent: React.ComponentType<TProps & TMergedProps>): React.ComponentClass<TProps>;
};

export type Connect<TMapProps = undefined, TMapDispatch = undefined> =
  (TMapProps extends undefined ? IApplicationStoreProps : FunctionResult<TMapProps>) &
  (TMapDispatch extends undefined ? IDispatchProps : FunctionResult<TMapDispatch>);

export function connect(): ComponentDecoratorInfer<IApplicationStoreProps & IDispatchProps>;

export function connect<TStateProps>(
  mapStateToProps: (state: IApplicationStoreState) => TStateProps
): ComponentDecoratorInfer<TStateProps & IDispatchProps>;

export function connect<TStateProps, TDispatchProps>(
  mapStateToProps: (state: IApplicationStoreState) => TStateProps,
  mapDispatchToProps: (dispatcher: IDispatcher) => TDispatchProps
): ComponentDecoratorInfer<TStateProps & TDispatchProps>;


export function connect<TDispatchProps>(
  mapStateToProps: undefined,
  mapDispatchToProps: (dispatcher: IDispatcher) => TDispatchProps
): ComponentDecoratorInfer<IApplicationStoreProps & TDispatchProps>;


export function connect<TProps, TStateProps, TDispatchProps>(
  mapStateToProps?: ((state: IApplicationStoreState) => TStateProps),
  mapDispatchToProps?: ((dispatcher: IDispatcher) => TDispatchProps)
) :
  ((WrappedComponent: React.ComponentType<TProps & (IApplicationStoreProps | TStateProps) & IDispatchProps>) => React.ComponentType<TProps>) {
  
  const injectApplicationStore = (WrappedComponent: React.ComponentType<TProps & (IApplicationStoreProps | TStateProps) & IDispatchProps>): React.ComponentType<TProps> => {

    class StoreAdapter extends React.Component<TProps, {}> {
      public static contextTypes = { ...WrappedComponent.contextTypes, applicationStore: PropTypes.object.isRequired };
      context: IApplicationStoreContext;

      render(): JSX.Element {
        
        if (isWrappedComponentIsVersion1(WrappedComponent)) {
          const element = React.createElement(WrappedComponent, { ...(this.props as any), state: this.store.state, dispatch: this.store.dispatch.bind(this.store) });
          return element;
        } else if (mapStateToProps && isWrappedComponentIsVersion2(WrappedComponent)) {
          const element = React.createElement(WrappedComponent, { ...(this.props as any), ...(mapStateToProps(this.store.state) as any), dispatch: this.store.dispatch.bind(this.store) });
          return element;
        } else if (mapStateToProps && mapDispatchToProps && isWrappedComponentIsVersion3(WrappedComponent)) {
          const element = React.createElement(WrappedComponent, { ...(this.props as any), ...(mapStateToProps(this.store.state) as any), ...(mapDispatchToProps({ dispatch: this.store.dispatch.bind(this.store)}) as any) });
          return element;
        } else if (!mapStateToProps && mapDispatchToProps && isWrappedComponentIsVersion4(WrappedComponent)) {
          const element = React.createElement(WrappedComponent, { ...(this.props as any), state: this.store.state, ...(mapDispatchToProps({ dispatch: this.store.dispatch.bind(this.store)}) as any) });
          return element;
        }
        throw new Error("Invalid arguments in connect.");
      }

      componentDidMount(): void {
        this.store && this.store.changed.addHandler(this.handleStoreChanged);
      }

      componentWillUnmount(): void {
        this.store && this.store.changed.removeHandler(this.handleStoreChanged);
      }

      private get store(): ApplicationStore {
        return this.context.applicationStore;
      }

      private handleStoreChanged = () => {
        this.forceUpdate();
      }
    }

    return StoreAdapter;
  }


  return injectApplicationStore;

  /* inline methods */

  function isWrappedComponentIsVersion1(wrappedComponent: any): wrappedComponent is React.ComponentType<TProps & IApplicationStoreProps & IDispatchProps> {
    return !mapStateToProps && !mapDispatchToProps;
  }

  function isWrappedComponentIsVersion2(wrappedComponent: any): wrappedComponent is React.ComponentType<TProps & TStateProps & IDispatchProps> {
    return !!mapStateToProps && !mapDispatchToProps;
  }

  function isWrappedComponentIsVersion3(wrappedComponent: any): wrappedComponent is React.ComponentType<TProps & TStateProps & TDispatchProps> {
    return !!mapStateToProps && !!mapDispatchToProps;
  }

  function isWrappedComponentIsVersion4(wrappedComponent: any): wrappedComponent is React.ComponentType<TProps & TStateProps & TDispatchProps> {
    return !mapStateToProps && !!mapDispatchToProps;
  }
}

interface ApplicationStoreProviderProps extends React.Props<ApplicationStoreProvider> {
  applicationStore: ApplicationStore;
}

export class ApplicationStoreProvider extends React.Component<ApplicationStoreProviderProps>
  implements /* React.ComponentLifecycle<ApplicationStoreProviderProps, any>, */ React.ChildContextProvider<IApplicationStoreContext> {

  public static childContextTypes = { applicationStore: PropTypes.object.isRequired };

  getChildContext(): IApplicationStoreContext {
    return {
      applicationStore: this.props.applicationStore
    };
  }

  render(): JSX.Element {
    return React.Children.only(this.props.children);
  }
}

export default connect;