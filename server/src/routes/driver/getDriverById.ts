import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../database/prisma-client";

export async function getDriverById(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get("/driver/:driverId", {
        schema:{
            params: z.object({
                driverId: z.string().regex(/^\d+$/, "Id do motorista deve ser um número válido"),
            })
        }
    }, async (request) => {
        const  driverId  = Number(request.params.driverId);

        const driver = await prisma.driver.findUnique({
            where: { id: driverId },
            include:{
                reviews: true,
            }
        });

        if(!driver){
            return {
                error_code: "DRIVER_NOT_FOUND",
                error_description: "Driver not found"
            }
        }

        return driver;
    }
)
}