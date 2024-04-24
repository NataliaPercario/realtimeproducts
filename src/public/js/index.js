const socket = io();

socket.on("products", (data) => {
  renderProducts(data);
});

//renderizar los productos
const renderProducts = (products) => {
  const productsContainer = document.getElementById("productsContainer");
  productsContainer.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <p> ${item.id} </p>
        <p> ${item.title} </p>
        <p> ${item.price} </p>
        <button> Eliminar </button>
        `;

    productsContainer.appendChild(card);
    //agrega e evento al botón de eliminar:

    card.querySelector("button").addEventListener("click", () => {
      deleteProduct(item.id);
    });
  });
};

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

//agrega productos del formulario
document.getElementById("sendBtn").addEventListener("click", () => {
  addProduct();
});

const addProduct = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
  };

  socket.emit("addProduct", product);
};