import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Définition des salles avec leur nombre d'épreuves
  const rooms = [
    { slug: 'salle-1', name: 'Tatoueur', trialCount: 10, defaultTimerDurationMs: 3600000 }, // 60 min
    { slug: 'salle-2', name: 'Escape Kids', trialCount: 12, defaultTimerDurationMs: 3600000 }, // 60 min
    { slug: 'salle-3', name: 'Labo Vaïk-17', trialCount: 8, defaultTimerDurationMs: 3600000 }   // 60 min
  ];

  for (const roomData of rooms) {
    console.log(`📦 Creating room: ${roomData.name}`);
    
    // Créer ou récupérer la salle
    const room = await prisma.room.upsert({
      where: { slug: roomData.slug },
      update: {},
      create: {
        slug: roomData.slug,
        name: roomData.name,
        trialCount: roomData.trialCount,
        defaultTimerDurationMs: roomData.defaultTimerDurationMs
      }
    });

    // Créer les épreuves pour cette salle
    for (let i = 1; i <= roomData.trialCount; i++) {
      await prisma.trial.upsert({
        where: {
          roomId_index: {
            roomId: room.id,
            index: i
          }
        },
        update: {},
        create: {
          roomId: room.id,
          index: i,
          label: `Épreuve ${i}`
        }
      });
    }
    
    console.log(`  ✅ Created ${roomData.trialCount} trials for ${roomData.name}`);

    // Créer une run initiale pour chaque salle
    const existingRun = await prisma.run.findFirst({
      where: {
        roomId: room.id,
        endedAt: null
      }
    });

    if (!existingRun) {
      const run = await prisma.run.create({
        data: {
          roomId: room.id
        }
      });

      // Créer les statuts pour toutes les épreuves
      const trials = await prisma.trial.findMany({
        where: { roomId: room.id }
      });

      for (const trial of trials) {
        await prisma.runTrialStatus.create({
          data: {
            runId: run.id,
            trialId: trial.id,
            validated: false
          }
        });
      }

      // Créer le timer initial pour cette run
      await prisma.runTimer.create({
        data: {
          runId: run.id,
          durationMs: room.defaultTimerDurationMs,
          state: 'IDLE'
        }
      });

      console.log(`  ✅ Created initial run with timer for ${roomData.name}`);
    } else {
      console.log(`  ℹ️  Run already exists for ${roomData.name}`);
    }
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
