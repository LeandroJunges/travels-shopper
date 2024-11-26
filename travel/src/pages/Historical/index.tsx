/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import api from "../../services/api"
import RideList from "../../components/RideList"

interface IDriver {
    id: number
    name: string
    description: string
    ratePerKm: string
    vehicle: string
    minKm: number

}

interface IRide {
    id: number
    date: string
    destination: string
    distance: number
    driver: IDriver
    duration: string
    origin: string
    value: number
}

interface IRides {
    customerId: string
    rides: IRide[]
}

const Historical = ()=>{
    const [rides, setRides] = useState<IRides>()
    const location = useLocation()
    const {customerId} = location.state

    const loadRides = async (id: string)=>{
        const {data} = await api.get(`/ride/${id}`)
        setRides(data)
        console.log(rides)
    }


    useEffect(()=>{
        loadRides(customerId)
    }, [customerId])
    return(
        <div className="w-full space-y-64 ">
            <div className="flex flex-col items-center gap-8" >
                <Header />
                <h1 className="text-3xl font-bold text-center" >Histórico de Viagens</h1>
                {rides && rides?.rides?.length > 0 && (
                    <RideList rides={rides.rides} />

                )}
                <button className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-600 transition" >
                    <Link to="/">Nova Viagem</Link> 

                </button>
            </div>
            <div className="w-full py-1 " >
                <Footer/>                
            </div>
        </div>
    )   
}
export default Historical