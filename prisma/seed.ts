/**
 * prisma/seed.ts
 *
 * ZeroQ — Comprehensive database seeder.
 * Run with: npm run db:seed   (or: npx tsx prisma/seed.ts)
 *
 * Populates:
 *  - 6 campus outlets
 *  - 1 STUDENT + 6 ADMIN accounts (one admin per outlet)
 *  - ~8–10 menu items per outlet using shop-agnostic image asset identifiers
 *
 * Task 1.2: All users now seeded with firstName + lastName.
 * Existing users get these fields populated via updateMany after schema migration.
 */

import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Helpers ────────────────────────────────────────────────────────────────

async function hash(password: string) {
  return bcrypt.hash(password, 12);
}

// ─── Outlet Definitions ──────────────────────────────────────────────────────

const outlets = [
  {
    name: "Main Canteen",
    slug: "main-canteen",
    description:
      "The central hub of campus dining. Serving hot meals, snacks, and beverages throughout the day.",
    imageUrl: "/assets/outlets/outlet-main-canteen.webp",
  },
  {
    name: "Rishab's Food Court",
    slug: "rishabs-food-court",
    description:
      "A vibrant multi-cuisine food court with North Indian specials, rolls, and fresh juices.",
    imageUrl: "/assets/outlets/outlet-rishabs-food-court.webp",
  },
  {
    name: "Snow Cubes",
    slug: "snow-cubes",
    description:
      "Your go-to dessert corner for chilled ice creams, milkshakes, waffles, and refreshing coolers.",
    imageUrl: "/assets/outlets/outlet-snow-cubes.webp",
  },
  {
    name: "Metro Cafe",
    slug: "metro-cafe",
    description:
      "A café-style outlet offering artisan coffee, sandwiches, wraps, and continental bites.",
    imageUrl: "/assets/outlets/outlet-metro-cafe.webp",
  },
  {
    name: "PR Cafe",
    slug: "pr-cafe",
    description:
      "Pocket-friendly South Indian breakfast and tiffin spot, famous for crispy dosas and hot idlis.",
    imageUrl: "/assets/outlets/outlet-pr-cafe.webp",
  },
  {
    name: "Aswin's Food Court",
    slug: "aswins-food-court",
    description:
      "A student favourite serving hearty Chinese dishes, noodles, fried rice, and Manchurian combos.",
    imageUrl: "/assets/outlets/outlet-aswins-food-court.webp",
  },
];

// ─── Menu Catalogue (shop-agnostic image asset identifiers) ──────────────────

type MenuItemSeed = {
  name: string;
  description: string;
  price: number;
  imageAsset: string;
  category: string;
};

