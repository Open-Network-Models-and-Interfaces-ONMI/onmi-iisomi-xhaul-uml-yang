export type Module = {
  name: string;
  revision: string; 
  namespace: string;
}

export type ModuleResult = {
  modules: {
    module: Module[]
  }
}