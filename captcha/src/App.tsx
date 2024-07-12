import { Turnstile } from '@marsidev/react-turnstile'

import './App.css'
import axios from 'axios'
import { useState } from 'react'

function App() {
  const [token, setToken] = useState<string>("")
  const [otp, setOtp] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")

  return (
    <>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder='OTP'></input>
      <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='New password'></input>

      <Turnstile onSuccess={(token) => {
        setToken(token)
      }} siteKey='0x4AAAAAAAe8GPK4usYAolUH' />

      <button onClick={() => {
        axios.post("http://localhost:3000/reset-password", {
          email: "ankush@gmail.com",
          otp: otp,
          token: token,
          newPassword: newPassword
        }).then(() => {
          alert("Password updated successfully")
          setNewPassword("")
          setOtp("")
        })
      }}>Update password</button>
    </>
  )
}

export default App