import { FastifyInstance } from "fastify";
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../database/prisma-client";


export async function confirmTravel(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().patch('/ride/confirm', {
        schema: {
            body: z.object({
                customer_id: z.string().min(1, "O ID do cliente não pode estar vazio."),
                origin: z.string().min(1, "O endereço de origem não pode estar vazio."),
                destination: z.string().min(1, "O endereço de destino não pode estar vazio."),
                distance: z.number().positive("A distância deve ser um número positivo."),
                duration: z.string().min(1, "A duração não pode estar vazia."),
                driver: z.object({
                    id: z.number().positive("O ID do motorista deve ser válido."),
                    name: z.string().min(1, "O nome do motorista não pode estar vazio."),
                }),
                value: z.number().positive("O valor deve ser um número positivo."),
            }),
            response: {
                200: z.object({
                    success: z.boolean(),
                }),
                400: z.object({
                    error_code: z.string(),
                    error_description: z.string(),
                }),
                404: z.object({
                    error_code: z.string(),
                    error_description: z.string(),
                }),
                406: z.object({
                    error_code: z.string(),
                    error_description: z.string(),
                }),
            },
        },
        handler: async (request, reply) => {
            const {
                customer_id,
                origin,
                destination,
                distance,
                duration,
                driver,
                value,
            } = request.body;

            
            if (origin === destination) {
                return reply.status(400).send({
                    error_code: "INVALID_DATA",
                    error_description: "Os endereços de origem e destino não podem ser iguais.",
                });
            }

            
            const selectedDriver = await prisma.driver.findUnique({
                where: { id: driver.id },
            });

            if (!selectedDriver) {
                return reply.status(404).send({
                    error_code: "DRIVER_NOT_FOUND",
                    error_description: "O motorista informado não foi encontrado.",
                });
            }

            
            if (distance < selectedDriver.minKm) {
                return reply.status(406).send({
                    error_code: "INVALID_DISTANCE",
                    error_description: `A distância é menor que a quilometragem mínima aceita pelo motorista (${selectedDriver.minKm} km).`,
                });
            }

            const customer = await prisma.customer.findUnique({
                where: { id: customer_id },
            });
            
            if (!customer) {
                return reply.status(404).send({
                    error_code: "CUSTOMER_NOT_FOUND",
                    error_description: "O cliente informado não foi encontrado.",
                });
            }

            
            await prisma.ride.create({
                data: {
                    customerId: customer_id,
                    origin,
                    destination,
                    distance,
                    duration,
                    driverId: driver.id,
                    value,
                },
            });

            
            return reply.status(200).send({ success: true });
        },
    });
}
