const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("index", { products: products });
  } catch (error) {
    console.log("Error al obtener los productos", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Punto 2

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;