import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../database/prisma-client";

export async function getCustomerById(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get('/customer/:customerId',{
        schema:{
            params: z.object({
                customerId: z.string().uuid().min(1, 'Id do cliente é obrigatório'),
            }),
        }
    }, async (request)=>{
        const { customerId } = request.params;

        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
            include:{
                rides: true,
            }
        })

        if(!customer){
            return {
                error_code: 'CUSTOMER_NOT_FOUND',
                error_description: 'Cliente não encontrado',
            }
        }

        return { data: customer }
    }
)
}