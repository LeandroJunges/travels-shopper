import z from "zod";
import { prisma } from "../../database/prisma-client";
export async function deleteCustomer(app) {
    app.withTypeProvider().delete('/customer/:customerId', {
        schema: {
            params: z.object({
                customerId: z.string().uuid().min(1, 'Id do cliente é obrigatório'),
            }),
        },
    }, async (request, reply) => {
        const { customerId } = request.params;
        const existingCustomer = await prisma.customer.findUnique({
            where: { id: customerId }
        });
        if (!existingCustomer) {
            return reply.status(404).send({
                error_code: 'CUSTOMER_NOT_FOUND',
                error_description: 'Cliente não encontrado',
            });
        }
        await prisma.customer.delete({ where: { id: customerId } });
        return reply.status(204);
    });
}
