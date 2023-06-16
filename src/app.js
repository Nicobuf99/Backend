import express from "express"
import productManager from "/productManager.js"

const app = express()
app.use(express.json())
const manager = new productManager("products.txt")

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

app.listen(8080)