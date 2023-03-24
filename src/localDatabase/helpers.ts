export const setWithExpiry = (key: string, value: unknown, ttl: number) => {
  const now = new Date()

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl
  }
  localStorage.setItem(key, JSON.stringify(item))
}

export const set = (key: string, value: unknown) =>{
  localStorage.setItem(key, JSON.stringify({value}))
}

export const get = (key: string) =>{
  const itemStr = localStorage.getItem(key)
  // if the item doesn't exist, return null
  if (!itemStr) {
    return {
      status: 'ERROR',
      data: null
    }
  }
  const item = JSON.parse(itemStr)

  return {
    status: 'OK',
    data: item.value
  }
}

export const getWithExpiry = (key: string) => {
  const itemStr = localStorage.getItem(key)
  // if the item doesn't exist, return null
  if (!itemStr) {
    return {
      status: 'ERROR',
      data: null
    }
  }
  const item = JSON.parse(itemStr)
  const now = new Date()
  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null
    localStorage.removeItem(key)
    return {
      status: 'EXPIRED',
      data: item.value
    }
  }
  return {
    status: 'OK',
    data: item.value
  }
}
