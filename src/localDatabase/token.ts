// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const save = (token) => {
  localStorage.setItem('x-auth', token)
}
const load = () => {
  return localStorage.getItem('x-auth')
}
const clear = () => {
  localStorage.removeItem('x-auth')
}

export default {
  save, load, clear
}
