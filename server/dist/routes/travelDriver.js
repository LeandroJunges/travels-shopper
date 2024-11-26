import { z } from "zod";
import axios from "axios";
import { prisma } from "../database/prisma-client";
export async function travelDriver(app) {
    app.withTypeProvider().post('/ride/estimate', {
        schema: {
            body: z.object({
                customerId: z.string().min(1, "Campo customer_id não pode estar vazio"),
                origin: z.string().min(1, "Origin não pode estar vazio"),
                destination: z.string().min(1, "Destination não pode estar vazio"),
            }),
            response: {
                200: z.object({
                    customerId: z.string(),
                    origin: z.object({
                        latitude: z.number(),
                        longitude: z.number(),
                    }),
                    destination: z.object({
                        latitude: z.number(),
                        longitude: z.number(),
                    }),
                    distance: z.number(),
                    duration: z.string(),
                    options: z.array(z.object({
                        id: z.number(),
                        name: z.string(),
                        description: z.string(),
                        vehicle: z.string(),
                        review: z.object({
                            rating: z.number(),
                            comment: z.string(),
                        }),
                        value: z.number(),
                    })),
                    routeResponse: z.any(),
                }),
                400: z.object({
                    error_code: z.string(),
                    error_description: z.string(),
                }),
            },
        },
    }, async (req, reply) => {
        const { customerId, origin, destination } = req.body;
        if (origin === destination) {
            return reply.status(400).send({
                error_code: "INVALID_DATA",
                error_description: "Origin e Destination não podem ser o mesmo endereço",
            });
        }
        try {
            const googleApiKey = process.env.GOOGLE_API_KEY;
            const routeResponse = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
                params: {
                    origin,
                    destination,
                    language: 'pt-BR',
                    key: googleApiKey,
                }
            });
            const routeData = routeResponse.data;
            if (routeData.status !== "OK") {
                return reply.status(400).send({
                    error_code: "INVALID_DATA",
                    error_description: `Erro ao calcular rota, verifique os campos!`
                });
            }
            const leg = routeData.routes[0].legs[0];
            const distanceInKm = leg.distance.value / 1000;
            const duration = leg.duration.text;
            const originCoordinates = {
                latitude: leg.start_location.lat,
                longitude: leg.start_location.lng,
            };
            const destinationCoordinates = {
                latitude: leg.end_location.lat,
                longitude: leg.end_location.lng,
            };
            const drivers = await prisma.driver.findMany({
                include: {
                    reviews: true
                }
            });
            const availableDrivers = drivers
                .filter(driver => distanceInKm >= driver.minKm)
                .map(driver => ({
                id: driver.id,
                name: driver.name,
                description: driver.description,
                vehicle: driver.vehicle,
                review: driver.reviews.map(review => ({
                    rating: review.rating,
                    comment: review.comment,
                }))[0] || {},
                value: parseFloat((distanceInKm * parseFloat(driver.ratePerKm)).toFixed(2)),
            }))
                .sort((a, b) => a.value - b.value);
            return reply.send({
                customerId: customerId,
                origin: originCoordinates,
                destination: destinationCoordinates,
                distance: distanceInKm,
                duration,
                options: availableDrivers,
                routeResponse: routeData,
            });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({
                error_code: "INTERNAL_SERVER_ERROR",
                error_description: "Erro ao processar a requisição.",
            });
        }
    });
}
