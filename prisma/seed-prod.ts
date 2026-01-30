import prisma from "./client";

async function main() {
  console.log("Starting seeding...");

  // Check if categories already exist
  const existingCategories = await prisma.category.count();
  if (existingCategories > 0) {
    console.log("Categories already exist, skipping category creation");
  } else {
    // Create default categories
    const categories = [
      {
        name: "Technology",
      },
      {
        name: "Programming",
      },
      {
        name: "Web Development",
      },
      {
        name: "Mobile Development",
      },
      {
        name: "Data Science",
      },
      { name: "Machine Learning" },
      { name: "DevOps" },
      { name: "Design" },
      {
        name: "Business",
      },
      { name: "Marketing" },
    ];

    for (const category of categories) {
      await prisma.category.create({
        data: category,
      });
    }

    console.log(`Created ${categories.length} default categories`);
  }

  console.log("");
  console.log("Summary:");
  console.log(`   Categories: ${await prisma.category.count()}`);
  console.log("   Users: 0 (no default users created)");
  console.log("   Blog Posts: 0 (no default blogs created)");
  console.log("");
}

main()
  .catch((e) => {
    console.error("Error during production seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
