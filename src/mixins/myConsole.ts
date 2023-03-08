import { store } from '@/store/store'

export const myConsole = (function () {
  return {
    log: function (...args: unknown[]) {
      console.log(...args)
      store.commit('consoleStore/addConsoleLog', {
        text: args,
        time: new Date().getTime()
      })
    },
  }
}())
