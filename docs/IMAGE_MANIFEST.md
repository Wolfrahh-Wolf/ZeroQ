# ZeroQ — Image Asset Manifest

> All images must be `1:1 square aspect ratio` with `object-cover` rendering.
> Formats: `.webp` for outlets (better compression), `.png` for menu items (crisp edges).
> Target directory: `public/assets/`

---

## Part A — Outlet Thumbnails

> These 6 images represent the campus outlet storefronts/logos.

| File Name | Entity | Format | Aspect Ratio | AI Generation Prompt |
|-----------|--------|--------|--------------|---------------------|
| `outlet-main-canteen.webp` | Main Canteen | `.webp` | `1:1` `aspect-square object-cover` | *"A bright, clean Indian college canteen serving hot meals, wide stainless steel counter with food trays, white tiles, warm lighting, realistic photography style, square crop, no text"* |
| `outlet-rishabs-food-court.webp` | Rishab's Food Court | `.webp` | `1:1` `aspect-square object-cover` | *"A vibrant North Indian food court stall with colourful banners, a young chef serving rolls and biryani behind a glass counter, warm ambient lighting, realistic food photography, square crop, no text"* |
| `outlet-snow-cubes.webp` | Snow Cubes | `.webp` | `1:1` `aspect-square object-cover` | *"A pastel-coloured dessert shop with ice cream cones, milkshakes, and waffles on display, soft pink and white interior, soft bokeh lighting, square crop, no text, realistic photo"* |
| `outlet-metro-cafe.webp` | Metro Cafe | `.webp` | `1:1` `aspect-square object-cover` | *"A modern minimalist café interior with exposed brick, barista counter, espresso machine, warm Edison bulb lighting, clean and premium feel, square crop, no text, realistic photography"* |
| `outlet-pr-cafe.webp` | PR Cafe | `.webp` | `1:1` `aspect-square object-cover` | *"A traditional South Indian tiffin shop with freshly made dosas on a griddle, steel plates, banana leaf, yellow walls, morning light, realistic photo, square crop, no text"* |
| `outlet-aswins-food-court.webp` | Aswin's Food Court | `.webp` | `1:1` `aspect-square object-cover` | *"A bustling Indo-Chinese food court stall with a wok on a high-flame gas stove, noodles and fried rice being tossed, dramatic flame light, dark moody background, realistic food photography, square crop, no text"* |

---

## Part B — Menu Item Thumbnails (Shop-Agnostic)

> These images are reusable across outlets. Multiple outlets sharing a similar item (e.g., fried rice) use the same asset.

### Category: Meals

