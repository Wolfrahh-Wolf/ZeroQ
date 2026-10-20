// ZeroQ Database Seeder
// Connects in pure Thin mode and seeds outlets and menu items cleanly.
const oracledb = require("oracledb");

async function seed() {
  let conn;
  try {
    conn = await oracledb.getConnection({
      user: process.env.DB_USER || "zerq_app",
      password: process.env.DB_PASSWORD || "ZeroQ_App1",
      connectString: process.env.DB_CONNECTION_STRING || "localhost:1521/FREEPDB1",
    });

    console.log("Connected to Oracle FREEPDB1 as zerq_app (Thin mode)");

    // Clean existing data
    try { await conn.execute("DELETE FROM order_items"); } catch (_) {}
    try { await conn.execute("DELETE FROM orders"); } catch (_) {}
    try { await conn.execute("DELETE FROM menu_items"); } catch (_) {}
    try { await conn.execute("DELETE FROM outlets"); } catch (_) {}
    await conn.commit();

    // Ensure sequence exists
    try {
      await conn.execute("DROP SEQUENCE order_seq");
    } catch (_) {}
    await conn.execute("CREATE SEQUENCE order_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE");

    // Insert Outlets (explicit IDs or let identity work)
    // To ensure outlet_id 1 is MC and 2 is Rishab Food Court:
    await conn.execute(
      `INSERT INTO outlets (name, description, is_active) VALUES (:name, :desc, 1)`,
      { name: "MC", desc: "Main Canteen — hot meals, snacks & beverages" }
    );
    await conn.execute(
      `INSERT INTO outlets (name, description, is_active) VALUES (:name, :desc, 1)`,
      { name: "Rishab Food Court", desc: "Multi-cuisine food court on the second floor" }
    );
    await conn.commit();

    const outletsRes = await conn.execute("SELECT outlet_id, name FROM outlets ORDER BY outlet_id", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log("Seeded outlets:", outletsRes.rows);

    const mcId = outletsRes.rows.find((r) => r.NAME === "MC").OUTLET_ID;
    const rfcId = outletsRes.rows.find((r) => r.NAME === "Rishab Food Court").OUTLET_ID;

    // MC Menu Items
    const mcItems = [
      { name: "Veg Thali", desc: "Full meal with roti, dal, sabzi, rice & pickle", price: 70, cat: "Meals" },
      { name: "Chicken Biryani", desc: "Fragrant basmati rice with spiced chicken", price: 90, cat: "Meals" },
      { name: "Egg Fried Rice", desc: "Wok-tossed rice with eggs & vegetables", price: 60, cat: "Meals" },
      { name: "Masala Dosa", desc: "Crispy dosa with potato filling & chutneys", price: 45, cat: "Breakfast" },
      { name: "Idli Sambar", desc: "3 soft idlis served with sambar & chutney", price: 35, cat: "Breakfast" },
      { name: "Poha", desc: "Flattened rice with onion, mustard & coriander", price: 25, cat: "Breakfast" },
      { name: "Vada Pav", desc: "Spiced potato fritter in a soft bun", price: 20, cat: "Snacks" },
      { name: "Samosa (2 pcs)", desc: "Golden crispy pastry with spiced potato filling", price: 20, cat: "Snacks" },
      { name: "Tea", desc: "Ginger masala chai", price: 10, cat: "Beverages" },
      { name: "Filter Coffee", desc: "South Indian filter coffee", price: 15, cat: "Beverages" },
      { name: "Fresh Lime Soda", desc: "Sweet or salted lime soda", price: 25, cat: "Beverages" },
    ];

    for (const item of mcItems) {
      await conn.execute(
        `INSERT INTO menu_items (outlet_id, name, description, price, category, is_available)
         VALUES (:outlet_id, :name, :description, :price, :category, 1)`,
        { outlet_id: mcId, name: item.name, description: item.desc, price: item.price, category: item.cat }
      );
    }

    // Rishab Food Court Menu Items
    const rfcItems = [
      { name: "Paneer Butter Masala + Naan", desc: "Rich tomato gravy with cottage cheese & 2 naans", price: 110, cat: "North Indian" },
      { name: "Dal Makhani + Rice", desc: "Slow-cooked black lentils with steamed rice", price: 85, cat: "North Indian" },
      { name: "Chole Bhature", desc: "2 fluffy bhature with spiced chickpea curry", price: 65, cat: "North Indian" },
      { name: "Chicken Shawarma Roll", desc: "Grilled chicken, garlic sauce & veggies in a wrap", price: 80, cat: "Fast Food" },
      { name: "Veg Burger", desc: "Crispy veggie patty, lettuce, tomato & cheese", price: 55, cat: "Fast Food" },
      { name: "Loaded Fries", desc: "Seasoned fries with cheese sauce & jalapeños", price: 60, cat: "Fast Food" },
      { name: "Veg Hakka Noodles", desc: "Stir-fried noodles with mixed vegetables", price: 65, cat: "Chinese" },
      { name: "Chilli Chicken (Dry)", desc: "Crispy chicken tossed with chillis & bell peppers", price: 95, cat: "Chinese" },
      { name: "Manchurian Fried Rice", desc: "Veggie manchurian balls with fried rice", price: 75, cat: "Chinese" },
      { name: "Mango Lassi", desc: "Thick blended mango yogurt drink", price: 40, cat: "Beverages" },
      { name: "Cold Coffee", desc: "Blended iced coffee with milk", price: 50, cat: "Beverages" },
      { name: "Gulab Jamun (2 pcs)", desc: "Soft milk-solid dumplings in rose sugar syrup", price: 30, cat: "Desserts" },
    ];

    for (const item of rfcItems) {
      await conn.execute(
        `INSERT INTO menu_items (outlet_id, name, description, price, category, is_available)
         VALUES (:outlet_id, :name, :description, :price, :category, 1)`,
        { outlet_id: rfcId, name: item.name, description: item.desc, price: item.price, category: item.cat }
      );
    }

    await conn.commit();

    const countRes = await conn.execute("SELECT COUNT(*) AS CNT FROM menu_items", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    console.log(`Successfully seeded ${countRes.rows[0].CNT} menu items!`);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  } finally {
    if (conn) {
      try { await conn.close(); } catch (_) {}
    }
  }
}

seed();
