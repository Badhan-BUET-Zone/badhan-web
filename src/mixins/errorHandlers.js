import { store } from '../store/store'
const errorHandler = (err, vm, info) => {
  // err: error trace
  // vm: component in which error occured
  // info: Vue specific error information such as lifecycle hooks, events etc.
  console.log('%cERROR HANDLER: ', 'color: #ff0000', err)
  store.commit('errorStore/addError', err)
}

const warnHandler = (err, vm, info) => {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in. Only available in 2.2.0+
  console.log('%cWARN HANDLER: ', 'color: #ff0000', err)
  // console.log({name: "Warning",message: err,stack:info})
  // store.commit('errorStore/addError', {name: "Warning",message: err,stack:info});
}

export default {
  errorHandler,
  warnHandler
}
