import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTrial11() {
  // Récupérer la room salle-1
  const room = await prisma.room.findUnique({
    where: { slug: 'salle-1' }
  });

  if (!room) {
    console.error('❌ Room "salle-1" not found!');
    process.exit(1);
  }

  // Mettre à jour le trialCount de la room
  await prisma.room.update({
    where: { id: room.id },
    data: { trialCount: 11 }
  });

  // Créer le 11ème trial
  const trial11 = await prisma.trial.upsert({
    where: {
      roomId_index: {
        roomId: room.id,
        index: 11
      }
    },
    update: {},
    create: {
      roomId: room.id,
      index: 11,
      label: 'Composant #10 - Antidote'
    }
  });

  console.log('✅ Trial 11 ajouté avec succès !');
  console.log(`ℹ️  Trial ID: ${trial11.id}`);
  console.log(`ℹ️  Room "${room.name}" a maintenant ${11} trials\n`);
}

addTrial11()
  .catch(console.error)
  .finally(() => prisma.$disconnect());