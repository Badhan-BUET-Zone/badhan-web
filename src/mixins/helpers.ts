// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { saveAs } from 'file-saver'
import { bloodGroups, halls } from './constants'

export const processError = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message
  }
  return 'Unknown error occurred'
}

export const convertObjectToCSV = (objArray, keys, delimiter) => {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = keys.join(delimiter) + delimiter + '\r\n'

  for (let i = 0; i < array.length; i++) {
    let line = ''
    keys.forEach((key) => {
      line += (array[i][key] !== undefined ? (String(array[i][key]).replace(/,|;|\n/gi, '.')) : '') + delimiter
    })
    str += line + '\r\n'
  }
  return str
}

export const textFileDownloadInWeb = (text, fileName) => {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
  // saveAs(blob, fileName)
  const url = window.URL.createObjectURL(blob, { oneTimeOnly: true });

  const anchor = document.createElement('a');
  // anchor.setAttribute('download', fileName);
  anchor.href = url;
  anchor.target = '_blank';
  anchor.click();
}

export const processPersonsForReport = (persons) => {
  persons.forEach((person) => {
    person['Blood Group'] = bloodGroups[person.bloodGroup]
    person['Donation Count'] = person.donationCount
    person.Hall = halls[person.hall]
    const date = new Date(person.lastDonation)
    person['Last Donation'] = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
  })
  return persons
}

export const directCall = (phoneNumber) => {
  document.location.href = 'tel:+' + phoneNumber
}

export const fixBackSlash = (text) => {
  return text.replaceAll('&#x2F;', '/')
}

export const isAppVersionBackdated = (appVersion, remoteVersion) => {
  const appVersionSegments = appVersion.split('.')
  const remoteVersionSegments = remoteVersion.split('.')
  const appVersionNumber = parseInt(appVersionSegments[0]) * 10000 + parseInt(appVersionSegments[1]) * 100 + parseInt(appVersionSegments[2])
  const remoteVersionNumber = parseInt(remoteVersionSegments[0]) * 10000 + parseInt(remoteVersionSegments[1]) * 100 + parseInt(remoteVersionSegments[2])
  return remoteVersionNumber > appVersionNumber
}
