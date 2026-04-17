import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaChevronRight, FaMinus, FaPlus, FaThList } from "react-icons/fa";
import { categories } from "../assets/dummyData";
import { useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import BannerHome from "../components/BannerHome";
import { itemsHomeStyles } from "../assets/dummyStyles.js";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

const ItemsHome = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(
    () => localStorage.getItem("activeCategory") || "All"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  // Save category
  useEffect(() => {
    localStorage.setItem("activeCategory", activeCategory);
  }, [activeCategory]);

  // Fetch products
  useEffect(() => {
    axios
      .get(`${API}/api/items`)
      .then((res) => {
        const normalized = res.data.map((p) => ({
          ...p,
          id: p._id,
        }));
        setProducts(normalized);
      })
      .catch(console.error);
  }, []);

  const productMatchesSearch = (product, term) => {
    if (!term) return true;
    const words = term.toLowerCase().trim().split(/\s+/);
    return words.every((word) =>
      product.name.toLowerCase().includes(word)
    );
  };

  const searchedProducts = searchTerm
    ? products.filter((p) => productMatchesSearch(p, searchTerm))
    : activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const getQuantity = (productId) => {
    const item = cart.find((ci) => ci.productId === productId);
    return item ? item.quantity : 0;
  };

  const getLineItemId = (productId) => {
    const item = cart.find((ci) => ci.productId === productId);
    return item ? item.id : null;
  };

  const handleIncrease = (product) => {
    const lineId = getLineItemId(product._id);
    if (lineId) {
      updateQuantity(lineId, getQuantity(product._id) + 1);
    } else {
      addToCart(product._id, 1);
    }
  };

  const handleDecrease = (product) => {
    const qty = getQuantity(product._id);
    const lineId = getLineItemId(product._id);
    if (qty > 1 && lineId) updateQuantity(lineId, qty - 1);
    else if (lineId) removeFromCart(lineId);
  };

  const redirectToItemsPage = () => {
    navigate("/items", { state: { category: activeCategory } });
  };

  const sidebarCategories = [
    {
      name: "All Items",
      icon: <FaThList className="text-lg" />,
      value: "All",
    },
    ...categories,
  ];

  return (
    <div className={itemsHomeStyles.page}>
      <BannerHome onSearch={setSearchTerm} />

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Sidebar */}
        <aside className={itemsHomeStyles.sidebar}>
          <div className={itemsHomeStyles.sidebarHeader}>
            <h1 className={itemsHomeStyles.sidebarTitle}>FreshCart</h1>
            <div className={itemsHomeStyles.sidebarDivider} />
          </div>

          <div className={itemsHomeStyles.categoryList}>
            <ul className="space-y-3">
              {sidebarCategories.map((cat) => (
                <li key={cat.name}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat.value || cat.name);
                      setSearchTerm("");
                    }}
                    className={`${itemsHomeStyles.categoryItem} ${
                      activeCategory === (cat.value || cat.name) && !searchTerm
                        ? itemsHomeStyles.activeCategory
                        : itemsHomeStyles.inactiveCategory
                    }`}
                  >
                    <div>{cat.icon}</div>
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main */}
        <main className={itemsHomeStyles.mainContent}>
          <div className={itemsHomeStyles.productsGrid}>
            {searchedProducts.length > 0 ? (
              searchedProducts.map((product) => {
                const qty = getQuantity(product._id);

                return (
                  <div key={product._id} className={itemsHomeStyles.productCard}>
                    
                    {/* ✅ FIXED IMAGE */}
                    <div className={itemsHomeStyles.imageContainer}>
                      <img
                        src={product.imageUrl || "/no-image.png"}
                        alt={product.name}
                        className={itemsHomeStyles.productImage}
                        onError={(e) => {
                          e.target.src = "/no-image.png";
                        }}
                      />
                    </div>

                    <div className={itemsHomeStyles.productContent}>
                      <h3>{product.name}</h3>

                      <div className={itemsHomeStyles.priceContainer}>
                        <div>
                          <p>₹{product.price.toFixed(2)}</p>
                        </div>

                        {qty === 0 ? (
                          <button onClick={() => handleIncrease(product)}>
                            <FaShoppingCart /> Add
                          </button>
                        ) : (
                          <div>
                            <button onClick={() => handleDecrease(product)}>
                              <FaMinus />
                            </button>
                            <span>{qty}</span>
                            <button onClick={() => handleIncrease(product)}>
                              <FaPlus />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No products found</p>
            )}
          </div>

          <div className="text-center">
            <button onClick={redirectToItemsPage}>
              View All <FaChevronRight />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ItemsHome;