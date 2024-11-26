import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../database/prisma-client";

export async function updateDriver(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put('/driver/:driverId', {
    schema: {
      params: z.object({
        driverId: z.number(),
      }),
      body: z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        car: z.string().optional(),
        rating: z.string().optional(),
        tax: z.string().optional(),
        minKm: z.number().optional(),
      }),
    },
  }, async (request, reply) => {
    const { driverId } = request.params;
    const updateData = request.body;

    
    const existingDriver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!existingDriver) {
      return reply.status(404).send({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Motorista não encontrado.",
      });
    }

    
    const updatedDriver = await prisma.driver.update({
      where: { id: driverId },
      data: updateData,
    });

    return reply.status(200).send({
      message: "Motorista atualizado com sucesso.",
      data: updatedDriver,
    });
  });
}