const menuByOutlet: Record<string, MenuItemSeed[]> = {
  "main-canteen": [
    {
      name: "Veg Thali",
      description: "Full South Indian plate with rice, sambar, rasam, kootu & papad.",
      price: 60,
      imageAsset: "meal-veg-thali.png",
      category: "Meals",
    },
    {
      name: "Chicken Biryani",
      description: "Fragrant basmati rice cooked with tender chicken and whole spices.",
      price: 90,
      imageAsset: "meal-chicken-biryani.png",
      category: "Meals",
    },
    {
      name: "Egg Fried Rice",
      description: "Wok-tossed fried rice with eggs, soy sauce, and spring onion.",
      price: 65,
      imageAsset: "meal-egg-fried-rice.png",
      category: "Meals",
    },
    {
      name: "Veg Burger",
      description: "Crispy aloo patty with lettuce, tomato, and mayo in a sesame bun.",
      price: 45,
      imageAsset: "snack-veg-burger.png",
      category: "Snacks",
    },
    {
      name: "Masala Chai",
      description: "Strong spiced milk tea brewed with ginger, cardamom, and tulsi.",
      price: 15,
      imageAsset: "beverage-masala-chai.png",
      category: "Beverages",
    },
    {
      name: "Cold Coffee",
      description: "Chilled blended coffee with milk and a hint of vanilla syrup.",
      price: 40,
      imageAsset: "beverage-cold-coffee.png",
      category: "Beverages",
    },
    {
      name: "Samosa (2 pcs)",
      description: "Crispy pastry stuffed with spiced potato and peas filling.",
      price: 20,
      imageAsset: "snack-samosa.png",
      category: "Snacks",
    },
    {
      name: "Gulab Jamun",
      description: "Soft khoya dumplings soaked in rose-flavoured sugar syrup.",
      price: 25,
      imageAsset: "dessert-gulab-jamun.png",
      category: "Desserts",
    },
  ],

  "rishabs-food-court": [
    {
      name: "Paneer Butter Masala + Roti",
      description: "Rich tomato-cream paneer gravy served with 2 soft wheat rotis.",
      price: 80,
      imageAsset: "meal-paneer-butter-masala.png",
      category: "Meals",
    },
    {
      name: "Veg Frankie Roll",
      description: "Spiced veggie filling wrapped in a thin whole-wheat paratha.",
      price: 50,
      imageAsset: "snack-veg-frankie-roll.png",
      category: "Snacks",
    },
    {
      name: "Chicken Frankie Roll",
      description: "Juicy chicken tikka filling wrapped in a crispy paratha.",
      price: 70,
      imageAsset: "snack-chicken-frankie-roll.png",
      category: "Snacks",
    },
    {
      name: "Pav Bhaji",
      description: "Spiced mashed vegetable curry served with buttered pav buns.",
      price: 55,
      imageAsset: "meal-pav-bhaji.png",
      category: "Meals",
    },
    {
      name: "Fresh Lime Soda",
      description: "Chilled lime juice with soda, black salt, and mint.",
      price: 30,
      imageAsset: "beverage-lime-soda.png",
      category: "Beverages",
    },
    {
      name: "Mango Lassi",
      description: "Thick yogurt-based drink blended with Alphonso mango pulp.",
      price: 50,
      imageAsset: "beverage-mango-lassi.png",
      category: "Beverages",
    },
    {
      name: "Chaat Plate",
      description: "Pani puri, bhel puri, and sev puri mixed chaat platter.",
      price: 40,
      imageAsset: "snack-chaat-plate.png",
      category: "Snacks",
    },
    {
      name: "Kulfi Falooda",
      description: "Chilled rose falooda with pistachio kulfi and basil seeds.",
      price: 60,
      imageAsset: "dessert-kulfi-falooda.png",
      category: "Desserts",
    },
  ],

  "snow-cubes": [
    {
      name: "Chocolate Milkshake",
      description: "Thick blended milkshake made with rich Belgian chocolate ice cream.",
      price: 70,
      imageAsset: "beverage-chocolate-milkshake.png",
      category: "Beverages",
    },
    {
      name: "Strawberry Waffle",
      description: "Crispy Belgian waffle topped with strawberry compote and whipped cream.",
      price: 90,
      imageAsset: "dessert-strawberry-waffle.png",
      category: "Desserts",
    },
    {
      name: "Oreo Shake",
      description: "Creamy blended shake with Oreo cookies and vanilla ice cream.",
      price: 80,
      imageAsset: "beverage-oreo-shake.png",
      category: "Beverages",
    },
    {
      name: "Vanilla Soft Serve",
      description: "Smooth soft-serve vanilla ice cream in a sugar cone.",
      price: 40,
      imageAsset: "dessert-vanilla-soft-serve.png",
      category: "Desserts",
    },
    {
      name: "Brownie Sundae",
      description: "Warm chocolate brownie topped with vanilla ice cream and hot fudge sauce.",
      price: 95,
      imageAsset: "dessert-brownie-sundae.png",
      category: "Desserts",
    },
    {
      name: "Iced Lemon Tea",
      description: "Refreshing chilled lemon tea with mint and honey.",
      price: 45,
      imageAsset: "beverage-iced-lemon-tea.png",
      category: "Beverages",
    },
    {
      name: "Fruit Bowl",
      description: "Seasonal fresh cut fruits with honey-lemon drizzle.",
      price: 55,
      imageAsset: "snack-fruit-bowl.png",
      category: "Snacks",
    },
    {
      name: "Nutella Pancakes",
      description: "Fluffy pancake stack drizzled with Nutella and crushed hazelnuts.",
      price: 85,
      imageAsset: "dessert-nutella-pancakes.png",
      category: "Desserts",
    },
  ],

  "metro-cafe": [
    {
      name: "Cappuccino",
      description: "Classic Italian espresso topped with steamed milk foam.",
      price: 60,
      imageAsset: "beverage-cappuccino.png",
      category: "Beverages",
    },
    {
      name: "Iced Coffee",
      description: "Double espresso poured over ice with cold milk and caramel drizzle.",
      price: 70,
      imageAsset: "beverage-iced-coffee.png",
      category: "Beverages",
    },
    {
      name: "Chicken Club Sandwich",
      description: "Triple-decker toasted sandwich with grilled chicken, bacon, lettuce, and mayo.",
      price: 90,
      imageAsset: "snack-chicken-club-sandwich.png",
      category: "Snacks",
    },
    {
      name: "Veg Wrap",
      description: "Whole-wheat tortilla filled with grilled veggies, hummus, and feta cheese.",
      price: 75,
      imageAsset: "snack-veg-wrap.png",
      category: "Snacks",
    },
    {
      name: "Croissant",
      description: "Buttery, flaky French croissant served with jam and butter.",
      price: 50,
      imageAsset: "snack-croissant.png",
      category: "Snacks",
    },
    {
      name: "Pasta Arrabbiata",
      description: "Penne pasta in spicy tomato and garlic sauce topped with parmesan.",
      price: 80,
      imageAsset: "meal-pasta-arrabbiata.png",
      category: "Meals",
    },
    {
      name: "Hot Chocolate",
      description: "Rich, velvety hot chocolate made with dark cocoa and steamed milk.",
      price: 65,
      imageAsset: "beverage-hot-chocolate.png",
      category: "Beverages",
    },
    {
      name: "Blueberry Cheesecake",
      description: "Creamy New York-style cheesecake with blueberry compote topping.",
      price: 85,
      imageAsset: "dessert-blueberry-cheesecake.png",
      category: "Desserts",
    },
  ],

  "pr-cafe": [
    {
      name: "Masala Dosa",
      description: "Crispy fermented rice crepe with spiced potato filling, served with chutneys.",
      price: 40,
      imageAsset: "meal-masala-dosa.png",
      category: "Meals",
    },
    {
      name: "Idli Sambar (3 pcs)",
      description: "Steamed rice idlis with lentil sambar, tomato chutney, and coconut chutney.",
      price: 30,
      imageAsset: "meal-idli-sambar.png",
      category: "Meals",
    },
    {
      name: "Uttapam",
      description: "Thick savoury rice pancake topped with onions, tomatoes, and green chillies.",
      price: 45,
      imageAsset: "meal-uttapam.png",
      category: "Meals",
    },
    {
      name: "Medu Vada (2 pcs)",
      description: "Crispy fried lentil donuts served with sambar and coconut chutney.",
      price: 25,
      imageAsset: "snack-medu-vada.png",
      category: "Snacks",
    },
    {
      name: "Filter Coffee",
      description: "Authentic South Indian decoction coffee with frothy milk.",
      price: 20,
      imageAsset: "beverage-filter-coffee.png",
      category: "Beverages",
    },
    {
      name: "Pongal",
      description: "Creamy rice-and-moong-dal dish tempered with cashews, ginger, and pepper.",
      price: 35,
      imageAsset: "meal-pongal.png",
      category: "Meals",
    },
    {
      name: "Rava Kesari",
      description: "Sweet semolina halwa flavoured with saffron and ghee, garnished with cashews.",
      price: 30,
      imageAsset: "dessert-rava-kesari.png",
      category: "Desserts",
    },
    {
      name: "Ragi Malt",
      description: "Nutritious finger millet porridge drink with jaggery and cardamom.",
      price: 25,
      imageAsset: "beverage-ragi-malt.png",
      category: "Beverages",
    },
  ],

  "aswins-food-court": [
    {
      name: "Veg Fried Rice",
      description: "Wok-tossed fried rice with mixed vegetables, soy sauce, and sesame oil.",
      price: 60,
      imageAsset: "meal-veg-fried-rice.png",
      category: "Meals",
    },
    {
      name: "Chicken Fried Rice",
      description: "Indo-Chinese style fried rice with shredded chicken and spring onion.",
      price: 80,
      imageAsset: "meal-chicken-fried-rice.png",
      category: "Meals",
    },
    {
      name: "Gobi Manchurian",
      description: "Crispy cauliflower florets tossed in a tangy Manchurian sauce.",
      price: 65,
      imageAsset: "snack-gobi-manchurian.png",
      category: "Snacks",
    },
    {
      name: "Chicken Noodles",
      description: "Hakka-style noodles stir-fried with chicken, egg, and soy sauce.",
      price: 75,
      imageAsset: "meal-chicken-noodles.png",
      category: "Meals",
    },
    {
      name: "Veg Noodles",
      description: "Stir-fried Hakka noodles with julienned vegetables and chilli sauce.",
      price: 55,
      imageAsset: "meal-veg-noodles.png",
      category: "Meals",
    },
    {
      name: "Paneer Chilli",
      description: "Crispy paneer cubes stir-fried with capsicum and Schezwan sauce.",
      price: 80,
      imageAsset: "snack-paneer-chilli.png",
      category: "Snacks",
    },
    {
      name: "Spring Rolls (4 pcs)",
      description: "Crispy vegetable-stuffed spring rolls served with sweet chilli dip.",
      price: 50,
      imageAsset: "snack-spring-rolls.png",
      category: "Snacks",
    },
    {
      name: "Thums Up / Pepsi",
      description: "Chilled 300ml cold drink can — your choice of cola.",
      price: 30,
      imageAsset: "beverage-cold-drink-can.png",
      category: "Beverages",
    },
  ],
};

