-- ============================================================
-- ZeroQ — Oracle Database Schema
-- Target PDB : FREEPDB1  |  User : zerq_app
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. OUTLETS
-- ────────────────────────────────────────────────────────────
CREATE TABLE outlets (
    outlet_id   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR2(100)  NOT NULL,
    description VARCHAR2(255),
    is_active   NUMBER(1)      DEFAULT 1 NOT NULL CHECK (is_active IN (0, 1))
);

-- ────────────────────────────────────────────────────────────
-- 2. MENU ITEMS
-- ────────────────────────────────────────────────────────────
CREATE TABLE menu_items (
    item_id       NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    outlet_id     NUMBER         NOT NULL REFERENCES outlets(outlet_id),
    name          VARCHAR2(150)  NOT NULL,
    description   VARCHAR2(300),
    price         NUMBER(8, 2)   NOT NULL CHECK (price >= 0),
    category      VARCHAR2(80),
    is_available  NUMBER(1)      DEFAULT 1 NOT NULL CHECK (is_available IN (0, 1)),
    image_url     VARCHAR2(500)
);

-- ────────────────────────────────────────────────────────────
-- 3. ORDERS
-- ────────────────────────────────────────────────────────────
CREATE TABLE orders (
    order_id        VARCHAR2(12)   PRIMARY KEY,   -- e.g. ZQ-0001
    outlet_id       NUMBER         NOT NULL REFERENCES outlets(outlet_id),
    student_name    VARCHAR2(150)  NOT NULL,
    total_amount    NUMBER(10, 2)  NOT NULL CHECK (total_amount >= 0),
    status          VARCHAR2(20)   DEFAULT 'ORDERED' NOT NULL
                        CHECK (status IN ('ORDERED', 'READY', 'DELIVERED')),
    created_at      TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
    updated_at      TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL
);

-- Sequence for human-readable order IDs
CREATE SEQUENCE order_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- ────────────────────────────────────────────────────────────
-- 4. ORDER ITEMS
-- ────────────────────────────────────────────────────────────
CREATE TABLE order_items (
    order_item_id  NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id       VARCHAR2(12)  NOT NULL REFERENCES orders(order_id),
    item_id        NUMBER        NOT NULL REFERENCES menu_items(item_id),
    quantity       NUMBER        NOT NULL CHECK (quantity > 0),
    unit_price     NUMBER(8, 2)  NOT NULL CHECK (unit_price >= 0)
);

-- ────────────────────────────────────────────────────────────
-- 5. TRIGGER — auto-update orders.updated_at
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSTIMESTAMP;
END;
/

-- ────────────────────────────────────────────────────────────
-- 6. SEED DATA — Outlets
-- ────────────────────────────────────────────────────────────
INSERT INTO outlets (name, description) VALUES
    ('MC', 'Main Canteen — hot meals, snacks & beverages');
INSERT INTO outlets (name, description) VALUES
    ('Rishab Food Court', 'Multi-cuisine food court on the second floor');

-- ────────────────────────────────────────────────────────────
-- 7. SEED DATA — MC Menu Items (outlet_id = 1)
-- ────────────────────────────────────────────────────────────
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Veg Thali',       'Full meal with roti, dal, sabzi, rice & pickle',  70,  'Meals');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Chicken Biryani', 'Fragrant basmati rice with spiced chicken',        90,  'Meals');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Egg Fried Rice',  'Wok-tossed rice with eggs & vegetables',           60,  'Meals');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Masala Dosa',     'Crispy dosa with potato filling & chutneys',       45,  'Breakfast');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Idli Sambar',     '3 soft idlis served with sambar & chutney',        35,  'Breakfast');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Poha',            'Flattened rice with onion, mustard & coriander',   25,  'Breakfast');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Vada Pav',        'Spiced potato fritter in a soft bun',              20,  'Snacks');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Samosa (2 pcs)',  'Golden crispy pastry with spiced potato filling',  20,  'Snacks');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Tea',             'Ginger masala chai',                               10,  'Beverages');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Filter Coffee',   'South Indian filter coffee',                       15,  'Beverages');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (1, 'Fresh Lime Soda', 'Sweet or salted lime soda',                        25,  'Beverages');

-- ────────────────────────────────────────────────────────────
-- 8. SEED DATA — Rishab Food Court Menu Items (outlet_id = 2)
-- ────────────────────────────────────────────────────────────
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Paneer Butter Masala + Naan', 'Rich tomato gravy with cottage cheese & 2 naans', 110, 'North Indian');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Dal Makhani + Rice',          'Slow-cooked black lentils with steamed rice',       85,  'North Indian');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Chole Bhature',               '2 fluffy bhature with spiced chickpea curry',        65,  'North Indian');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Chicken Shawarma Roll',       'Grilled chicken, garlic sauce & veggies in a wrap',  80,  'Fast Food');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Veg Burger',                  'Crispy veggie patty, lettuce, tomato & cheese',       55,  'Fast Food');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Loaded Fries',                'Seasoned fries with cheese sauce & jalapeños',        60,  'Fast Food');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Veg Hakka Noodles',           'Stir-fried noodles with mixed vegetables',            65,  'Chinese');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Chilli Chicken (Dry)',        'Crispy chicken tossed with chillis & bell peppers',   95,  'Chinese');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Manchurian Fried Rice',       'Veggie manchurian balls with fried rice',             75,  'Chinese');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Mango Lassi',                 'Thick blended mango yogurt drink',                    40,  'Beverages');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Cold Coffee',                 'Blended iced coffee with milk',                       50,  'Beverages');
INSERT INTO menu_items (outlet_id, name, description, price, category) VALUES
    (2, 'Gulab Jamun (2 pcs)',         'Soft milk-solid dumplings in rose sugar syrup',       30,  'Desserts');

COMMIT;
