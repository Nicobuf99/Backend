const fs = require("fs");

class productManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.read();
  }

  read = () => {
    if (fs.existsSync(this.path)) {
      const data = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(data);
    } else {
      this.products = [];
    }
  };

  getProducts = () => {
    return this.products;
  };

  createID = () => {
    const count = this.products.length;
    const productID = count > 0 ? this.products[count - 1].id + 1 : 1;
    return productID;
  };

  addProduct = (title, description, price, thumbnail, code, stock) => {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    const isCodeRepeated = this.products.some((product) => product.code === code);
    if (isCodeRepeated) {
      console.error("El campo 'code' ya existe");
      return;
    }
    const product = {
      id: this.createID(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(product);
    this.saveToFile();
  };

  getProductByID = (id) => {
    const product = this.products.find((product) => product.id === id);
    if (product) {
      return product;
    } else {
      console.error("Producto no encontrado");
    }
  };

  updateProduct = (id, field, value) => {
    const product = this.getProductByID(id);
    if (product) {
      product[field] = value;
      console.log(`Producto con ID ${id} actualizado correctamente.`);
      this.saveToFile();
    }
  };

  deleteProduct = (id) => {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      console.log(`Producto con ID ${id} eliminado correctamente.`);
      this.saveToFile();
    } else {
      console.error("Producto no encontrado");
    }
  };

  saveToFile = () => {
    fs.writeFile(this.path, JSON.stringify(this.products), (err) => {
      if (err) {
        console.error("Error al guardar los productos en el archivo.");
      } else {
        console.log("Productos guardados en el archivo correctamente.");
      }
    });
  };
}

const manager = new productManager("products.txt");
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

const products = manager.getProducts();
console.log(products);

fs.readFile("products.txt", "utf-8", (err, data) => {
  if (err) {
    console.error("Error al leer el archivo.");
  } else {
    console.log(JSON.parse(data));
  }
});
