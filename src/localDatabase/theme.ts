const save = (themeStatus: boolean) => {
  localStorage.setItem('darkTheme', String(themeStatus))
}
const load = () => {
  return localStorage.getItem('darkTheme') === 'true'
}
const clear = () => {
  localStorage.removeItem('darkTheme')
}

export default {
  save, load, clear
}
