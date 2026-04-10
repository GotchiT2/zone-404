import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getTestToken() {
  // Récupérer la room salle-1
  const room = await prisma.room.findUnique({
    where: { slug: 'salle-1' }
  });

  if (!room) {
    console.error('❌ Room "salle-1" not found!');
    process.exit(1);
  }

  // Récupérer le run actif pour cette room
  const run = await prisma.run.findFirst({
    where: {
      roomId: room.id,
      endedAt: null
    }
  });

  if (!run) {
    console.error('❌ No active run found for salle-1!');
    process.exit(1);
  }

  // Construire le token
  const token = `room-${room.slug}-run-${run.id}`;

  console.log('\n✅ Token de test trouvé :\n');
  console.log(`🎮 URL complète : http://localhost:5173/escape-game/${token}`);
  console.log(`\nℹ️  Room : ${room.name} (ID: ${room.id})`);
  console.log(`ℹ️  Run ID : ${run.id}`);
  console.log(`ℹ️  Trials disponibles : ${room.trialCount}\n`);
  
  if (room.trialCount < 11) {
    console.log('⚠️  ATTENTION : Cette room a seulement ' + room.trialCount + ' trials.');
    console.log('⚠️  Le jeu escape game a besoin de 11 trials (1 debug + 10 antidote).');
    console.log('⚠️  Il faudra ajouter le 11ème trial en DB.\n');
  }
}

getTestToken()
  .catch(console.error)
  .finally(() => prisma.$disconnect());