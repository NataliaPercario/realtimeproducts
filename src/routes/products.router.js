const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

//Rutas
//1) Listar los prpductos del archivo JSON
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: "error interno del servidor" });
  }
});

//2) Retornamos producto por ID
router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {    
    const products = await productManager.getProductById(parseInt(id));
    if (!products) {
      return res.json({ error: "ID no encontrado" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "error interno del servidor" });
  }
});

//3) agregar nuevo producto
router.post("/", async (req, res) => {
  const newProduct = req.body;
  try {
    await productManager.addProduct(newProduct);
    res.status(201).json({ message: "Producto agregado de manera exitosa" });
  } catch (error) {
    console.error("Error al agregar un producto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//4) Actualizar por ID
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updatedProduct = req.body;
  try {
    await productManager.updateProduct(parseInt(id), updatedProduct);
    res.json({ message: "Producto actualizado de manera exitosa" });
  } catch (error) {
    console.error("Error al actualizar el producto", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//5) Eliminar por ID
router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    await productManager.deleteProduct(parseInt(id));
    res.json({ message: "Producto eliminado de manera exitosa" });
  } catch (error) {
    console.error("no se ha podido eliminar el producto", error);
    res.status(500).json({ error: "Error interno del servido" });
  }
});

module.exports = router;