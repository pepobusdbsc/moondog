import fetch from 'node-fetch'

const apiUrl = process.env.REACT_APP_IDO_API

export function httpGet<T>(url: string): Promise<T>{
  return fetch(`${apiUrl}/api${url}`).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  })
}

export function httpPost<T>(url: string, data): Promise<T>{
  return fetch(`${apiUrl}/api${url}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json',},
    body: JSON.stringify(data)
    }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  })
}

export function httpPostUrl<T>(url: string): Promise<T>{
  return fetch(`${apiUrl}/api${url}`, {
    method: 'POST',
    }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  })
}
