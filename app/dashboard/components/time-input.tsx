'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function TimeInput({
  value,
  onChange,
  disabled = false,
}: TimeInputProps) {
  const [hour, setHour] = useState('09')
  const [minute, setMinute] = useState('00')

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':')
      setHour(h)
      setMinute(m)
    }
  }, [value])

  useEffect(() => {
    onChange(`${hour}:${minute}`)
  }, [hour, minute, onChange])

  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, '0')
  )

  const minutes = ['00', '15', '30', '45']

  return (
    <div className='flex items-center space-x-1'>
      <Select value={hour} onValueChange={setHour} disabled={disabled}>
        <SelectTrigger className='w-[70px]'>
          <SelectValue placeholder='Hora' />
        </SelectTrigger>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span>:</span>
      <Select value={minute} onValueChange={setMinute} disabled={disabled}>
        <SelectTrigger className='w-[70px]'>
          <SelectValue placeholder='Min' />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
