// import { connect } from '../flux/connect';

// interface Func<T> {
//   ([...args]: any): T;
// }

// export function connectedHelper<TProps>() {
//   return <TStateProps extends {}, TDispatchProps extends {}>(
//     mapStateToProps?: Func<TStateProps> | TStateProps,
//     mapDispatchToProps?: Func<TDispatchProps> | TDispatchProps) => (
//       {
//         propsGeneric: null as any as TProps & TStateProps & TDispatchProps,
//         connect: (component: React.ComponentType) => connect(mapStateToProps, mapDispatchToProps)(
//           component) as any as React.ComponentClass<TProps>
//       });
// }

// export default connectedHelper;