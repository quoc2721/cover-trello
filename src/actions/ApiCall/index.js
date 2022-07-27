import axios from 'axios'
import { API_ROOT } from 'utilities/contants'

export const fetchBoardDetails = async (id) => {
  const request = await axios.get(`${API_ROOT}/v1/boards/${id}`)
  return request.data
}

// export const createNewColumn = async (data) => {
//     const request = await axios.post(`http://localhost:5000/v1/columns/`, data)
//     return request.data
//   }