// ─── Admin accounts (one per outlet) ────────────────────────────────────────

const adminCredentials = [
  { name: "Admin — Main Canteen", firstName: "Admin", lastName: "Main Canteen", email: "admin.maincanteen@zeroq.app", slug: "main-canteen" },
  {
    name: "Admin — Rishab's Food Court",
    firstName: "Admin",
    lastName: "Rishab's Food Court",
    email: "admin.rishabs@zeroq.app",
    slug: "rishabs-food-court",
  },
  { name: "Admin — Snow Cubes", firstName: "Admin", lastName: "Snow Cubes", email: "admin.snowcubes@zeroq.app", slug: "snow-cubes" },
  { name: "Admin — Metro Cafe", firstName: "Admin", lastName: "Metro Cafe", email: "admin.metrocafe@zeroq.app", slug: "metro-cafe" },
  { name: "Admin — PR Cafe", firstName: "Admin", lastName: "PR Cafe", email: "admin.prcafe@zeroq.app", slug: "pr-cafe" },
  {
    name: "Admin — Aswin's Food Court",
    firstName: "Admin",
    lastName: "Aswin's Food Court",
    email: "admin.aswins@zeroq.app",
    slug: "aswins-food-court",
  },
];

// ─── Main Seeder ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting ZeroQ database seed...\n");

  // 0. Clean database tables from scratch
  console.log("🧹 Clearing existing data from database...");
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.menuItem.deleteMany(),
    prisma.user.deleteMany(),
    prisma.outlet.deleteMany(),
  ]);
  console.log("   ✔ All tables cleared cleanly.\n");

  // 1. Seed outlets
  console.log("📍 Seeding outlets...");
  const outletMap: Record<string, string> = {}; // slug -> id

  for (const outletData of outlets) {
    const outlet = await prisma.outlet.upsert({
      where: { slug: outletData.slug },
      update: {},
      create: outletData,
    });
    outletMap[outlet.slug] = outlet.id;
    console.log(`   ✔ ${outlet.name} (${outlet.id})`);
  }

  // 2. Seed student account (Task 1.2: populate firstName + lastName)
  console.log("\n👤 Seeding student account...");
  await prisma.user.upsert({
    where: { email: "student@zeroq.app" },
    update: { firstName: "Alex", lastName: "Student" },
    create: {
      name: "Alex Student",
      firstName: "Alex",
      lastName: "Student",
      email: "student@zeroq.app",
      password: await hash("student123"),
      role: Role.STUDENT,
    },
  });
  console.log("   ✔ student@zeroq.app (password: student123) → firstName: Alex, lastName: Student");

  // 3. Seed admin accounts (Task 1.2: populate firstName + lastName)
  console.log("\n🔐 Seeding admin accounts...");
  for (const admin of adminCredentials) {
    const outletId = outletMap[admin.slug];
    await prisma.user.upsert({
      where: { email: admin.email },
      update: { firstName: admin.firstName, lastName: admin.lastName },
      create: {
        name: admin.name,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: await hash("admin123"),
        role: Role.ADMIN,
        outletId,
      },
    });
    console.log(`   ✔ ${admin.email} (password: admin123) → ${admin.slug}`);
  }

  // 3b. Seed Yashwanth student accounts with password Yash@123
  console.log("\n👤 Seeding Yashwanth student accounts...");
  const yashwanthEmails = [
    "yashwantharumugam2007@gmail.com",
    "yashwanth2025offl@gmail.com",
    "yashwanth2510445@ssn.edu.in",
  ];
  const yashPasswordHash = await hash("Yash@123");

  for (const email of yashwanthEmails) {
    await prisma.user.upsert({
      where: { email },
      update: {
        name: "Yashwanth A",
        firstName: "Yashwanth",
        lastName: "A",
        password: yashPasswordHash,
        role: Role.STUDENT,
      },
      create: {
        name: "Yashwanth A",
        firstName: "Yashwanth",
        lastName: "A",
        email,
        password: yashPasswordHash,
        role: Role.STUDENT,
      },
    });
    console.log(`   ✔ ${email} (password: Yash@123) → firstName: Yashwanth, lastName: A`);
  }

  // 4. Seed menu items
  console.log("\n🍽️  Seeding menu items...");
  for (const [slug, items] of Object.entries(menuByOutlet)) {
    const outletId = outletMap[slug];
    if (!outletId) {
      console.warn(`   ⚠️  No outlet found for slug: ${slug}, skipping.`);
      continue;
    }
    for (const item of items) {
      await prisma.menuItem.upsert({
        where: {
          // Use a composite-like unique check via findFirst + create pattern
          // Since Prisma doesn't support composite unique on name+outletId in this version,
          // we rely on the name being descriptive enough. Adjust if you add @@unique([name, outletId]) to schema.
          id: `${slug}-${item.imageAsset}`, // deterministic placeholder; won't match → always create
        },
        update: {},
        create: {
          ...item,
          outletId,
        },
      });
    }
    console.log(`   ✔ ${items.length} items seeded for ${slug}`);
  }

  console.log("\n✅ Seed complete!");
  console.log("\n📋 Login Credentials Summary:");
  console.log("   Student   → student@zeroq.app   / student123");
  console.log("   Yashwanth → yashwanth*@...      / Yash@123");
  console.log("   Admin(s)  → admin.[outlet]@zeroq.app / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
