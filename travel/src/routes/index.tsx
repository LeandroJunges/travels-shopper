import { Navigate, Route, Routes } from "react-router-dom";
import SelectTravel from "../pages/SelectTravel";
import Historical from "../pages/Historical";

function RoutesMain(){
    return(
        <Routes>
            <Route path="/" element={<SelectTravel />} />
            <Route path="/historical" element={<Historical />} />
            <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
    )
}

export default RoutesMain