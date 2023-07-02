import express from "express";
import productManager from "/productManager.js";

const app = express();
app.use(express.json());
const manager = new productManager("products.txt");

app.get("/products", (req, res) => {
  let { limit } = req.query;
  limit = parseInt(limit);

  const products = manager.getProducts();
  let response = products;

  if (!isNaN(limit) && limit > 0) {
    response = response.slice(0, limit);
  }

  res.json(response);
});

app.get("/products/:pid", (req, res) => {
  const { pid } = req.params;
  const product = manager.getProductByID(parseInt(pid));

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

app.post("/products", (req, res) => {
  const { id, title, description, code, price, stock, category, thumbnails } = req.body;

  if (!id || !title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios, a excepción de 'thumbnails'" });
  }

  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails
  };
  productManager.addProduct(newProduct);

  res.status(201).json({ message: "Producto agregado exitosamente" });
});

app.put("/products/:pid", (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  const existingProduct = manager.getProductByID(parseInt(pid));

  if (!existingProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const updatedProduct = {
    id: existingProduct.id,
    title: title || existingProduct.title,
    description: description || existingProduct.description,
    code: code || existingProduct.code,
    price: price || existingProduct.price,
    status: status !== undefined ? status : existingProduct.status,
    stock: stock || existingProduct.stock,
    category: category || existingProduct.category,
    thumbnails: thumbnails || existingProduct.thumbnails
  };

  manager.updateProduct(parseInt(pid), updatedProduct);

  res.json({ message: "Producto actualizado exitosamente" });
});

app.delete("/products/:pid", (req, res) => {
  const { pid } = req.params;

  const existingProduct = manager.getProductByID(parseInt(pid));

  if (!existingProduct) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  manager.deleteProduct(parseInt(pid));

  res.json({ message: "Producto eliminado exitosamente" });
});


app.post("/api/carts", (req, res) => {
  const { products } = req.body;
  const cartId = generateUniqueId();

  const cart = {
    id: cartId,
    products: products || []
  };

  res.status(201).json({ message: "Carrito creado exitosamente", cart });
});

app.get("/api/carts/:cid", (req, res) => {
  const { cid } = req.params;

  const cartProducts = getProductsForCart(cid); 

  if (cartProducts.length === 0) {
    res.json({ message: "El carrito está vacío", cartId: cid });
  } else {
    res.json(cartProducts);
  }
});

app.post("/api/carts/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = getCartById(cid);
  const product = getProductById(pid); 

  if (!cart || !product) {
    res.status(404).json({ error: "Carrito o producto no encontrado" });
    return;
  }

  const existingProduct = cart.products.find((item) => item.product === pid);

  if (existingProduct) {
  
    existingProduct.quantity += 1;
  } else {

    const newProduct = {
      product: pid,
      quantity: quantity || 1 
    };
    cart.products.push(newProduct);
  }

  res.json({ message: "Producto agregado al carrito exitosamente" });
});




app.listen(8080);
