import { useEffect, useState } from 'react'
import FingerprintJS, { type Agent } from '@fingerprintjs/fingerprintjs'

interface Trace {
  userAgent: string
  browser: string
  screenResolution: string
  os: string
  visitorId: string
  extProps: string
}

function useFingerprint() {
  const [trace, setTrace] = useState<Trace>()

  useEffect(() => {
    const fpPromise = FingerprintJS.load()
    fpPromise
      .then((fp: Agent) => fp.get())
      .then((result: any) => {
        const userAgent = window.navigator.userAgent
        const browser = result.components?.vendorFlavors?.value?.toString()
        const screenResolution = result.components?.screenResolution?.value?.toString()
        const os = result.components?.platform?.value
        const visitorId = result.visitorId

        const trace = {
          userAgent,
          browser,
          screenResolution,
          os,
          visitorId,
          extProps: ''
        }

        setTrace(trace)
      })
  }, [])

  return {
    trace
  }
}

export default useFingerprint
