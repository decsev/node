const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
    headers = {}
  } = options;

  const cloneData = data;

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
        headers
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData
      })
    case 'post':
      return axios.post(url, cloneData, { headers })
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

function request(options) {

  return fetch(options).then((response) => {
    const { statusText, status } = response
    let data = response.data
    if (data instanceof Array) {
      data = {
        list: data
      }
    }
    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data
    })
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      msg = data.message || statusText
    } else {
      statusCode = 600
      msg = error.message || 'Network Error'
    }
    return Promise.reject({ success: false, statusCode, message: msg })
  })
}