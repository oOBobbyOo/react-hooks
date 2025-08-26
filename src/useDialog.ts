import { useState, useEffect, useRef, useCallback, RefObject } from 'react'

/**
 * 弹窗配置选项接口
 */
interface DialogOptions {
  /** 默认是否打开弹窗 */
  defaultOpen?: boolean
  /** 自动关闭延迟时间（毫秒），null 表示不自动关闭 */
  autoCloseDelay?: number | null
  /** 是否支持按 ESC 键关闭 */
  closeOnEscape?: boolean
  /** 是否支持点击外部区域关闭 */
  closeOnClickOutside?: boolean
  /** 弹窗打开时的回调函数 */
  onOpen?: () => void
  /** 弹窗关闭时的回调函数 */
  onClose?: () => void
}

/**
 * useDialog hook 返回值接口
 */
interface DialogReturn {
  /** 当前弹窗是否打开 */
  isOpen: boolean
  /** 打开弹窗的方法 */
  open: () => void
  /** 关闭弹窗的方法 */
  close: () => void
  /** 切换弹窗状态的方法 */
  toggle: () => void
  /** 弹窗元素的 ref，用于点击外部关闭功能 */
  dialogRef: RefObject<HTMLDivElement>
}

/**
 * useDialog - 用于管理弹窗状态的自定义 Hook
 * @param options 配置选项
 * @returns DialogReturn 弹窗控制对象
 */
const useDialog = (options: DialogOptions = {}): DialogReturn => {
  const {
    defaultOpen = false,
    autoCloseDelay = null,
    closeOnEscape = true,
    closeOnClickOutside = true,
    onOpen = null,
    onClose = null
  } = options

  const [isOpen, setIsOpen] = useState(defaultOpen)
  const dialogRef = useRef<HTMLDivElement>(null)
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 打开弹窗
  const open = useCallback(() => {
    setIsOpen(true)
    onOpen && onOpen()

    // 设置自动关闭定时器
    if (autoCloseDelay) {
      autoCloseTimerRef.current = setTimeout(() => {
        close()
      }, autoCloseDelay)
    }
  }, [autoCloseDelay, onOpen])

  // 关闭弹窗
  const close = useCallback(() => {
    setIsOpen(false)
    onClose && onClose()

    // 清除自动关闭定时器
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current)
      autoCloseTimerRef.current = null
    }
  }, [onClose])

  // 切换弹窗状态
  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  // ESC键关闭处理
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [closeOnEscape, isOpen, close])

  // 点击外部关闭处理
  useEffect(() => {
    if (!closeOnClickOutside || !isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        close()
      }
    }

    // 使用 setTimeout 确保点击事件在组件渲染后再绑定
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [closeOnClickOutside, isOpen, close])

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current)
      }
    }
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
    dialogRef // 需要绑定到弹窗元素上以支持点击外部关闭功能
  }
}

export default useDialog
