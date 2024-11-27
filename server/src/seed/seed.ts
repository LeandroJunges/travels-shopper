import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    
    const driver1 = await prisma.driver.create({
      data: {
        name: "Homer Simpson",
        description: "Olá! Sou o Homer, seu motorista camarada!Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (etalvez alguns desvios). ",
        vehicle: "Plymouth Valiant 1973 rosa e enferrujado",
        ratePerKm: "2.5",
        minKm: 1,
      },
    });
  
    const driver2 = await prisma.driver.create({
      data: {
        name: "Dominic Toretto",
        description: "Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada. ",
        vehicle: "Dodge Charger R/T 1970 modificado",
        ratePerKm: "5.0",
        minKm: 5,
      },
    });
  
    const driver3 = await prisma.driver.create({
      data: {
        name: "James Bond",
        description: "Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem. ",
        vehicle: "Aston Martin DB5 clássico",
        ratePerKm: "10.0",
        minKm: 10,
      },
    });
  
    // Criação das reviews associadas aos drivers
    await prisma.review.create({
      data: {
        rating: 2,
        comment: "Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.",
        driver: { connect: { id: driver1.id } },
      },
    });
  
    await prisma.review.create({
      data: {
        rating: 4,
        comment: "Que viagem incrível! O carro é um show à parte e o motorista foi super gente boa.",
        driver: { connect: { id: driver2.id } },
      },
    });
  
    await prisma.review.create({
      data: {
        rating: 5,
        comment: "Serviço impecável! O motorista é a própria definição de classe.",
        driver: { connect: { id: driver3.id } },
      },
    });
  
    console.log("Motoristas e avaliações inseridos com sucesso!");
  }
  

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
