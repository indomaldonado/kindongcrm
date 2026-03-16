import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Crear algunos Supporters de ejemplo
    const supporter1 = await prisma.supporter.create({
      data: {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+1234567890',
        category: 'DONOR',
      },
    });

    const supporter2 = await prisma.supporter.create({
      data: {
        name: 'María García',
        email: 'maria@example.com',
        phone: '+0987654321',
        category: 'INTERCESSOR',
      },
    });

    const supporter3 = await prisma.supporter.create({
      data: {
        name: 'Carlos López',
        email: 'carlos@example.com',
        phone: '+1122334455',
        category: 'BOTH',
      },
    });

    // Crear algunas Donations
    await prisma.donation.create({
      data: {
        supporterId: supporter1.id,
        amount: 100.00,
        date: new Date('2024-01-15'),
        notes: 'Donación mensual',
      },
    });

    await prisma.donation.create({
      data: {
        supporterId: supporter3.id,
        amount: 50.00,
        date: new Date('2024-02-10'),
        notes: 'Contribución especial',
      },
    });

    // Crear algunos Prayer Commitments
    await prisma.prayerCommitment.create({
      data: {
        supporterId: supporter2.id,
        frequency: 'DAILY',
        dayOfWeek: 'Monday',
        notes: 'Oración por la familia',
      },
    });

    await prisma.prayerCommitment.create({
      data: {
        supporterId: supporter3.id,
        frequency: 'WEEKLY',
        dayOfWeek: 'Sunday',
        notes: 'Oración por el proyecto',
      },
    });

    // Crear algunos Leads de ejemplo
    await prisma.lead.create({
      data: {
        name: 'Ana Rodríguez',
        email: 'ana@example.com',
        phone: '+5566778899',
        possibleCategory: 'DONOR',
        notes: 'Interesada en apoyar económicamente',
      },
    });

    await prisma.lead.create({
      data: {
        name: 'Pedro Sánchez',
        email: 'pedro@example.com',
        phone: '+4433221100',
        possibleCategory: 'BOTH',
        notes: 'Quiere orar y donar',
      },
    });

    console.log('Datos de ejemplo insertados exitosamente');
  } catch (error) {
    console.error('Error al insertar datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();