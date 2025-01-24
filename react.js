// Import necessary dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";
import { TextField, Select, MenuItem, Pagination } from "@mui/material";
import "tailwindcss/tailwind.css";
import './react.css';

const Rect= () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle search functionality
  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  // Handle sorting
  useEffect(() => {
    const sorted = [...filteredProducts];
    if (sortOption === "priceLowHigh") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighLow") {
      sorted.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(sorted);
  }, [sortOption]);

  // Handle pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="p-4 container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 mb-2 md:mb-0"
        />
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          displayEmpty
          className="w-full md:w-1/4"
        >
          <MenuItem value="">Sort By</MenuItem>
          <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
          <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
        </Select>
      </div>

      <div className="product-card">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="border rounded p-4 flex flex-col items-center"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-32 h-32 object-contain mb-2"
            />
            <h2 className="text-lg font-semibold mb-1">{product.title}</h2>
            <p className="text-gray-600 mb-1">{product.category}</p>
            <p className="font-bold">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="pagination-container">
        <Pagination
          count={Math.ceil(filteredProducts.length / productsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default Rect;
