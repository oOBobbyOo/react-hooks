import { ChangeEvent, useState } from 'react'

const useInputNumberState = (defaultVal = ''): [string, (e: any) => void] => {
  // 移除字符前面的零
  const removeZeros = (str: string) => {
    return str.replace(/^0+/, '')
  }

  const [numVal, setNumVal] = useState(defaultVal)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target || {}
    const val = value.replace(/[^\d]/g, '')
    setNumVal(removeZeros(val))
  }

  return [numVal, handleChange]
}

export default useInputNumberState