| File Name | Description | Format | Aspect Ratio | AI Generation Prompt |
|-----------|------------|--------|--------------|---------------------|
| `meal-veg-thali.png` | Full South Indian veg plate | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of a traditional South Indian veg thali on a banana leaf with rice, sambar, rasam, kootu, pickle, and papad, bright natural lighting, food photography, square crop"* |
| `meal-chicken-biryani.png` | Chicken biryani | `.png` | `1:1` `aspect-square object-cover` | *"Close-up overhead shot of fragrant chicken biryani with saffron-yellow rice, whole spices, caramelized onions, and mint leaves in a clay pot, professional food photography, square crop"* |
| `meal-egg-fried-rice.png` | Egg fried rice | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of golden egg fried rice in a white bowl with scrambled egg streaks, spring onions, and sesame seeds, bright studio lighting, square crop, food photography"* |
| `meal-paneer-butter-masala.png` | Paneer butter masala + roti | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of creamy paneer butter masala in a white bowl with bright orange-red tomato gravy and fresh cream swirl, soft rotis alongside, Indian restaurant food photo, square crop"* |
| `meal-pav-bhaji.png` | Pav bhaji | `.png` | `1:1` `aspect-square object-cover` | *"Close-up shot of dark spiced pav bhaji with butter melting on top, served with toasted pav buns and lemon wedge, street food photography, overhead, square crop"* |
| `meal-masala-dosa.png` | Masala dosa | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of a crispy golden-brown masala dosa rolled on a banana leaf with coconut chutney and sambar in small bowls, bright morning light, food photography, square crop"* |
| `meal-idli-sambar.png` | Idli sambar | `.png` | `1:1` `aspect-square object-cover` | *"Three soft white idlis on a white plate with a small bowl of yellow sambar and green coconut chutney, clean white background, bright lighting, food photography, square crop"* |
| `meal-uttapam.png` | Uttapam | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of a thick round uttapam with colourful onion and tomato topping, golden edges, on a cast iron pan, warm kitchen lighting, square crop, food photography"* |
| `meal-pongal.png` | Pongal | `.png` | `1:1` `aspect-square object-cover` | *"Close-up of creamy golden Pongal rice-dal dish in a clay bowl, tempered with ghee, cashews, black pepper, and curry leaves, warm light, food photography, square crop"* |
| `meal-veg-fried-rice.png` | Veg fried rice | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of colourful vegetable fried rice in a white bowl with carrot, capsicum, peas, and spring onion, bright studio lighting, food photography, square crop"* |
| `meal-chicken-fried-rice.png` | Chicken fried rice | `.png` | `1:1` `aspect-square object-cover` | *"Indo-Chinese chicken fried rice in a white bowl, shredded chicken pieces, egg, soy-sauce glaze, spring onion garnish, dark moody background, food photography, square crop"* |
| `meal-chicken-noodles.png` | Chicken noodles | `.png` | `1:1` `aspect-square object-cover` | *"Hakka chicken noodles in a white bowl with thick wheat noodles, shredded chicken, capsicum, and soy glaze, overhead food photography, dark background, square crop"* |
| `meal-veg-noodles.png` | Veg noodles | `.png` | `1:1` `aspect-square object-cover` | *"Indo-Chinese veg Hakka noodles in a white bowl with julienned carrots, cabbage, and spring onions, bright clean background, food photography, square crop"* |
| `meal-pasta-arrabbiata.png` | Pasta arrabbiata | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of penne pasta in spicy red arrabbiata tomato sauce, garnished with fresh parsley and grated parmesan, white ceramic bowl, Italian food photography, square crop"* |

### Category: Snacks

| File Name | Description | Format | Aspect Ratio | AI Generation Prompt |
|-----------|------------|--------|--------------|---------------------|
| `snack-veg-burger.png` | Veg burger | `.png` | `1:1` `aspect-square object-cover` | *"Side-angle shot of a tall veg burger with crispy aloo patty, lettuce, tomato, and mayo in a sesame bun, studio food photography, white background, square crop"* |
| `snack-samosa.png` | Samosa | `.png` | `1:1` `aspect-square object-cover` | *"Two golden-brown crispy samosas on a white plate with green chutney dip, overhead food photography, white background, square crop"* |
| `snack-veg-frankie-roll.png` | Veg Frankie roll | `.png` | `1:1` `aspect-square object-cover` | *"A veg frankie roll wrapped in foil, cut in half to show spiced veggie filling in a paratha, street food photography, overhead, square crop"* |
| `snack-chicken-frankie-roll.png` | Chicken Frankie roll | `.png` | `1:1` `aspect-square object-cover` | *"A chicken tikka frankie roll wrapped in foil, cut diagonally to show juicy chicken filling, paratha wrap, Indian street food photography, overhead, square crop"* |
| `snack-chaat-plate.png` | Chaat plate | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of a colourful Indian chaat platter with pani puri shells, bhel puri, sev puri, tamarind chutney, and green chutney, vibrant colours, food photography, square crop"* |
| `snack-medu-vada.png` | Medu vada | `.png` | `1:1` `aspect-square object-cover` | *"Two golden-brown crispy medu vada (lentil donuts) on a white plate with coconut chutney and sambar, overhead food photography, bright lighting, square crop"* |
| `snack-gobi-manchurian.png` | Gobi Manchurian | `.png` | `1:1` `aspect-square object-cover` | *"Crispy battered cauliflower florets in a dark tangy Manchurian sauce, garnished with spring onion, in a white bowl, dark moody background, food photography, square crop"* |
| `snack-paneer-chilli.png` | Paneer chilli | `.png` | `1:1` `aspect-square object-cover` | *"Crispy paneer cubes stir-fried with green capsicum and onion in a glossy Schezwan sauce, white plate, dark background, Indo-Chinese food photography, square crop"* |
| `snack-spring-rolls.png` | Spring rolls | `.png` | `1:1` `aspect-square object-cover` | *"Four golden crispy spring rolls on a white plate with sweet chilli dipping sauce, overhead food photography, white background, square crop"* |
| `snack-fruit-bowl.png` | Fruit bowl | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of a colourful fresh fruit bowl with watermelon, mango, grapes, and kiwi slices, honey drizzle, white ceramic bowl, bright natural light, square crop"* |
| `snack-croissant.png` | Croissant | `.png` | `1:1` `aspect-square object-cover` | *"A golden-brown buttery croissant on a white plate with a small jar of strawberry jam and butter, café photography, soft morning light, square crop"* |
| `snack-chicken-club-sandwich.png` | Chicken club sandwich | `.png` | `1:1` `aspect-square object-cover` | *"A triple-decker chicken club sandwich with grilled chicken, lettuce, tomato, and mayo, secured with a toothpick, side-angle food photography, white background, square crop"* |
| `snack-veg-wrap.png` | Veg wrap | `.png` | `1:1` `aspect-square object-cover` | *"A whole-wheat tortilla wrap filled with grilled vegetables and hummus, cut diagonally, overhead café food photography, white background, square crop"* |

