import React, { useState, useEffect, useRef, useMemo } from "react";
import { MenuItemCard } from "./ui/menu-item-card";
import { Search, SlidersHorizontal, ShoppingCart } from 'lucide-react';
import { useCart } from "../context/CartContext";

const menuCategories = {
  "Most Popular": [
    {
      imageUrl: "https://i.pinimg.com/1200x/9a/65/90/9a65906e09943ce49c876dbe7509af86.jpg",
      name: "Paneer Butter Masala",
      rating: 4.9,
      price: 350,
      description: "Rich & creamy curry",
    },
    {
      imageUrl: "https://i.pinimg.com/1200x/c1/16/82/c11682efd8412b401ac14ea1d52e0a98.jpg",
      name: "Dal Makhani",
      rating: 4.8,
      price: 300,
      description: "Creamy black lentils",
    },
    {
      imageUrl: "https://i.pinimg.com/1200x/3f/e9/da/3fe9dab3b8ab33d4f4cd2456b92d7f26.jpg",
      name: "Veg Biryani",
      rating: 4.7,
      price: 320,
      description: "Aromatic rice dish",
    },
    {
      imageUrl: "https://i.pinimg.com/736x/9e/62/bd/9e62bd346451520d570671472b364180.jpg",
      name: "Hara Bhara Kebab",
      rating: 4.6,
      price: 220,
      description: "Spinach & pea patties",
    },
     {
      imageUrl: "https://i.pinimg.com/736x/a9/3d/77/a93d77d3e242262f2c919bf66aef5b39.jpg",
      name: "Gulab Jamun",
      rating: 4.9,
      price: 120,
      description: "Sweet milk solids",
    },
  ],
  "Starters": [
     {
      imageUrl: "https://i.pinimg.com/736x/5f/d4/32/5fd4328d6e3d5ad1b01b2c5d132d27e7.jpg",
      name: "Paneer Tikka",
      rating: 4.8,
      price: 250,
      description: "Grilled cottage cheese",
    },
    {
      imageUrl: "https://i.pinimg.com/736x/9e/62/bd/9e62bd346451520d570671472b364180.jpg",
      name: "Hara Bhara Kebab",
      rating: 4.6,
      price: 220,
      description: "Spinach & pea patties",
    },
    {
      imageUrl: "https://i.pinimg.com/1200x/fc/27/b4/fc27b450c15deca55247d8f0fb4a1710.jpg",
      name: "Dahi Ke Kebab",
      rating: 4.7,
      price: 240,
      description: "Yogurt patties",
    },
    {
      imageUrl: "https://i.pinimg.com/1200x/cb/49/0a/cb490a414dbc89ceec2f05b201f5226a.jpg",
      name: "Veg Seekh Kebab",
      rating: 4.5,
      price: 230,
      description: "Minced veg skewers",
    },
    {
      imageUrl: "https://i.pinimg.com/736x/52/84/0e/52840e9a80ba6d85f289aabc0578f9a8.jpg",
      name: "Chilli Paneer Dry",
      rating: 4.6,
      price: 260,
      description: "Spicy & tangy",
    },
    {
      imageUrl: "https://i.pinimg.com/736x/e8/49/97/e849973f5d177440cf2d9cdbcbca24e9.jpg",
      name: "Veg Manchurian Dry",
      rating: 4.5,
      price: 240,
      description: "Indo-Chinese delight",
    }
  ],
  "Soups": [
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Tomato_soup.jpg/250px-Tomato_soup.jpg",
      name: "Tomato Soup",
      rating: 4.4,
      price: 150,
      description: "Classic & comforting",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Manchow_Soup.jpg/220px-Manchow_Soup.jpg",
      name: "Manchow Soup",
      rating: 4.6,
      price: 160,
      description: "Spicy & savory",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Sweet_corn_soup_at_a_Chinese_restaurant_in_Kolkata.jpg/220px-Sweet_corn_soup_at_a_Chinese_restaurant_in_Kolkata.jpg",
      name: "Sweet Corn Soup",
      rating: 4.5,
      price: 160,
      description: "Creamy & sweet",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Hot_and_Sour_Soup.jpg/220px-Hot_and_Sour_Soup.jpg",
      name: "Hot & Sour Soup",
      rating: 4.5,
      price: 160,
      description: "Tangy & spicy",
    }
  ],
  "Paneer Specials": [
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Paneer_Butter_Masala_%28cropped%29.jpg/250px-Paneer_Butter_Masala_%28cropped%29.jpg",
      name: "Paneer Butter Masala",
      rating: 4.9,
      price: 350,
      description: "Rich & creamy curry",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Shahi_Paneer_Makhani.jpg/220px-Shahi_Paneer_Makhani.jpg",
      name: "Shahi Paneer",
      rating: 4.8,
      price: 360,
      description: "Royal paneer curry",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Kadai_paneer.jpg/250px-Kadai_paneer.jpg",
      name: "Kadai Paneer",
      rating: 4.7,
      price: 340,
      description: "Spicy & flavorful",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Palak_Paneer.jpg/220px-Palak_Paneer.jpg",
      name: "Palak Paneer",
      rating: 4.6,
      price: 330,
      description: "Spinach & paneer",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Paneer_Tikka_Masala_with_chapati.jpg/250px-Paneer_Tikka_Masala_with_chapati.jpg",
      name: "Paneer Tikka Masala",
      rating: 4.8,
      price: 370,
      description: "Grilled paneer curry",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Matar_paneer_001.jpg/220px-Matar_paneer_001.jpg",
      name: "Matar Paneer",
      rating: 4.5,
      price: 320,
      description: "Peas & paneer",
    }
  ],
  "Veggie Delights": [
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Mix_vegetable_curry_recipe.jpg/220px-Mix_vegetable_curry_recipe.jpg",
      name: "Mix Vegetable",
      rating: 4.5,
      price: 280,
      description: "Assorted veggies",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Malai_Kofta_in_Goa.jpg/250px-Malai_Kofta_in_Goa.jpg",
      name: "Malai Kofta",
      rating: 4.8,
      price: 350,
      description: "Creamy dumplings",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Aloo_Gobi.jpg/250px-Aloo_Gobi.jpg",
      name: "Aloo Gobi Adraki",
      rating: 4.4,
      price: 260,
      description: "Potato & cauliflower",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Bhindi_Masala.jpg/250px-Bhindi_Masala.jpg",
      name: "Bhindi Masala",
      rating: 4.6,
      price: 270,
      description: "Spiced okra",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Kashmiri_Dum_Aloo.jpg/220px-Kashmiri_Dum_Aloo.jpg",
      name: "Dum Aloo Kashmiri",
      rating: 4.7,
      price: 300,
      description: "Spicy potato curry",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Veg_Kolhapuri.jpg/220px-Veg_Kolhapuri.jpg",
      name: "Veg Kolhapuri",
      rating: 4.7,
      price: 310,
      description: "Spicy mixed veg",
    }
  ],
  "Dal": [
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Dal_Makhani.jpg/250px-Dal_Makhani.jpg",
      name: "Dal Makhani",
      rating: 4.8,
      price: 300,
      description: "Creamy black lentils",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Dal_Tadka.jpg/250px-Dal_Tadka.jpg",
      name: "Dal Tadka",
      rating: 4.7,
      price: 250,
      description: "Tempered yellow lentils",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Dal_Palak_or_Spinach_Dal.jpg/220px-Dal_Palak_or_Spinach_Dal.jpg",
      name: "Dal Palak",
      rating: 4.6,
      price: 260,
      description: "Lentils with spinach",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Chana_masala.jpg/250px-Chana_masala.jpg",
      name: "Chole Masala",
      rating: 4.7,
      price: 280,
      description: "Spiced chickpeas",
    }
  ],
  "Rice & Biryani": [
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Veg_Biryani_in_Guntur.jpg/250px-Veg_Biryani_in_Guntur.jpg",
      name: "Veg Biryani",
      rating: 4.7,
      price: 320,
      description: "Aromatic rice dish",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Jeera_Rice.jpg/250px-Jeera_Rice.jpg",
      name: "Jeera Rice",
      rating: 4.5,
      price: 200,
      description: "Cumin flavored rice",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Basmati_rice_pilaf.jpg/220px-Basmati_rice_pilaf.jpg",
      name: "Steamed Rice",
      rating: 4.3,
      price: 180,
      description: "Plain basmati rice",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Veg_Pulao.jpg/250px-Veg_Pulao.jpg",
      name: "Veg Pulao",
      rating: 4.6,
      price: 280,
      description: "Mixed vegetable rice",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Matar_pulao.jpg/250px-Matar_pulao.jpg",
      name: "Peas Pulao",
      rating: 4.5,
      price: 250,
      description: "Rice with green peas",
    }
  ],
  "Breads": [
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Tandoori_Roti.jpg/220px-Tandoori_Roti.jpg",
      name: "Tandoori Roti",
      rating: 4.6,
      price: 50,
      description: "Whole wheat bread",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Butter_Naan.jpg/250px-Butter_Naan.jpg",
      name: "Butter Naan",
      rating: 4.8,
      price: 70,
      description: "Soft leavened bread",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Garlic_Naan_in_India.jpg/250px-Garlic_Naan_in_India.jpg",
      name: "Garlic Naan",
      rating: 4.8,
      price: 80,
      description: "Garlic flavored bread",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Lachha_Paratha.jpg/220px-Lachha_Paratha.jpg",
      name: "Lachha Paratha",
      rating: 4.7,
      price: 80,
      description: "Layered flatbread",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Missi_Roti.jpg/220px-Missi_Roti.jpg",
      name: "Missi Roti",
      rating: 4.5,
      price: 60,
      description: "Gram flour bread",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Amritsari_Kulcha.jpg/220px-Amritsari_Kulcha.jpg",
      name: "Stuffed Kulcha",
      rating: 4.7,
      price: 100,
      description: "Potato/Paneer stuffed",
    }
  ],
  "Thalis & Combos": [
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/A_vegetarian_thali.jpg/250px-A_vegetarian_thali.jpg",
      name: "Special Veg Thali",
      rating: 4.8,
      price: 450,
      description: "A complete meal",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Dal_Makhani.jpg/250px-Dal_Makhani.jpg",
      name: "Dal Makhani Rice Bowl",
      rating: 4.7,
      price: 350,
      description: "Comfort combo",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Chole_bhature.jpg/250px-Chole_bhature.jpg",
      name: "Chole Bhature",
      rating: 4.8,
      price: 300,
      description: "Classic Punjabi dish",
    }
  ],
  "Desserts": [
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Gulab_jamun_%28Gibraltar%2C_November_2020%29.jpg/250px-Gulab_jamun_%28Gibraltar%2C_November_2020%29.jpg",
      name: "Gulab Jamun",
      rating: 4.9,
      price: 120,
      description: "Sweet milk solids",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Rasmalai_-_the_sweet_from_Bengal.jpg/250px-Rasmalai_-_the_sweet_from_Bengal.jpg",
      name: "Rasmalai",
      rating: 4.8,
      price: 150,
      description: "Creamy cheese dumplings",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Gajar_ka_halwa_02.jpg/250px-Gajar_ka_halwa_02.jpg",
      name: "Gajar Ka Halwa",
      rating: 4.9,
      price: 180,
      description: "Carrot pudding",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Kulfi_Falooda.jpg/220px-Kulfi_Falooda.jpg",
      name: "Kulfi Falooda",
      rating: 4.8,
      price: 200,
      description: "Indian ice cream dessert",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_-_20210717.jpg/220px-Ice_cream_with_whipped_cream%2C_chocolate_syrup%2C_and_a_wafer_-_20210717.jpg",
      name: "Ice Cream",
      rating: 4.5,
      price: 100,
      description: "Vanilla/Chocolate",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Moong_Dal_Halwa.jpg/220px-Moong_Dal_Halwa.jpg",
      name: "Moong Dal Halwa",
      rating: 4.7,
      price: 190,
      description: "Lentil pudding",
    }
  ],
  "Beverages": [
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Masala_Chaas_from_India.jpg/220px-Masala_Chaas_from_India.jpg",
      name: "Masala Chaas",
      rating: 4.7,
      price: 80,
      description: "Spiced buttermilk",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Lassi_in_India.jpg/220px-Lassi_in_India.jpg",
      name: "Sweet Lassi",
      rating: 4.8,
      price: 120,
      description: "Yogurt drink",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Shikanjvi_%28shikanjvi%29_is_a_type_of_lemonade_from_the_Indian_subcontinent.jpg/220px-Shikanjvi_%28shikanjvi%29_is_a_type_of_ lemonade_from_the_Indian_subcontinent.jpg",
      name: "Fresh Lime Soda",
      rating: 4.6,
      price: 90,
      description: "Sweet/Salted",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Bottle_of_water.jpg/220px-Bottle_of_water.jpg",
      name: "Mineral Water",
      rating: 5.0,
      price: 40,
      description: "Packaged drinking water",
    },
    {
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Soft_drink_bottles.jpg/220px-Soft_drink_bottles.jpg",
      name: "Soft Drinks",
      rating: 4.2,
      price: 60,
      description: "Coke, Pepsi, etc.",
    }
  ]
};

