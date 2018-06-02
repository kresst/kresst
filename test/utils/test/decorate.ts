export const decorate = (decorators: any, target: Function): Function => {
    return Reflect.decorate(Array.isArray(decorators) ? decorators : [decorators], target);
};
