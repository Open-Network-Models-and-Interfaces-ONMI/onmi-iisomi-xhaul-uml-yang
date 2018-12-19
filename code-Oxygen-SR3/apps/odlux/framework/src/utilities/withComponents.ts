import * as React from 'react';
import applicationService from '../services/applicationManager';
export type WithComponents<T extends { [name: string]: string }> = {
  components: { [prop in keyof T]: React.ComponentType }
};

export function withComponents<TProps,TMap extends { [name: string]: string }>(mapping: TMap) {
  return (component: React.ComponentType<TProps & WithComponents<TMap>>): React.ComponentType<TProps> => {
    const components = {} as any;
    Object.keys(mapping).forEach(name => {
      const [appKey, componentKey] = mapping[name].split('.');
      const reg = applicationService.applications[appKey];
      components[name] = reg && reg.exportedComponents && reg.exportedComponents[componentKey] || (() => null);
    });
    return (props: TProps) => (
      React.createElement(component, Object.assign({ components }, props))
    );
  }
}
export default withComponents;