### Category: Beverages

| File Name | Description | Format | Aspect Ratio | AI Generation Prompt |
|-----------|------------|--------|--------------|---------------------|
| `beverage-masala-chai.png` | Masala chai | `.png` | `1:1` `aspect-square object-cover` | *"A glass of steaming masala chai with visible ginger and cardamom, on a wooden surface, warm morning light, food photography, square crop"* |
| `beverage-cold-coffee.png` | Cold coffee | `.png` | `1:1` `aspect-square object-cover` | *"A tall glass of chilled cold coffee with ice cubes, whipped cream on top, and a straw, studio lighting, dark background, square crop, food photography"* |
| `beverage-lime-soda.png` | Fresh lime soda | `.png` | `1:1` `aspect-square object-cover` | *"A tall glass of fresh lime soda with ice, mint leaves, and a lime wedge, bright studio lighting, white background, square crop"* |
| `beverage-mango-lassi.png` | Mango lassi | `.png` | `1:1` `aspect-square object-cover` | *"A tall glass of thick mango lassi with a golden-yellow colour, garnished with a mint sprig and mango slice, white background, food photography, square crop"* |
| `beverage-chocolate-milkshake.png` | Chocolate milkshake | `.png` | `1:1` `aspect-square object-cover` | *"A tall chocolate milkshake in a clear glass with whipped cream, chocolate drizzle, and a straw, dark moody background, food photography, square crop"* |
| `beverage-oreo-shake.png` | Oreo shake | `.png` | `1:1` `aspect-square object-cover` | *"A thick Oreo milkshake in a clear glass with Oreo crumbles on top and a black straw, white and dark contrast background, food photography, square crop"* |
| `beverage-iced-lemon-tea.png` | Iced lemon tea | `.png` | `1:1` `aspect-square object-cover` | *"A clear glass of golden iced lemon tea with ice cubes, lemon slices, and mint, bright natural lighting, square crop, food photography"* |
| `beverage-filter-coffee.png` | Filter coffee | `.png` | `1:1` `aspect-square object-cover` | *"A traditional South Indian filter coffee in a steel tumbler and dabara on a saucer, frothy top, warm golden light, food photography, square crop"* |
| `beverage-ragi-malt.png` | Ragi malt | `.png` | `1:1` `aspect-square object-cover` | *"A warm glass of dark brown ragi malt drink with steam, on a wooden surface, earthy tones, food photography, square crop"* |
| `beverage-cappuccino.png` | Cappuccino | `.png` | `1:1` `aspect-square object-cover` | *"Overhead shot of a cappuccino in a white ceramic cup with a latte art heart, on a dark marble surface, café photography, square crop"* |
| `beverage-iced-coffee.png` | Iced coffee | `.png` | `1:1` `aspect-square object-cover` | *"A tall glass of iced coffee with double espresso, ice cubes, cold milk, and a caramel drizzle, dark background, moody café photography, square crop"* |
| `beverage-hot-chocolate.png` | Hot chocolate | `.png` | `1:1` `aspect-square object-cover` | *"A white ceramic mug of rich dark hot chocolate with mini marshmallows, steaming gently, warm cozy lighting, café photography, square crop"* |
| `beverage-cold-drink-can.png` | Cold drink can | `.png` | `1:1` `aspect-square object-cover` | *"A chilled cola can with water droplets on a dark surface, studio product photography, square crop, no visible brand text"* |

