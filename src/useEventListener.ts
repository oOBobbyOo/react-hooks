import useLatest from './useLatest'
import useDeepCompareEffect from './useDeepCompareEffect'
import type { BasicTarget, TargetType } from './shared'
import { defaultWindow, useLatestElement, off, on } from './shared'

// MediaQueryList Event based useEventListener interface
function useEventListener<K extends keyof MediaQueryListEventMap>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  element: MediaQueryList,
  options?: boolean | AddEventListenerOptions
): void

// Window Event based useEventListener interface
function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element?: Window,
  options?: boolean | AddEventListenerOptions
): void

// Document Event based useEventListener interface
function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions
): void

// HTMLElement Event based useEventListener interface
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: T,
  options?: boolean | AddEventListenerOptions
): void

// Element Event based useEventListener interface
function useEventListener<K extends keyof ElementEventMap, T extends Element = Element>(
  eventName: K,
  handler: (event: ElementEventMap[K]) => void,
  element: T,
  options?: boolean | AddEventListenerOptions
): void

function useEventListener<
  KH extends keyof HTMLElementEventMap,
  KE extends keyof ElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  KW extends keyof WindowEventMap,
  KD extends keyof DocumentEventMap,
  T extends TargetType
>(
  eventName: KH | KE | KM | KW | KD | KH | string,
  handler: (
    event:
      | HTMLElementEventMap[KH]
      | ElementEventMap[KE]
      | MediaQueryListEventMap[KM]
      | WindowEventMap[KW]
      | DocumentEventMap[KD]
      | Event,
    ...p: any[]
  ) => void,
  element?: BasicTarget<T>,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useLatest(handler)
  const targetElementRef = useLatestElement(element, defaultWindow)

  useDeepCompareEffect(() => {
    // Define the listening target
    const targetElement = targetElementRef.current
    if (!(targetElement && targetElement.addEventListener)) return

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = (event) => savedHandler.current(event)

    on(targetElement, eventName, listener, options)

    // Remove event listener on cleanup
    return () => {
      off(targetElement, eventName, listener, options)
    }
  }, [eventName, targetElementRef.current, savedHandler, options])
}

export default useEventListener
