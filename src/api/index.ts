/*
This module handles all necessary tasks to communicate with the backend.
Current active backends are- an express app and firebase realtime database
 */
import axios, {AxiosError, AxiosResponse} from 'axios'

import { store } from '@/store/store'
import { processError } from '@/mixins/helpers'
import { myConsole } from '@/mixins/myConsole'
import { environmentService} from "@/mixins/environment";

const baseURL = environmentService.getAPIBaseURL()

myConsole.log('%cENVIRONMENT: ','color: #ffff00', 'name ' ,environmentService.getEnvironmentName())

const badhanAxios = axios.create({
  baseURL
})

const CancelToken = axios.CancelToken

const enableGuestAPI = () => {
  badhanAxios.defaults.baseURL += '/guest'
}

const resetBaseURL = () => {
  badhanAxios.defaults.baseURL = baseURL
}

const isGuestEnabled = () => {
  return badhanAxios.defaults.baseURL?.includes('/guest')
}

const firebaseAxios = axios.create({
  baseURL: 'https://badhan-buet-default-rtdb.firebaseio.com'
})

badhanAxios.interceptors.request.use((config) => {
  // Do something before request is sent
  myConsole.log('%cAPI:', 'color: #ff00ff',' REQUEST TO ' + config.method + ' ' + config.url + ': ', config.data, config.params)

  store.dispatch('notification/clearNotification')

  config.headers = {
    'x-auth': store.getters.getToken
  }

  if (window.navigator.onLine) {
    return config
  }

  store.dispatch('notification/notifyError', 'Network Not Available')

  return {
    ...config,
    cancelToken: new CancelToken((cancel) => cancel('Network Unavailable'))
  }
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

badhanAxios.interceptors.response.use((response) => {
  // Do something before request is sent
  myConsole.log('%cAPI:', 'color: #00ff00',' RESPONSE FROM ' + response.config.method + ' ' + response.config.url + ': ', response)
  return response
}, (error) => {
  // Do something with request error
  let errorNotification
  if (error.response && error.response.data) {
    store.commit('consoleStore/addConsoleLog', {
      text: error.response,
      time: new Date().getTime()
    })
    errorNotification = processError(error)
  } else if (axios.isCancel(error)) {
    errorNotification = 'Network Unavailable'
  } else {
    errorNotification = 'Unknown Error Occurred'
  }
  myConsole.log('Axios Error:', errorNotification)

  store.dispatch('notification/notifyError', errorNotification)
  return Promise.reject(error)
})

export interface BadhanAxiosResponseDataInterface {
  status: string,
  statusCode: number,
  message: string
}

export interface BadhanAxiosResponseInterface<T extends BadhanAxiosResponseDataInterface> extends AxiosResponse {
  data: T
  status: number
}

export interface BadhanAxiosErrorInterface<T extends BadhanAxiosResponseDataInterface> extends AxiosError {
  response: BadhanAxiosResponseInterface<T>
}

firebaseAxios.interceptors.request.use((config) => {
  // Do something before request is sent
  myConsole.log('%cAPI:', 'color: #ff00ff',' REQUEST TO ' + config.url + ': ', config.data)

  store.dispatch('notification/clearNotification')

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

firebaseAxios.interceptors.response.use((response) => {
  // Do something before request is sent
  myConsole.log('%cAPI:', 'color: #00ff00',' RESPONSE FROM ' + response.config.url + ': ', response)
  return response
}, (error) => {
  // Do something with request error
  store.dispatch('notification/notifyError', processError(error))
  return Promise.reject(error)
})

/// //////////////////////ROUTES////////////////////////////////////////////////////
/*
CONVENTIONS TO BE FOLLOWED
* No notifications will be sent from here
* Return response in case of successful api calls and return error.response in case of error cases.
* Method names must match with the corresponding route controller of backend
* Always send an object as payload in these methods
* All API calls must be done from this file
 */

export interface PATCHDonorsDesignationPayloadInterface {
  donorId: string
  promoteFlag: boolean
}

const handlePATCHDonorsDesignation = async (payload: PATCHDonorsDesignationPayloadInterface) => {
  try {
    return await badhanAxios.patch('/donors/designation', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface PATCHUsersPasswordPayloadInterface {
  password: string
}
const handlePATCHUsersPassword = async (payload: PATCHUsersPasswordPayloadInterface) => {
  try {
    return await badhanAxios.patch('/users/password', payload)
  } catch (error) {
    return null
  }
}
export interface DELETEDonorsPayloadInterface {
  donorId: string
}
const handleDELETEDonors = async (payload: DELETEDonorsPayloadInterface) => {
  try {
    return await badhanAxios.delete('/donors', { params: payload })
  } catch (error) {
    return (error as AxiosError<Error>).response
  }
}
export interface POSTDonorsPasswordPayloadInterface {
  donorId: string
}
const handlePOSTDonorsPasswordRequest = async (payload: POSTDonorsPasswordPayloadInterface) => {
  try {
    return await badhanAxios.post('/donors/password', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface GETDonorsDuplicatePayloadInterface {
  phone: string
}
const handleGETDonorsDuplicate = async (payload: GETDonorsDuplicatePayloadInterface) => {
  try {
    const response = await badhanAxios.get('/donors/checkDuplicate', { params: payload })
    return response.data
  } catch (e) {
    return null
  }
}
export interface GETLogsByDatePayloadInterface {
  timeStamp: number
}
const handleGETLogsByDate = async (payload: GETLogsByDatePayloadInterface) => {
  try {
    const response = await badhanAxios.get(`/log/date/${payload.timeStamp}`)
    return response.data.logs
  } catch (e) {
    return null
  }
}
const handleGETLogs = async () => {
  try {
    const response = await badhanAxios.get('/log')
    return response.data.logs
  } catch (e) {
    return null
  }
}
const handleDELETESignOut = async () => {
  try {
    const response = await badhanAxios.delete('/users/signout', {})
    return response.data
  } catch (e) {
    return null
  }
}
const handleDELETESignOutAll = async () => {
  try {
    const response = await badhanAxios.delete('/users/signout/all')
    return response.data
  } catch (e) {
    return null
  }
}
const handlePOSTRedirection = async () => {
  try {
    return await badhanAxios.post('/users/redirection')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface PATCHRedirectionAuthenticationPayloadInterface {
  token: string
}
const handlePATCHRedirectedAuthentication = async (payload: PATCHRedirectionAuthenticationPayloadInterface) => {
  try {
    return await badhanAxios.patch('/users/redirection', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
const handleGETDonorsMe = async () => {
  try {
    return await badhanAxios.get('/users/me')
  } catch (e) {
    if (axios.isCancel(e)) {
      return {
        status: 503,
        message: e.message,
        data: null
      }
    }
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface POSTSignInPayloadInterface {
  phone: number,
  password: string
}
const handlePOSTSignIn = async (payload: POSTSignInPayloadInterface) => {
  try {
    const response = await badhanAxios.post('/users/signin', payload)
    return response.data
  } catch (e) {
    return null
  }
}
export interface POSTDonorsPayloadInterface {
  name: string,
  phone: number,
  bloodGroup: number,
  hall: number,
  studentId: number,
  address: string,
  roomNumber: string,
  comment: string,
  lastDonation: number,
  extraDonationCount: number,
  availableToAll: boolean
}
const handlePOSTDonors = async (payload: POSTDonorsPayloadInterface) => {
  try {
    return await badhanAxios.post('/donors', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface POSTDonationsPayloadInterface {
  donorId: string
  date: number
}
const handlePOSTDonations = async (payload: POSTDonationsPayloadInterface) => {
  try {
    return await badhanAxios.post('/donations', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface GETDonorsPayloadInterface {
  donorId: string
}
const handleGETDonors = async (payload: GETDonorsPayloadInterface) => {
  try {
    return await badhanAxios.get('/donors', { params: payload })
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface GETSearchPayloadInterface {
  name: string
  bloodGroup: number
  batch: string
  hall: number
  isAvailable: boolean
  isNotAvailable: boolean
  address: string
  availableToAll: boolean
}
const handleGETSearchV3 = async (payload: GETSearchPayloadInterface) => {
  try {
    return await badhanAxios.get('/search/v3', { params: payload })
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}

const handleGETStatistics = async () => {
  try {
    return await badhanAxios.get('/log/statistics')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
const handleDELETELogs = async () => {
  try {
    return await badhanAxios.delete('/log')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
const handleGETDonorDesignatedAll = async () => {
  try {
    return await badhanAxios.get('/donors/designation/all')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface GETLogsByDateAndDonorPayloadInterface {
  timeStamp: number
  donorId: string
}
const handleGETLogsByDateAndDonor = async (payload: GETLogsByDateAndDonorPayloadInterface) => {
  try {
    return await badhanAxios.get(`/log/date/${payload.timeStamp}/donorId/${payload.donorId}`)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface PATCHDonorsCommentPayloadInterface {
  donorId: string
  comment: string
}
const handlePATCHDonorsComment = async (payload: PATCHDonorsCommentPayloadInterface) => {
  try {
    return await badhanAxios.patch('/donors/comment', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface PATCHDonorsPayloadInterface {
  donorId: string,
  name: string,
  phone: number,
  studentId: string,
  email: string,
  bloodGroup: number,
  hall: number,
  roomNumber: string,
  address: string,
  availableToAll: boolean
}
const handlePATCHDonors = async (payload: PATCHDonorsPayloadInterface) => {
  try {
    return await badhanAxios.patch('/donors/v2', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface PATCHAdminsPayloadInterface {
  donorId: string
}
const handlePATCHAdmins = async (payload: PATCHAdminsPayloadInterface) => {
  try {
    return await badhanAxios.patch('/admins', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface DELETEDonationsPayloadInterface {
  date: number
}
const handleDELETEDonations = async (payload: DELETEDonationsPayloadInterface) => {
  try {
    return await badhanAxios.delete('/donations', { params: payload })
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface POSTCallRecordPayloadInterface {
  donorId: string
}
const handlePOSTCallRecord = async (payload: POSTCallRecordPayloadInterface) => {
  try {
    return await badhanAxios.post('/callrecords', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface DELETECalLRecordPayloadInterface {
  donorId: string
  callRecordId: string
}
const handleDELETECallRecord = async (payload: DELETECalLRecordPayloadInterface) => {
  try {
    return await badhanAxios.delete('/callrecords', { params: payload })
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface POSTPasswordForgetPayloadInterface {
  phone: number
}
const handlePOSTPasswordForgot = async (payload: POSTPasswordForgetPayloadInterface) => {
  try {
    return await badhanAxios.post('/users/password/forgot', { phone: payload.phone })
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
const handleGETDonorsDesignation = async () => {
  try {
    return await badhanAxios.get('/donors/designation')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}

const handleGETPublicContacts = async () => {
  try {
    return await badhanAxios.get('/publicContacts')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface POSTPublicContactsPayloadInterface {
  donorId: string
  bloodGroup: number
}
const handlePOSTPublicContacts = async (payload: POSTPublicContactsPayloadInterface) => {
  try {
    return await badhanAxios.post('/publicContacts', payload)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface DELETEPublicContactsPayloadInterface {
  donorId: string
}
const handleDELETEPublicContacts = async (payload: DELETEPublicContactsPayloadInterface) => {
  try {
    return await badhanAxios.delete('/publicContacts', { params: payload })
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}

const handleGETLogins = async () => {
  try {
    return await badhanAxios.get('/users/logins')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface DELETELoginsPayloadInterface {
  tokenId: string
}
const handleDELETELogins = async (payload: DELETELoginsPayloadInterface) => {
  try {
    return await badhanAxios.delete(`/users/logins/${payload.tokenId}`)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface POSTActiveDonorsPayloadInterface {
  donorId: string
}
const handlePOSTActiveDonors = async (payload: POSTActiveDonorsPayloadInterface) => {
  try {
    return await badhanAxios.post('/activeDonors', { donorId: payload.donorId })
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface DELETEActiveDonorsPayloadInterface {
  donorId: string
}
const handleDELETEActiveDonors = async (payload: DELETEActiveDonorsPayloadInterface) => {
  try {
    return await badhanAxios.delete(`/activeDonors/${payload.donorId}`)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
export interface GETActiveDonorsPayloadInterface {
  name: string,
  bloodGroup: number,
  batch: string,
  hall: number,
  isAvailable: boolean,
  isNotAvailable: boolean,
  address: string,
  availableToAll: boolean,
  markedByMe: boolean,
  availableToAllOrHall: boolean
}
const handleGETActiveDonors = async (payload: GETActiveDonorsPayloadInterface) => {
  try {
    return await badhanAxios.get(`/activeDonors?bloodGroup=${payload.bloodGroup}&hall=${payload.hall}&batch=${payload.batch}&name=${payload.name}&address=${payload.address}&isAvailable=${payload.isAvailable}&isNotAvailable=${payload.isNotAvailable}&availableToAll=${payload.availableToAll}&markedByMe=${payload.markedByMe}&availableToAllOrHall=${payload.availableToAllOrHall}`)
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}

/// ///////////////////////FIREBASE API CALLS ////////////////////////
const handleGETCredits = async () => {
  try {
    return await firebaseAxios.get('/contributors.json')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
const handleGETContributors = async () => {
  try {
    return await firebaseAxios.get('/data.json')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}
const handleGETFrontendSettings = async () => {
  try {
    return await firebaseAxios.get('/frontendSettings.json')
  } catch (e) {
    return (e as BadhanAxiosErrorInterface<BadhanAxiosResponseDataInterface>).response
  }
}

export {
  badhanAxios,
  firebaseAxios,
  enableGuestAPI,
  resetBaseURL,
  isGuestEnabled,

  /// ////////////////ROUTES////////////
  handlePATCHDonorsDesignation,
  handlePATCHUsersPassword,
  handleDELETEDonors,
  handlePOSTDonorsPasswordRequest,
  handleGETDonorsDuplicate,
  handleGETLogsByDate,
  handleGETLogs,
  handleDELETESignOut,
  handleDELETESignOutAll,
  handlePOSTRedirection,
  handlePATCHRedirectedAuthentication,
  handleGETDonorsMe,
  handlePOSTSignIn,
  handlePOSTDonors,
  handlePOSTDonations,
  handleGETDonors,
  handleGETSearchV3,
  handleGETStatistics,
  handleDELETELogs,
  handleGETDonorDesignatedAll,
  handleGETCredits,
  handleGETLogsByDateAndDonor,
  handlePATCHDonorsComment,
  handlePATCHDonors,
  handlePATCHAdmins,
  handleDELETEDonations,
  handlePOSTCallRecord,
  handleDELETECallRecord,
  handlePOSTPasswordForgot,
  handleGETDonorsDesignation,
  handleGETPublicContacts,
  handlePOSTPublicContacts,
  handleDELETEPublicContacts,
  handleGETLogins,
  handleDELETELogins,
  handlePOSTActiveDonors,
  handleDELETEActiveDonors,
  handleGETActiveDonors,

  // firebase methods
  handleGETFrontendSettings,
  handleGETContributors
}
