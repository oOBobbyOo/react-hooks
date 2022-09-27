import { useEffect, useState } from 'react'
import { debounce } from 'lodash-es'

function genMediaQueryStr(list: number[]) {
  const result: string[] = []
  if (!Array.isArray(list) || list.length === 0) return result

  // 去重 => 只保留数字 => 排序
  const limits = Array.from(new Set(list))
    .map((el) => Number(el))
    .filter((el) => !isNaN(el) && el > 0)
    .sort((a, b) => a - b)

  if (limits.length === 0) return result

  // 第一个分割点
  result.push(`(max-width: ${limits[0]}px)`)

  // 中间点
  for (let i = 0; i < limits.length - 1; i++) {
    result.push(`(min-width: ${limits[i] + 1}px) and (max-width: ${limits[i + 1]}px)`)
  }

  // 结束点
  if (limits.length > 1) result.push(`(min-width: ${limits[limits.length - 1] + 1}px)`)

  return result
}

const useMediaQuery = (limits = [768, 1024, 1440, 1920]) => {
  const [matchList, setMatchList] = useState<boolean[]>()

  useEffect(() => {
    const mediaQueryStrList = genMediaQueryStr(limits)

    if (mediaQueryStrList.length > 0) {
      const mediaList = mediaQueryStrList.map(window.matchMedia)

      // 第一次判断
      setMatchList(mediaList.map((m) => m.matches))

      // 保存全部监听函数， 用于移除监听
      const onChangeList = mediaQueryStrList.map((_, i) => {
        // 防抖
        const onChange = debounce((ev) => {
          if (ev.matches) {
            // 只有一个 true, 无需更细致的判断
            const newMatchList = mediaList.map(() => false)
            newMatchList[i] = true

            setMatchList(newMatchList)
          }
        }, 100)

        // 监听变化
        mediaList[i].addEventListener('change', onChange)
        return onChange
      })

      return () => {
        // 卸载 hook 时移除监听
        mediaList.forEach((currMedia, i) =>
          currMedia.removeEventListener('change', onChangeList[i])
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return matchList
}

export default useMediaQuery
