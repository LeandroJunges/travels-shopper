import RideCard from "../RideCard";

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

interface RideListProps {
    rides: Ride[];
}

const RideList = ({ rides }: RideListProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rides.map((ride) => (
                <RideCard key={ride.id} ride={ride} />
            ))}
        </div>
    );
};

export default RideList;
