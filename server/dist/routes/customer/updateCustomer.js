import z from 'zod';
import { prisma } from "../../database/prisma-client";
export async function updateCustomer(app) {
    app.withTypeProvider().put('/customers/:customerId', {
        schema: {
            params: z.object({
                customerId: z.string().uuid().min(1, 'Id do cliente é obrigatório'),
            }),
            body: z.object({
                name: z.string().optional(),
                email: z.string().email().optional(),
                phone: z.string().optional(),
            }),
        }
    }, async (request, reply) => {
        const { customerId } = request.params;
        const updateData = request.body;
        const existingCustomer = await prisma.customer.findUnique({
            where: { id: customerId }
        });
        if (!existingCustomer) {
            return reply.status(404).send({
                error_code: 'CUSTOMER_NOT_FOUND',
                error_description: 'Cliente não encontrado',
            });
        }
        const updatedCustomer = await prisma.customer.update({ where: { id: customerId }, data: updateData });
        return reply.status(200).send({
            message: 'Cliente atualizado com sucesso',
            data: updatedCustomer
        });
    });
}
