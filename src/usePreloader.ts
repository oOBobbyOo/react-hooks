import { useState, useEffect, useCallback, useRef } from 'react'
// @ts-ignore
import { LoadQueue } from 'preloadjs'

interface ManifestItem {
  id: string
  src: string
  type?: string
}

interface UsePreloaderOptions {
  autoStart?: boolean
  onComplete?: () => void
  onProgress?: (percent: number) => void
  onError?: (error: string) => void
}

interface LoadedAsset {
  src: string
  [key: string]: any
}

interface UsePreloaderReturn {
  isLoading: boolean
  progress: number
  assets: Record<string, LoadedAsset>
  error: string | null
  load: (manifests?: ManifestItem[]) => void
  getAsset: (id: string) => LoadedAsset | undefined
}

const usePreloader = (
  manifests: ManifestItem[] = [],
  options: UsePreloaderOptions = {}
): UsePreloaderReturn => {
  const { autoStart = true, onComplete, onProgress, onError } = options

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [assets, setAssets] = useState<Record<string, LoadedAsset>>({})
  const [error, setError] = useState<string | null>(null)

  const queueRef = useRef<LoadQueue | null>(null)

  // 初始化加载队列
  useEffect(() => {
    queueRef.current = new LoadQueue(true)

    // 设置事件监听
    queueRef.current.on('progress', (event: any) => {
      const percent = Math.round(event.progress * 100)
      setProgress(percent)
      onProgress?.(percent)
    })

    queueRef.current.on('fileload', (event: any) => {
      setAssets((prev) => ({
        ...prev,
        [event.item.id]: event.result
      }))
    })

    queueRef.current.on('complete', () => {
      setIsLoading(false)
      onComplete?.()
    })

    queueRef.current.on('error', (event: any) => {
      const errorMsg = `加载失败: ${event.item.id}`
      setError(errorMsg)
      onError?.(errorMsg)
    })

    return () => {
      if (queueRef.current) {
        queueRef.current.removeAllEventListeners()
        queueRef.current.close()
      }
    }
  }, [onComplete, onProgress, onError])

  // 开始加载
  const load = useCallback(
    (manifestsToLoad: ManifestItem[] = manifests) => {
      if (!queueRef.current || !manifestsToLoad.length) return

      setIsLoading(true)
      setProgress(0)
      setAssets({})
      setError(null)

      queueRef.current.loadManifest(manifestsToLoad)
    },
    [manifests]
  )

  // 获取资源
  const getAsset = useCallback(
    (id: string): LoadedAsset | undefined => {
      return assets[id]
    },
    [assets]
  )

  // 自动开始加载
  useEffect(() => {
    if (autoStart && manifests.length > 0) {
      load(manifests)
    }
  }, [manifests, autoStart, load])

  return {
    isLoading,
    progress,
    assets,
    error,
    load,
    getAsset
  }
}

export default usePreloader
