const save = (token:string) => {
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
