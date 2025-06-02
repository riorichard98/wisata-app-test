import { apiClient } from './client'

/**
 * TASK: use `apiClient` to fetch list of diary content
 *
 * @example
 * `GET /cms/diary?id=359007&id=358317&id=343275&status=posted`
 * 
 * Note that:
 * - `status` param must exist and have value of `'posted'`
 */
export async function getDiaryFeed() {
  const ids = [
    359007,
    358317,
    343275,
    342861,
    342723,
    342240,
    341343,
    296907,
    253782,
    177123,
  ]
  // new query params for ids & status
  const queryParams = new URLSearchParams()
  // iterate through ids for adding each id value into query param id
  ids.forEach(id => queryParams.append('id', id.toString()))
  // also add status=posted
  queryParams.append('status', 'posted')
  // final url with query params
  const endpoint = `/cms/diary?${queryParams.toString()}`
  // using apiClient.get for api call
  return apiClient.get(endpoint)
}

/**
 * TASK: use `apiClient` to fetch diary content by id
 *
 * @example
 * `GET /cms/diary?id=359007&status=posted`
 * 
 * Note that:
 * - `status` param must exist and have value of `'posted'`
 */
export async function getDiaryContentById(id) {
  // new query params for id & status
  const queryParams = new URLSearchParams()
  // append query param id and the value of the id
  queryParams.append('id', id)
  // also append status=posted
  queryParams.append('status', 'posted')
  // final url with query params
  const endpoint = `/cms/diary?${queryParams.toString()}`
  // using apiClient.get for api call
  return apiClient.get(endpoint)
}
