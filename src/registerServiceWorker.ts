import { register } from 'register-service-worker'
import {environmentService} from "@/mixins/environment";

interface ServiceWorkerEventTarget extends EventTarget {
  state: string
}

const ServiceWorkerConsoleLog = (...args: string[]): void => {
  console.log("%cSERVICE WORKER: ",'color: #0000ff',...args)
}

const printServiceWorkerBaseAndEnv = ():void => {
  ServiceWorkerConsoleLog(`Service worker base: ${process.env.BASE_URL}, env: ${environmentService.getEnvironmentName()}`)
}

if (environmentService.isEnvironmentProduction() || environmentService.isEnvironmentTesting()) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      ServiceWorkerConsoleLog('App is being served from cache by a service worker.\n For more details, visit https://goo.gl/AFskqB')
      printServiceWorkerBaseAndEnv()
    },
    registered () {
      ServiceWorkerConsoleLog('Service worker has been registered. ')
      printServiceWorkerBaseAndEnv()
    },
    cached () {
      ServiceWorkerConsoleLog('Content has been cached for offline use. ')
      printServiceWorkerBaseAndEnv()
    },
    updatefound () {
      ServiceWorkerConsoleLog('New content is downloading.')
      printServiceWorkerBaseAndEnv()
    },
    updated(registration){
      ServiceWorkerConsoleLog('New content is available; please refresh.')
      printServiceWorkerBaseAndEnv()
      const waitingServiceWorker: ServiceWorker | null = registration.waiting;

      if (waitingServiceWorker) {
        waitingServiceWorker.addEventListener('statechange', (event: Event) => {
          if ((event.target as ServiceWorkerEventTarget).state === 'activated') {
            window.location.reload();
          }
        });
        waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      }
    },
    offline () {
      ServiceWorkerConsoleLog('No internet connection found. App is running in offline mode.')
      printServiceWorkerBaseAndEnv()
    },
    error (_error: Error) {
      ServiceWorkerConsoleLog('Error during service worker registration:')
      printServiceWorkerBaseAndEnv()
    }
  })
}
