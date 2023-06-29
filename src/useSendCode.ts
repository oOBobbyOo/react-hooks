import { useMemo, useRef, useState } from 'react'

interface IOptions {
  cb: (mobile: string) => void
  time?: number
}

type ReturnType = [disable: boolean, btnText: string, sendCode: (mobile: string) => void]

const useSendCode = ({ cb, time = 60 }: IOptions): ReturnType => {
  // 是否发送验证码
  const isSendCode = useRef<boolean>(false)
  // 按钮是否可见
  const disable = useMemo(() => isSendCode.current, [isSendCode.current])
  // 按钮文本
  const [btnText, setBtnText] = useState<string>('发送验证码')
  // 倒计时
  const remainSecond = useRef<number>(time)
  // 计时器对象
  const timer = useRef<number | null>(null)

  // 倒计时
  const countDown = () => {
    setBtnText(`已发送（${remainSecond.current}秒后可重新发送）`)

    timer.current = setInterval(() => {
      remainSecond.current -= 1
      setBtnText(`已发送（${remainSecond.current}秒后可重新发送）`)

      // 计数为0时取消计时器
      if (remainSecond.current <= 0 && timer.current !== null) {
        clearInterval(timer.current)
        remainSecond.current = time
        isSendCode.current = false
        setBtnText(`重新发送`)
      }
    }, 1000)
  }

  // 点击发送验证码
  const sendCode = async (mobile: string) => {
    // 判断是否输入手机号
    if (!mobile) return

    // 防止连点
    if (isSendCode.current) return
    isSendCode.current = true

    // 发送请求
    await cb(mobile)

    // 倒计时
    countDown()
  }

  return [disable, btnText, sendCode]
}

export default useSendCode
