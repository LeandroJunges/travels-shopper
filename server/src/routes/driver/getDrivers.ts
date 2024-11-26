import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../database/prisma-client";

export async function getDrivers(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get('/driver',  async () => {
        const drivers = await prisma.driver.findMany({
            include:{
                reviews: true
            }
        })

        return {data: drivers}
    }
)
}