/* eslint-disable */
// @ts-ignore

import { register } from 'register-service-worker'
import {environmentService} from "@/mixins/environment";

if (environmentService.isEnvironmentProduction() || environmentService.isEnvironmentTesting()) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready () {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB' + `base: ${process.env.BASE_URL}, env: ${environmentService.getEnvironmentName()}`
      )
    },
    registered () {
      console.log('Service worker has been registered. '+ `base: ${process.env.BASE_URL}, env: ${environmentService.getEnvironmentName()}`)
    },
    cached () {
      console.log('Content has been cached for offline use. '+ `base: ${process.env.BASE_URL}, env: ${environmentService.getEnvironmentName()}`)
    },
    updatefound () {
      console.log('New content is downloading.' + `base: ${process.env.BASE_URL}, env: ${environmentService.getEnvironmentName()}`)
    },
    // updated () {
    //   console.log('New content is available; please refresh.' + `base: ${process.env.BASE_URL}, env: ${environmentService.getEnvironmentName()}`)
    // },
    updated(registration){
      console.log('New content is available; please refresh.' + `base: ${process.env.BASE_URL}, env: ${environmentService.getEnvironmentName()}`)
      const waitingServiceWorker = registration.waiting;

      if (waitingServiceWorker) {
        waitingServiceWorker.addEventListener('statechange', event => {
          // @ts-ignore
          if (event.target.state === 'activated') {
            window.location.reload();
          }
        });
        waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      }
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.' + `base: ${process.env.BASE_URL}, env: ${environmentService.getEnvironmentName()}`)
    },
    error (error: Error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
