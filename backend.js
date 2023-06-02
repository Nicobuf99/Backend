class productManager {
    constructor() {
        this.products = []
    }

    getProducts = ()=> {return this.products}

    createID = ()=> {
        const count = this.products.length
        const productID = (count > 0)? this.products[count - 1].id+ 1 : 1
        return productID
    }

    addProduct = (title, description, price, thumbnail, code, stock) => {
        
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios");
            return;
        }

        const isCodeRepeated = this.products.some((product) => product.code === code);
        if (isCodeRepeated) {
            console.error("El campo 'code ya existe");
            return;
        }
        const product = {
            id: this.createID(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        this.products.push(product)
    }

    getProductByID = (id) => {
        const product = this.products.find((product) => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado");
        }
    };
}

const manager = new productManager();
manager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);

const products = manager.getProducts();
console.log(products);
