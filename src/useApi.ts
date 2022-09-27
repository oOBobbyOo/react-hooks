import { useMemo } from 'react'
import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import { stringify } from 'qs'

interface Config extends Omit<SWRConfiguration, 'shouldFetch'> {
  shouldFetch?: boolean
}

const useApi = (
  fetcher: (params?: any) => Promise<SWRResponse>,
  params?: any,
  { shouldFetch, ...config }: Config = {}
) => {
  const shouldPullRequest = useMemo(() => {
    if (shouldFetch !== undefined) return shouldFetch
    return true
  }, [shouldFetch])

  // key 为 null 时， 不会发出请求
  const key = useMemo(() => {
    try {
      let key = null

      if (shouldPullRequest && typeof fetcher === 'function') {
        key = `${fetcher.name}${stringify(params)}`
      }

      return key
    } catch (err) {
      console.log({ useApiError: err })
    }
  }, [shouldPullRequest, fetcher, params])

  const { data, mutate, error, isValidating } = useSWR(key, () => fetcher(params), {
    // 错误后3秒内重试，最多三次
    shouldRetryOnError: true,
    errorRetryInterval: 2000,
    errorRetryCount: 1,

    // 2秒内不发出重复请求
    dedupingInterval: 2000,

    revalidateOnReconnect: true, // 断网重连后自动请求
    revalidateOnMount: true, // 所在组件挂载时自动更新， 如果不设置， 却传了 initialData 会自动设置为 false
    revalidateOnFocus: false, // 聚焦时自动请求

    ...config // 重写默认配置
  })

  return {
    data,
    reload: mutate,
    error,
    loading: Boolean(key && !error && isValidating)
  }
}

export default useApi
