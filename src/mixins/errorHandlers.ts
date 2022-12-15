// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable */
import { myConsole } from './myConsole'
const errorHandler = (err, vm, info) => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  myConsole.log('%cERROR HANDLER: ', 'color: #ff0000', err)
}

const warnHandler = (err, vm, info) => {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  myConsole.log('%cWARN HANDLER: ', 'color: #ff0000', err)
}

export default {
  errorHandler,
  warnHandler
}
