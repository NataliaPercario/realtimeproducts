const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");

//Crea el nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCarts();
    res.json(newCart);
  } catch (error) {
    console.error("No se puede crear un nuevo carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//listar los productos que pertenecen a cada carrito
router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    console.error("No se puede obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;
  try {
    const updateCart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(updateCart.products);
  } catch (error) {
    console.log("No se puede agregar producto al carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;