const filters = Object.keys(menuCategories);

interface MenuItemCardDemoProps {
    onNavigateToCart: () => void;
}

export default function MenuItemCardDemo({ onNavigateToCart }: MenuItemCardDemoProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();
  const [isCartGlowing, setIsCartGlowing] = useState(false);
  const prevCartItemCountRef = useRef(cartItemCount);

  useEffect(() => {
    // This effect handles the cart icon glow animation
    if (cartItemCount > prevCartItemCountRef.current) {
        setIsCartGlowing(true);
        const timer = setTimeout(() => setIsCartGlowing(false), 700);
        return () => clearTimeout(timer);
    }
    // Update the ref *after* the check for the next render.
    // Putting it outside the if ensures it updates when items are removed as well.
    prevCartItemCountRef.current = cartItemCount;
  }, [cartItemCount]);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const filterButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const headerRef = useRef<HTMLDivElement | null>(null);

  const filteredMenuCategories = useMemo(() => {
    if (!searchQuery) {
      return menuCategories;
    }
    return Object.entries(menuCategories).reduce((acc, [category, items]) => {
      const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (filteredItems.length > 0) {
        acc[category] = filteredItems;
      }
      return acc;
    }, {} as typeof menuCategories);
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveFilter(entry.target.getAttribute("data-category") || filters[0]);
          }
        });
      },
      { rootMargin: "-40% 0px -60% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [filteredMenuCategories]);

  useEffect(() => {
    const activeFilterButton = filterButtonRefs.current[activeFilter];
    if (activeFilterButton) {
      activeFilterButton.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [activeFilter]);

  const handleFilterClick = (filter: string) => {
    if ('vibrate' in navigator) {
      // A quick, subtle tap for category selection
      navigator.vibrate(20);
    }
    const section = sectionRefs.current[filter];
    const header = headerRef.current;

    if (section && header) {
        const headerHeight = header.offsetHeight;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
            top: sectionTop - headerHeight,
            behavior: 'smooth',
        });
    } else if (section) {
        // Fallback if header ref isn't available
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-background">
      <div className="w-full max-w-sm">
        
        <div ref={headerRef} className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm">
          <div className="p-4 pt-8 pb-4">
            <header className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-foreground">Order & Eat.</h1>
              <button
                onClick={onNavigateToCart}
                className={`relative p-2 rounded-full transition-all duration-300 ease-out ${
                  isCartGlowing ? 'shadow-[0_0_12px_4px_hsl(var(--primary)/0.7)]' : ''
                }`}
                aria-label={`View cart with ${cartItemCount} items`}
              >
                <ShoppingCart className="w-6 h-6 text-foreground" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </header>
            
            <div className="relative flex items-center my-6">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground" aria-hidden="true" />
              <input 
                className="w-full pl-12 pr-16 py-3 rounded-lg bg-card border-none text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none" 
                placeholder="Search your food" 
                type="text"
                aria-label="Search for food"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 p-2 rounded-lg bg-background" aria-label="Filters">
                <SlidersHorizontal className="text-foreground" />
              </button>
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar" role="tablist" aria-label="Food categories">
              {filters.map(filter => (
                <button 
                  key={filter}
                  ref={el => { filterButtonRefs.current[filter] = el; }}
                  onClick={() => handleFilterClick(filter)}
                  className={`flex-shrink-0 py-2 px-4 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                    activeFilter === filter
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground'
                  }`}
                  role="tab"
                  aria-selected={activeFilter === filter}
                  // Disable button if category has no search results
                  disabled={!filteredMenuCategories[filter]}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="p-4">
          {Object.keys(filteredMenuCategories).length > 0 ? (
            Object.entries(filteredMenuCategories).map(([category, items]) => (
              <section 
                  key={category} 
                  className="mb-12"
                  ref={el => { sectionRefs.current[category] = el; }}
                  data-category={category}
              >
                <h2 className="text-xl font-bold text-foreground mb-12">{category}</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-16">
                  {items.map((item) => (
                    <MenuItemCard
                      key={item.name}
                      imageUrl={item.imageUrl}
                      name={item.name}
                      rating={item.rating}
                      price={item.price}
                      onAddToCart={() => addToCart(item)}
                    />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p className="text-lg font-semibold">No food found for "{searchQuery}"</p>
              <p className="text-sm">Try searching for something else.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}