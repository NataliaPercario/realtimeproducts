const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PORT = 8080;

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Configuro handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Listen del servidor
const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando en el puerto: ${PORT}`);
});

//Obtengo el array de productos
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json");

//Creo el server de socket.io
const io = socket(httpServer);

io.on("connection", async (socket) => {
  console.log("Un cliente se conectó");

  //Envío el array de productos al cliente que se conectó
  socket.emit("products", await productManager.getProducts());

  //recibo el evento "eliminar producto" desde el cliente:
  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);

    //le envío a lista actualizada al cliente
    io.sockets.emit("products", await productManager.getProducts());
  });

  //Agrega producto
  socket.on("addProduct", async (product) => {
    console.log(product);
    await productManager.addProduct(product);
    io.sockets.emit("products", await productManager.getProducts());
  });
});