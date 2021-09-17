import emailRecovery from "./emailRecovery";
import token from "./token";
import theme from "./theme";
import members from "./members";
import publicContacts from "./publicContacts";

const reset = ()=>{
    localStorage.clear();
}

export default {
    emailRecovery,
    token,
    theme,
    members,
    publicContacts,
    reset
}
