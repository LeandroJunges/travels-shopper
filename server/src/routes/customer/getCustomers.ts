import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../database/prisma-client";

export async function getCustomers(app:FastifyInstance) {

    app.withTypeProvider<ZodTypeProvider>().get('/customer', async () => {
        const customers = await prisma.customer.findMany()
        return {data: customers}
    })
    
}