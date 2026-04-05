import * as React from 'react'
import { cn } from '../../lib/utils'

const OTPContext = React.createContext({ maxLength: 6, value: "", onChange: () => {} })

export function InputOTP({ maxLength, value, onChange, children, className }) {
  const [internalValue, setInternalValue] = React.useState(value || "")
  
  React.useEffect(() => {
    setInternalValue(value || "")
  }, [value])

  const handleChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, maxLength)
    setInternalValue(val)
    if (onChange) onChange(val)
  }

  return (
    <OTPContext.Provider value={{ maxLength, value: internalValue, onChange: handleChange }}>
      <div className={cn("relative flex items-center justify-center", className)}>
        {/* Hidden input to capture natively */}
        <input 
          type="text" 
          value={internalValue} 
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          maxLength={maxLength}
        />
        {children}
      </div>
    </OTPContext.Provider>
  )
}

export function InputOTPGroup({ className, children }) {
  return <div className={cn("flex items-center gap-2", className)}>{children}</div>
}

export function InputOTPSlot({ index, className }) {
  const { value } = React.useContext(OTPContext)
  const char = value[index] || ""
  const isActive = value.length === index
  
  return (
    <div
      className={cn(
        "relative flex h-14 w-12 items-center justify-center border-y border-r border-input text-lg transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
    >
      {char}
      {isActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}
