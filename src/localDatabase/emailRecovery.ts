const save = () => {
  localStorage.setItem('passwordEmailRecoveryTimestamp', String(new Date().getTime()))
}
const load = () => {
  const result = localStorage.getItem('passwordEmailRecoveryTimestamp')
  if (!result) return null
  return parseInt(result)
}
const clear = () => {
  localStorage.removeItem('passwordEmailRecoveryTimestamp')
}

export default {
  save, load, clear
}
