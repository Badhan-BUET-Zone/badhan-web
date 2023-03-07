import { saveAs } from 'file-saver'
import { bloodGroups, halls } from './constants'
import {PersonInterface} from "@/store/home";
import {BadhanAxiosErrorInterface} from "@/api";


export const processError = (error: BadhanAxiosErrorInterface) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message
  }
  return 'Unknown error occurred'
}

export const convertObjectToCSV = (objArray:object[], keys: string[], delimiter:string) => {
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

export const textFileDownloadInWeb = (text: string, fileName: string) => {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, fileName)
}

interface PersonForReportInterface extends PersonInterface{
  'Blood Group':string,
  'Donation Count': number,
  'Last Donation': string,
  Hall: string
}

export const processPersonsForReport = (persons: PersonInterface[]) => {
  const personsForReport:PersonForReportInterface[] = []
  persons.forEach((person) => {
    const newPersonForReport: PersonForReportInterface = JSON.parse(JSON.stringify(person))
    newPersonForReport['Blood Group'] = bloodGroups[person.bloodGroup]
    newPersonForReport['Donation Count'] = person.donationCount
    newPersonForReport.Hall = halls[person.hall]
    const date = new Date(person.lastDonation)
    newPersonForReport['Last Donation'] = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
    personsForReport.push(newPersonForReport)
  })
  return personsForReport
}

export const directCall = (phoneNumber: number) => {
  window.open('tel:+' + phoneNumber, 'popup','width=600,height=600')
}

export const fixBackSlash = (text: string) => {
  return text.replaceAll('&#x2F;', '/')
}
