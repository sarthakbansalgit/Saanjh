import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp'
import { Heart, ArrowRight, RefreshCw } from 'lucide-react'
import { useAuth } from '../hooks/use-auth'

export default function VerifyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || sessionStorage.getItem('verifyEmail') || ''
  
  const { verifyOTP, resendOTP } = useAuth()

  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (!email) {
      navigate('/signup')
    }
  }, [email, navigate])

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setServerError('Please enter the complete 6-digit OTP')
      return
    }

    setIsLoading(true)
    setServerError('')
    try {
      await verifyOTP(email, otp)
      sessionStorage.setItem('verifiedEmail', email)
      navigate('/create-profile')
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setServerError('')
    try {
      await resendOTP(email)
      setCountdown(60)
      setCanResend(false)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Failed to resend OTP')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ backgroundColor: 'var(--background-pink)' }}>
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255, 107, 158, 0.2)' }} />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(251, 111, 146, 0.2)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8 no-underline">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--primary-pink)' }}>
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-bold" style={{ 
            background: 'linear-gradient(45deg, var(--deep-pink), var(--primary-pink))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Playfair Display', serif"
          }}>Saanjh</span>
        </Link>

        {/* Verify Card */}
        <div className="p-6 md:p-8" style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 40px rgba(251, 111, 146, 0.15)'
        }}>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2 text-[#4a0e26]">Verify Your Email</h1>
            <p className="text-gray-500">
              We've sent a 6-digit code to
            </p>
            <p className="font-medium text-[#1a1a1a] mt-1">{email}</p>
          </div>

          <div className="space-y-6">
            {serverError && <p className="text-sm bg-red-100 text-red-600 p-2 rounded text-center mb-4">{serverError}</p>}
            
            {/* OTP Input */}
            <div className="flex justify-center mb-6">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="bg-white/50" />
                  <InputOTPSlot index={1} className="bg-white/50" />
                  <InputOTPSlot index={2} className="bg-white/50" />
                  <InputOTPSlot index={3} className="bg-white/50" />
                  <InputOTPSlot index={4} className="bg-white/50" />
                  <InputOTPSlot index={5} className="bg-white/50" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              className="w-full"
              style={{ backgroundColor: 'var(--primary-pink)' }}
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Resend */}
            <div className="text-center mt-4">
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  disabled={isResending}
                  style={{ color: 'var(--primary-pink)', backgroundColor: 'transparent' }}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </Button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend code in {countdown}s
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
