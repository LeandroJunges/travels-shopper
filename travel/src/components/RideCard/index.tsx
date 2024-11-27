/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useEffect, useState } from 'react';



interface Driver {
    id: number;
    name: string;
    vehicle: string;
    description: string;
    ratePerKm: string;
    minKm: number;
}

interface Ride {
    id: number;
    date: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    value: number;
    driver: Driver;
}

interface RideCardProps {
    ride: Ride;
}

const RideCard = ({ ride }: RideCardProps) => {
    const [originCity, setOriginCity] = useState('Carregando...')
    const [destinationCity, setDestinationCity] = useState('Carregando...')
    const GOOGLE_MAPS_API_KEY = "AIzaSyBPnYBy8kkUBvIcmy27uIg9J3TXygEOsT0"


    const formatDate = (date: string) => {
       
        return moment(date).locale('pt-BR').format('DD [de] MMMM [de] YYYY [ás] HH:mm')
    }

    const getCityName = async (coordinates: string)=>{
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates}&key=${GOOGLE_MAPS_API_KEY}`)
            const results = response.data.results
            if(results.length > 0){
                const city = results[0].address_components.find((item: any)=> item.types.includes('sublocality'))
                return city ? city.long_name : 'Local desconhecido'
            }
            return 'Local desconhecido'
        } catch (error) {
            console.error('Erro ao buscar nome da cidade',error)
            return 'Erro ao carregar local'
        }
    }

    useEffect(()=>{
        const fetchCities = async ()=>{
            const originName = await getCityName(ride.origin)
            setOriginCity(originName)
            const destinationName = await getCityName(ride.destination)
            setDestinationCity(destinationName)
        }
        fetchCities()
    },[ride.origin, ride.destination])

    return (
        <div className="border rounded-lg shadow-md p-6 bg-white flex flex-col space-y-4 transition-transform transform hover:scale-105 hover:shadow-lg">
            <h2 className="text-lg font-bold text-blue-700">
                Data e Hora: {formatDate(ride.date)}
            </h2>
            <p className="text-sm">
                <span className="font-semibold">Motorista:</span> {ride.driver.name}
            </p>
            <p className="text-sm">
                <span className="font-semibold">Origem:</span> {originCity}
            </p>
            <p className="text-sm">
                <span className="font-semibold">Destino:</span> {destinationCity}
            </p>
            <p className="text-sm">
                <span className="font-semibold">Distância:</span> {ride.distance} km
            </p>
            <p className="text-sm">
                <span className="font-semibold">Tempo:</span> {ride.duration}
            </p>
            <p className="text-sm">
                <span className="font-semibold">Valor:</span> R$ {ride.value.toFixed(2)}
            </p>
        </div>
    );
};

export default RideCard;
