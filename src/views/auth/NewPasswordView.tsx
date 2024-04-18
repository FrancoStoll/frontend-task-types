import NewPasswordForm from "@/components/auth/NewPasswordForm"
import NewPasswordToken from "@/components/auth/NewPasswordToken"
import { confirmToken } from "@/types/index"
import { useState } from "react"


const NewPasswordView = () => {

  const [token, setToken] = useState<confirmToken['token']>('')
  const [isValidToken, setIsValidToken] = useState(false)

  return (
    <>
      <h1 className="text-5xl font-black text-white">Reestablecer password</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el codigo que recibiste por email {''}
        <span className=" text-fuchsia-500 font-bold">para restablecer</span>
      </p>

      {
        !isValidToken
          ? (<NewPasswordToken token={token} setToken={setToken} setIsValidToken={setIsValidToken}/>)
          : (<NewPasswordForm token={token}/>)
      }
    </>
  )
}
export default NewPasswordView