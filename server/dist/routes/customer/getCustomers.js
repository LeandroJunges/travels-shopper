import { prisma } from "../../database/prisma-client";
export async function getCustomers(app) {
    app.withTypeProvider().get('/customer', async () => {
        const customers = await prisma.customer.findMany();
        return { data: customers };
    });
}
