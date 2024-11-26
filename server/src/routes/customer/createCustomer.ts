import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../database/prisma-client";

export async function createCustomer(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/customer', {
        schema:{
            body: z.object({
                name: z.string().min(1, "Nome do cliente não pode estar vazio."),
                email: z.string().email(),
                phone: z.string().optional(),
            }),            
        }
    }, async (request)=>{
        const { name, email, phone } = request.body;

        const customer = await prisma.customer.create({
            data:{
                name,
                email,
                phone,
            }
        })

        return customer
       
    }
)
}