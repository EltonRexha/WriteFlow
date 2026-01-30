import prisma from "./client";

const NUM_BLOGS = 100;
const DEFAULT_IMG =
  "https://res.cloudinary.com/dl0iowykd/image/upload/v1747237695/fqgzj2sijzkwcxvh7lww.webp";

function getRandomCategories(categories: { id: string }[], min = 1, max = 3) {
  const numCategories = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...categories].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numCategories);
}

async function main() {
  console.log("Seeding database...");

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      { name: "Coding" },
      { name: "Food" },
      { name: "Travel" },
      { name: "Fashion" },
      { name: "Sports" },
    ],
    skipDuplicates: true,
  });

  console.log(`Created ${categories.count} categories`);

  // Get all categories for reference
  const allCategories = await prisma.category.findMany();

  // Create a test user if it doesn't exist
  const testUser = await prisma.user.upsert({
    where: {
      email: "test@example.com",
    },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: "hashed_password_here", // In real app, should be properly hashed
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
    },
  });

  console.log("Created test user");

  // Create blog posts
  for (let i = 1; i <= NUM_BLOGS; i++) {
    const randomCategories = getRandomCategories(allCategories);

    await prisma.blog.create({
      data: {
        title: `Blog Post ${i}`,
        description: `This is the description for blog post ${i}. It contains some sample text to make it look realistic.`,
        imageUrl: DEFAULT_IMG,
        Author: {
          connect: {
            id: testUser.id,
          },
        },
        Categories: {
          connect: randomCategories.map((cat) => ({ id: cat.id })),
        },
        BlogContent: {
          create: {
            content: JSON.stringify({
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  content: [
                    {
                      type: "text",
                      text: `This is the content for blog post ${i}. It includes some sample text to demonstrate how the blog post would look. This is generated during seeding to provide test data.`,
                    },
                  ],
                },
              ],
            }),
          },
        },
      },
    });

    if (i % 10 === 0) {
      console.log(`Created ${i} blog posts...`);
    }
  }

  console.log(`Created ${NUM_BLOGS} blog posts`);
  console.log("Database seeding completed");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
