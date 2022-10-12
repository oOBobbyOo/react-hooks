import { ChangeEvent, useState } from 'react'

const useInput = (initialValue: any) => {
  const [value, setValue] = useState(initialValue)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value.trim())
  }

  return {
    value,
    onChange: handleChange
  }
}
export default useInput
