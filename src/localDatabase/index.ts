import emailRecovery from './emailRecovery'
import token from './token'
import theme from './theme'
import members from './members'
import publicContacts from './publicContacts'
import frontendSettings from './frontendSettings'
import myProfile from "./myProfile";
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
  myProfile,
  reset
}
