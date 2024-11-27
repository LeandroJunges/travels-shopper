import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [customerId, setCustomerId] = useState("")
  const navigate = useNavigate()
  const {pathname} = useLocation()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement> ) => {
    setCustomerId(e.target.value)
  }

  const handleSubmit = () => {
    if(customerId){
      navigate('/historical', {
        state: {customerId: customerId}
      })
    }else{
      setIsDropdownOpen(false)
      return toast.warn('Necessario enviar um ID!')
    }
   
  }

  return (
    <header className="bg-blue-700 text-white shadow-md w-full flex items-center">
      <div className="container mr-4 flex items-center justify-center py-4 px-6">
        <h1 className="text-2xl font-bold tracking-wide">
          <span className="text-yellow-400">Agency</span> Travel's
        </h1>
      </div>
      {pathname !== '/historical' && (
         <div className="relative">
         <button
           onClick={toggleDropdown}
           type="button"
           className="my-4 mr-4 bg-blue-200 text-gray-400 font-semibold p-2 rounded-md hover:bg-blue-300"
         >
           Minhas Viagens
         </button>
         {isDropdownOpen && (
           <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg z-10">
             <div className="p-4">
               <label htmlFor="customerId" className="block text-sm font-medium mb-2">
                 Digite o ID do usuario:
               </label>
               <input
                 type="text"
                 id="customerId"
                 required
                 value={customerId}
                 onChange={handleInputChange}
                 className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
               <button
                 onClick={handleSubmit}
                 className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
               >
                 Enviar
               </button>
             </div>
           </div>
         )}
       </div>
      ) } 
     
    </header>
  )
}

export default Header
