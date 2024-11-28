/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import Form from '../../components/Form'
import Header from '../../components/Header'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaCarRear } from "react-icons/fa6";

interface IData {
    clientID: string
    origem: string
    destino: string
}
interface IDriver {
    id: number
    name: string
    description: string
    vehicle: string
    review: {
        rating: number
        comment: string
    }
    value: number
}
interface ITravel {
    customerId: string
    origin: {
        latitude: number
        longitude: number
    }
    destination: {
        latitude: number
        longitude: number
    }
    distance: number
    duration: string
    options: IDriver[]
}

interface ICustomer{
    id: string
    name: string
    email: string
    phone: string
}

const SelectTravel = () => {
    const [travel, setTravel] = useState<ITravel>()
    const [origin, setOrigin] = useState<string>()
    const [destination, setDestination] = useState<string>()
    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [customerId, setCustomerId] = useState<string | undefined>()
    const [openOptions, setOpenOptions] = useState<boolean>(false)
    const GOOGLE_MAPS_API_KEY = "AIzaSyBPnYBy8kkUBvIcmy27uIg9J3TXygEOsT0"
    const navigate = useNavigate()

    const loadCustomers = async () =>{
        api.get('/customer').then((res) => {
            setCustomers(res.data.data)
            
        }).catch((err) => {
            console.log(err)
            return toast.error(`Erro ao buscar Clientes! `)
        })
    }

    const onSubmit = async (data: IData) => {
        setOpenOptions(false)
        
        const formatData = {
            customerId: data.clientID,
            origin: data.origem,
            destination: data.destino,
        }
        api.post('/ride/estimate', formatData).then((res) => {
            toast.success('Viagem estimada com sucesso.')
            setOrigin(data.origem)
            setDestination(data.destino)
            setTravel(res.data)
        }).catch((err) => {
            console.log(err)
            return toast.error(`Error: ${err.response.data.error_description} `)
        })
    }

    const chooseDriveTravel = async (driver: IDriver) => {
        if (!travel) {
            console.error("Nenhuma viagem encontrada.");
            return;
        }
    
        const requestData = {
            customer_id: travel.customerId,
            origin: `${travel.origin.latitude},${travel.origin.longitude}`,
            destination: `${travel.destination.latitude},${travel.destination.longitude}`,
            distance: travel.distance,
            duration: travel.duration,
            driver: {
                id: driver.id,
                name: driver.name,
            },
            value: driver.value,
        };
    
        try {
            const response = await api.patch('/ride/confirm', requestData);
            if (response.data.success) {
                toast.success('Viagem confirmada!')
                navigate('/historical', {
                    state: {customerId: travel.customerId}
                })
                
            } else {
                console.error('Erro desconhecido:', response.data);
            }
        } catch (error: any) {
            if (error.response) {
                const { error_code, error_description } = error.response.data;
                toast.error(`Erro: ${error_code} - ${error_description}`)
                console.log(error_code, error_description)
            } else {
                console.error('Erro de rede ou desconhecido:', error.message);
            }
        }
    };
    

    const generateStaticMapUrl = () => {
        if (!travel) return ''
        const origin = `${travel.origin.latitude},${travel.origin.longitude}`
        const destination = `${travel.destination.latitude},${travel.destination.longitude}`

        return `https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=weight:3|color:blue|${origin}|${destination}&markers=color:green|label:A|${origin}&markers=color:red|label:B|${destination}&key=${GOOGLE_MAPS_API_KEY}`
    }
    const addCustomer = (id: string)=>{
        setCustomerId(id)
        
    }

    useEffect(() => {
        loadCustomers()
    }, [])

    return (
        <div className="flex flex-col justify-between space-y-28">
            <Header />
            <div className="w-full mt-4">
                <h1 className="text-3xl font-bold text-center">
                    Selecionar Viagem
                </h1>
                <Form
                    fields={['clientID', 'origem', 'destino']}
                    onSubmit={onSubmit}
                    textButton="Buscar Motoristas"
                    clientID={customerId}
                />
                <div className='flex flex-col items-center mt-2 gap-2 ' >
                <h2 onClick={()=> setOpenOptions(!openOptions)} className='font-semibold text-base hover:cursor-pointer hover:text-blue-500 ' >Não lembra seu id ? Clique aqui!</h2>
                {openOptions && (
                     <select className='w-[25%] p-2 rounded-lg bg-white border ' onChange={(e)=> addCustomer(e.target.value) } >
                     {customers.map((customer) =>(
                         <option key={customer.id} value={customer.id}  >{customer.name}</option>
                     ))}
     
                     </select>
                )}
               
            </div>
            </div>
            
            
            <div>
                {travel ? (
                    <>
                    <div className='w-full'>
                        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
                            Detalhes da Viagem
                        </h2>

                        <div className="mb-6 flex items-center">
                            <img
                                src={generateStaticMapUrl()}
                                alt="Mapa da viagem"
                                className="rounded shadow-md" />
                            <div className="border rounded-lg shadow-md p-4 bg-white flex flex-col space-y-4 transition-transform transform hover:scale-105 hover:shadow-lg duration-300">
                                <h3 className="text-lg font-bold text-blue-700">Informações</h3>
                                <p className="text-sm">
                                    <span className="font-semibold">Origem:</span> {origin}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Destino:</span> {destination}
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Distância:</span> {travel.distance} km
                                </p>
                                <p className="text-sm">
                                    <span className="font-semibold">Estimativa de viagem:</span> {travel.duration}
                                </p>
                            </div>

                        </div>

                        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
                            Motoristas para a Viagem
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {travel.options.map((driver, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg shadow-md p-4 bg-white flex flex-col justify-between transition-transform transform hover:scale-95 hover:shadow-lg "
                                >
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-lg font-bold text-blue-700">
                                            {driver.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {driver.description}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-gray-800">
                                            <span className="font-semibold">
                                                Veículo:
                                            </span>{' '}
                                            {driver.vehicle}
                                        </p>
                                        <div className="flex items-center my-4">
                                            {Array.from(
                                                { length: 5 },
                                                (_, i) => (
                                                    <svg
                                                        key={i}
                                                        fill={i <
                                                            driver.review.rating
                                                            ? 'gold'
                                                            : 'none'}
                                                        viewBox="0 0 24 24"
                                                        stroke="gold"
                                                        strokeWidth={1}
                                                        className="w-5 h-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M12 17.27l6.18 3.73-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73-1.64 7.03z" />
                                                    </svg>
                                                )
                                            )}
                                        </div>
                                        <p className="text-sm italic text-gray-600">
                                            "{driver.review.comment}"
                                        </p>
                                    </div>

                                    <div className="mt-4 flex justify-between items-center gap-4 ">
                                        <p className="text-lg font-bold text-green-600">
                                        {new Intl.NumberFormat('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL'
                                        }).format(driver.value)}
                                        </p>
                                        <button onClick={() => chooseDriveTravel(driver)} className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 transition">
                                            Escolher
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='py-2' ></div>
                    </>
                ):(
                    <div className='flex items-center gap-4 ' >
                        <h2 className='text-2xl font-semibold hover:text-blue-400 hover:shadow-lg ' >
                            Para onde iremos ? 
                        </h2>
                        <FaCarRear size={50} color='#2563eb' className=' hover:bg-blue-200 hover:shadow-lg rounded-md' />
                    </div>
                )}
            </div>
        </div>
    )
}


export default SelectTravel
