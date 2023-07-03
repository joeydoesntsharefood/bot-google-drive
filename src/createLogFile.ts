import { inspect } from 'util';

export const createLogFile = (array: any[]) => {
  console.log(inspect(array, { showHidden: false, depth: null }));
};
