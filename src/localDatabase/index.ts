/* eslint-disable */
import emailRecovery from './emailRecovery'
import token from './token'
import theme from './theme'
import members from './members'
import publicContacts from './publicContacts'
import frontendSettings from './frontendSettings'

const reset = () => {
  localStorage.clear()
}

export default {
  emailRecovery,
  token,
  theme,
  members,
  publicContacts,
  frontendSettings,
  reset
}
