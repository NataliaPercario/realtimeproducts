const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.ultId = 0;

    //Para cargar los carts almacenados en el archivo
    this.addCarts();
  }

  async addCarts() {
    try {
      const data = await fs.readFile(this.path, "utf8");
      this.carts = JSON.parse(data);
      if (this.carts.length > 0) {
        //Verifica si hay, al menos, un cart cargado.
        //También uso el método map para crear un nuevo array que solo tenga los identificados
        this.ultId = Math.max(...this.carts.map((cart) => cart.id));
      }
    } catch (error) {
      console.error("Error al cargar los carritos desde el archivo", error);
      //Creo el archivo si no existe
      await this.saveCarts();
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async createCarts() {
    const newCart = {
      id: ++this.ultId,
      products: [],
    };
    this.carts.push(newCart);

    //guardo el array en el archivo
    await this.saveCarts();
    return newCart;
  }

  async getCartById(cartId) {
    try {
        const cart = this.carts.find(c => c.id === cartId);
        if(!cart) {
            throw new Error(`No existe un carrito con el id ${cartId}`);
        }
        return cart;
    } catch (error) {
        console.error("No se pudo obtener el carrito a través del ID", error);
        throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    const productExist = cart.products.find(p => p.product === productId);
    if(productExist) {
        productExist.quantity += quantity;
    }else{
        cart.products.push({product: productId, quantity});
    }
    await this.saveCarts();
    return cart;
  }
}
 module.exports = CartManager;