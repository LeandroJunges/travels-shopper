import { prisma } from "../../database/prisma-client";
export async function getDrivers(app) {
    app.withTypeProvider().get('/driver', async () => {
        const drivers = await prisma.driver.findMany({
            include: {
                reviews: true
            }
        });
        return { data: drivers };
    });
}
