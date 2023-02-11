import { myConsole } from './myConsole'
import Vue from "vue";
const errorHandler = (err: Error, _vm: Vue, _info: string): void => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  myConsole.log('%cERROR HANDLER: ', 'color: #ff0000', err)
}

const warnHandler = (err: Error, _vm: Vue, _info: string): void => {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  myConsole.log('%cWARN HANDLER: ', 'color: #ff0000', err)
}

export default {
  errorHandler,
  warnHandler
}
