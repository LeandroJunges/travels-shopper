import z from "zod";
import { prisma } from "../../database/prisma-client";
export async function deleteDriver(app) {
    app.withTypeProvider().delete('/driver/:driverId', {
        schema: {
            params: z.object({
                driverId: z.number(),
            }),
        },
    }, async (request, reply) => {
        const { driverId } = request.params;
        const existingDriver = await prisma.driver.findUnique({
            where: { id: driverId },
        });
        if (!existingDriver) {
            return reply.status(404).send({
                error_code: "DRIVER_NOT_FOUND",
                error_description: "Motorista não encontrado.",
            });
        }
        await prisma.driver.delete({
            where: { id: driverId },
        });
        return reply.status(204);
    });
}
