import * as React from 'react'
import { cn } from '../../lib/utils'

function Label({ className, ...props }, ref) {
  return (
    <label
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      ref={ref}
      {...props}
    />
  )
}
const ForwardedLabel = React.forwardRef(Label)
export { ForwardedLabel as Label }
