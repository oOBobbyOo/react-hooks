import { useState, useEffect, useCallback, useRef } from 'react'
import { rafThrottle } from './shared'

interface UseScrollToTopOptions {
  threshold?: number // 显示按钮的滚动阈值（像素），默认 100
  duration?: number // 滚动动画持续时间（毫秒），默认500
  behavior?: string //  滚动行为 'smooth' | 'auto'， 默认'smooth'
}

interface UseScrollToTopReturn {
  isVisible: boolean // 按钮是否可见
  scrollToTop: () => void // 滚动到顶部的函数
  isScrolling: boolean // 是否正在滚动中
}

const useScrollToTop = (options: UseScrollToTopOptions = {}): UseScrollToTopReturn => {
  const { threshold = 100, duration = 300, behavior = 'smooth' } = options

  const [isVisible, setIsVisible] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollAnimationRef = useRef<number | null>(null)

  // 监听滚动事件 - 使用RAF节流
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop
      setIsVisible(scrollY > threshold)
    }

    // 使用RAF节流优化滚动事件
    const throttledHandleScroll = rafThrottle(handleScroll)

    // 初始执行
    throttledHandleScroll()

    // 使用passive提升滚动性能
    window.addEventListener('scroll', throttledHandleScroll, {
      passive: true
    })

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      throttledHandleScroll.cancel()
    }
  }, [threshold])

  // 平滑滚动到顶部
  const scrollToTop = useCallback(() => {
    if (isScrolling) return

    setIsScrolling(true)

    // 取消之前的动画
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current)
    }

    if (behavior === 'smooth' && 'scrollBehavior' in document.documentElement.style) {
      // 使用原生smooth滚动
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })

      // 监听滚动结束
      const checkIfScrollEnded = rafThrottle(() => {
        if (window.pageYOffset === 0) {
          setIsScrolling(false)
          checkIfScrollEnded.cancel()
        } else {
          scrollAnimationRef.current = requestAnimationFrame(checkIfScrollEnded)
        }
      })

      scrollAnimationRef.current = requestAnimationFrame(checkIfScrollEnded)
    } else {
      // 自定义动画滚动（兼容不支持smooth的浏览器）
      const startTime = performance.now()
      const startScrollY = window.pageYOffset || document.documentElement.scrollTop

      // 缓动函数：easeInOutCubic
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      }

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        const currentScrollY = startScrollY * (1 - easeInOutCubic(progress))

        window.scrollTo(0, currentScrollY)

        if (progress < 1) {
          scrollAnimationRef.current = requestAnimationFrame(animateScroll)
        } else {
          setIsScrolling(false)
          scrollAnimationRef.current = null
        }
      }

      scrollAnimationRef.current = requestAnimationFrame(animateScroll)
    }
  }, [behavior, duration, isScrolling])

  // 清理动画
  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
      }
    }
  }, [])

  return {
    isVisible,
    scrollToTop,
    isScrolling
  }
}

export default useScrollToTop
