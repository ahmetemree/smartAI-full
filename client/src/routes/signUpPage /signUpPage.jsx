import { SignUp, useAuth } from '@clerk/clerk-react'
import './signUpPage.css'

const SignUpPage = () => {
  const {isLoaded} = useAuth()
  return ( 
    <div className='signUpPage'>
       <SignUp path="/sign-up" signInUrl='/sign-in'/>
    </div>
  )
}

export default SignUpPage