### Category: Desserts

| File Name | Description | Format | Aspect Ratio | AI Generation Prompt |
|-----------|------------|--------|--------------|---------------------|
| `dessert-gulab-jamun.png` | Gulab jamun | `.png` | `1:1` `aspect-square object-cover` | *"Three golden-brown gulab jamuns soaked in rose-flavoured sugar syrup in a white bowl, garnished with pistachio slivers, overhead food photography, square crop"* |
| `dessert-kulfi-falooda.png` | Kulfi falooda | `.png` | `1:1` `aspect-square object-cover` | *"A tall glass of pink rose falooda with thin vermicelli, basil seeds, and a stick of pistachio kulfi on top, colourful and vibrant, food photography, square crop"* |
| `dessert-strawberry-waffle.png` | Strawberry waffle | `.png` | `1:1` `aspect-square object-cover` | *"A Belgian waffle topped with fresh strawberry compote, whipped cream, and a drizzle of strawberry sauce on a white plate, overhead food photography, square crop"* |
| `dessert-vanilla-soft-serve.png` | Vanilla soft serve | `.png` | `1:1` `aspect-square object-cover` | *"A classic swirled vanilla soft-serve ice cream in a waffle cone, white background, bright studio lighting, food photography, square crop"* |
| `dessert-brownie-sundae.png` | Brownie sundae | `.png` | `1:1` `aspect-square object-cover` | *"A warm chocolate brownie topped with a scoop of vanilla ice cream and hot fudge sauce drizzle, white plate, dark background, food photography, square crop"* |
| `dessert-nutella-pancakes.png` | Nutella pancakes | `.png` | `1:1` `aspect-square object-cover` | *"A stack of three fluffy pancakes drizzled with Nutella and crushed hazelnuts, with a dusting of icing sugar, overhead café food photography, square crop"* |
| `dessert-rava-kesari.png` | Rava kesari | `.png` | `1:1` `aspect-square object-cover` | *"Close-up of bright orange saffron-flavoured rava kesari (semolina halwa) in a steel bowl, garnished with cashews and raisins, traditional Indian food photography, square crop"* |
| `dessert-blueberry-cheesecake.png` | Blueberry cheesecake | `.png` | `1:1` `aspect-square object-cover` | *"A slice of New York cheesecake with a thick blueberry compote topping and graham cracker crust, white plate, studio food photography, square crop"* |

---

## Summary Counts

| Category | Count |
|----------|-------|
| Outlet Thumbnails | 6 |
| Meals | 14 |
| Snacks | 13 |
| Beverages | 13 |
| Desserts | 8 |
| **Total** | **54** |

---

## Asset Directory Structure

```
public/
└── assets/
    ├── outlets/
    │   ├── outlet-main-canteen.webp
    │   ├── outlet-rishabs-food-court.webp
    │   ├── outlet-snow-cubes.webp
    │   ├── outlet-metro-cafe.webp
    │   ├── outlet-pr-cafe.webp
    │   └── outlet-aswins-food-court.webp
    └── items/
        ├── meal-*.png           (14 files)
        ├── snack-*.png          (13 files)
        ├── beverage-*.png       (13 files)
        └── dessert-*.png        (8 files)
```

---

## Usage in Code

```tsx
// Outlet card image
<Image
  src={`/assets/outlets/${outlet.imageUrl}`}
  alt={outlet.name}
  fill
  className="object-cover"
/>

// Menu item card image
<Image
  src={`/assets/items/${menuItem.imageAsset}`}
  alt={menuItem.name}
  fill
  className="object-cover"
/>
```

> **Note**: Both containers must use `className="relative aspect-square"` on the parent div to enforce 1:1 crop via `fill` + `object-cover` pattern from `next/image`.
