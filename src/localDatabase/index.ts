import token from './token'
import theme from './theme'
import members from './members'
import publicContacts from './publicContacts'
import frontendSettings from './frontendSettings'
import myProfile from "./myProfile";
import donationCountYearMonth from './donationCountYearMonth'
const reset = () => {
  localStorage.clear()
}

export default {
  token,
  theme,
  members,
  publicContacts,
  frontendSettings,
  myProfile,
  donationCountYearMonth,
  reset
}
