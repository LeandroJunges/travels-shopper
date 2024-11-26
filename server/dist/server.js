import fastify from "fastify";
import cors from '@fastify/cors';
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { getDrivers } from "./routes/driver/getDrivers";
import { travelDriver } from "./routes/travelDriver";
import { createDrive } from "./routes/driver/createDriver";
import { getDriverById } from "./routes/driver/getDriverById";
import { updateDriver } from "./routes/driver/updateDriver";
import { deleteDriver } from "./routes/driver/deleteDriver";
import { confirmTravel } from "./routes/confirmTravel";
import { getTravelHistory } from "./routes/getTravelHistory";
import { createCustomer } from "./routes/customer/createCustomer";
import { getCustomers } from "./routes/customer/getCustomers";
import { getCustomerById } from "./routes/customer/getCustomerById";
import { updateCustomer } from "./routes/customer/updateCustomer";
import { deleteCustomer } from "./routes/customer/deleteCustomer";
const app = fastify({ logger: false });
app.register(cors, {
    origin: '*'
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
//Driver
app.register(createDrive);
app.register(getDrivers);
app.register(getDriverById);
app.register(updateDriver);
app.register(deleteDriver);
//Travels
app.register(travelDriver);
app.register(confirmTravel);
app.register(getTravelHistory);
//Customer
app.register(createCustomer);
app.register(getCustomers);
app.register(getCustomerById);
app.register(updateCustomer);
app.register(deleteCustomer);
app.listen({ port: 3333 }).then(() => {
    console.log('Server running!');
});
