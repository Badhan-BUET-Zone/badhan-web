import { store } from '@/store/store'

export const myConsole = (function () {
  return {
    // eslint-disable-next-line
    log: function (...args: any[]) {
      console.log(...args)
      store.commit('consoleStore/addConsoleLog', {
        text: args,
        time: new Date().getTime()
      })
    },
  }
}())
