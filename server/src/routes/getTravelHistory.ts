import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod'
import { prisma } from '../database/prisma-client';
export async function getTravelHistory(app: FastifyInstance){

    app.withTypeProvider<ZodTypeProvider>().get('/ride/:customerId', {
        schema: {
            params: z.object({
                customerId: z.string().optional(),
                driver_id: z.number().optional(),
            }),
            querystring: z.object({
                driver_id: z.number().optional(),
            })
            
        },
    }, async (request, reply)=>{
        const {customerId} = request.params
        const {driver_id} = request.query

        if(!customerId?.trim()) {
            return reply.status(400).send({
                error_code: "INVALID_DATA",
                error_description: "O ID do cliente não pode estar vazio."
            })
        }
        if(driver_id){
            const driver = await prisma.driver.findUnique({
                where: { id: driver_id },
            })
            if(!driver){
                return reply.status(400).send({
                    error_code: "DRIVER_NOT_FOUND",
                    error_description: "O Id do motorista fornecido é inválido."
                })
            }
        }
        const rides = await prisma.ride.findMany({
            where:{
                customerId: customerId,
                ...driver_id ? {driverId: driver_id} : {}
            },
            orderBy:{date: 'desc'},
            include:{
                driver: true,                
            }
        })
        if(!rides || rides.length === 0) {
            return reply.status(404).send({
                error_code: "NO_RIDES_FOUND",
                error_description: "Nenhuma viagem encontrada para este cliente."
            })
        }
        return reply.status(200).send({
            customerId: customerId,
            rides: rides.map(ride =>({
                id: ride.id,
                date: ride.date,
                origin: ride.origin,
                destination: ride.destination,
                distance: ride.distance,
                duration: ride.duration,
                value: ride.value,
                driver: {
                    id: ride.driver.id,
                    name: ride.driver.name,
                    vehicle: ride.driver.vehicle,
                    description: ride.driver.description,
                    ratePerKm: ride.driver.ratePerKm,
                    minKm: ride.driver.minKm,                                                            
                }
            }))
        })
    }
)

}