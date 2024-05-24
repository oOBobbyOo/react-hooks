const getMobileDetect = (userAgent: string) => {
  const isAndroid = (): boolean => Boolean(userAgent.match(/Android|Adr/i))
  const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod|iOS/i))

  return {
    isAndroid: isAndroid(),
    isIos: isIos()
  }
}

const useMobileDevice = () => {
  const userAgent = window.navigator.userAgent
  return getMobileDetect(userAgent)
}

export default useMobileDevice
