import { ChangeEvent, useState } from 'react'

const useInput = (initialValue: any) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value.trim())
  }

  const reset = () => setValue(initialValue)

  return {
    value,
    onChange: handleChange,
    reset
  }
}
export default useInput
