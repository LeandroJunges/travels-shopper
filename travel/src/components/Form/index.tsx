/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubmitHandler, useForm } from "react-hook-form"
import z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

interface FormsProps {
    fields: string[]
    onSubmit: (data: any)=> void
    textButton: string
}

const schema = z.object({
    clientID: z.string().min(1, 'campo obrigatorio!'),
    origem: z.string().min(3, 'campo obrigatorio!'),
    destino: z.string().min(3, 'campo obrigatorio!'),
})
type FormData = z.infer<typeof schema>

const Form = ({fields, onSubmit, textButton}: FormsProps)=>{
   const {register, handleSubmit, formState: {errors} } = useForm<FormData>({
        resolver: zodResolver(schema)
   })

   const handleFormSubmit: SubmitHandler<FormData> =(data)=>{
    if(data){
        onSubmit(data)
    }
   }
   return(
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded shadow-md flex mt-8 gap-8" >
        {fields.map(field=>(
            <div key={field} className="flex justify-center " >
                <div className="flex items-center justify-center " >
                    <label htmlFor={field} className="text-gray-700 font-medium mb-4 " >{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                    <div className="flex flex-col items-center justify-center " >
                        <input
                            id={field}
                            {...register(field as keyof FormData)}
                            className="mb-4 p-2 border border-gray-300 w-[80%] rounded focus:ring focus:ring-blue-200"
                            placeholder={`Digite ${field}`}
                        />
                        
                        {errors[field as keyof FormData] && (
                                <span className="text-red-500 ">
                                    {errors[field as keyof FormData]?.message}
                                </span>
                        )}
                    
                </div>
                </div>
                
            </div>
        ))}
        <button type="submit" className="w-1/4 mb-8 mr-8  bg-blue-500 text-white py-4  rounded-md hover:bg-blue-600 " >{textButton}</button>
    </form>
   )
}

export default Form