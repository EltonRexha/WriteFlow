import prisma from './client';

async function main() {
  console.log('Seeding database...');

  const categories = await prisma.category.createMany({
    data: [
      { name: 'Coding' },
      { name: 'Food' },
      { name: 'Travel' },
      { name: 'Fashion' },
      { name: 'Sports' },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${categories.count} categories`);
  console.log('Database seeding completed');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect();
  });
