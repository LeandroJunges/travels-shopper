import Z from "zod";
import { prisma } from "../../database/prisma-client";
export async function createDrive(app) {
    app.withTypeProvider().post("/driver", {
        schema: {
            body: Z.object({
                name: Z.string()
                    .min(1, "O nome não pode estar vazio")
                    .max(100, "O nome pode ter no máximo 100 caracteres"),
                description: Z.string()
                    .min(10, "A descrição deve ter pelo menos 10 caracteres")
                    .max(500, "A descrição pode ter no máximo 500 caracteres"),
                vehicle: Z.string().min(1, "O nome do carro não pode estar vazio"),
                ratePerKm: Z.string()
                    .min(1, "A tarifa por km não pode estar vazia"),
                minKm: Z.number()
                    .min(1, "A quilometragem mínima deve ser pelo menos 1 km"),
            }),
        },
    }, async (request) => {
        const { name, description, vehicle, ratePerKm, minKm } = request.body;
        const driver = await prisma.driver.create({
            data: {
                name,
                description,
                vehicle,
                ratePerKm,
                minKm,
            },
        });
        return { data: driver };
    });
}
