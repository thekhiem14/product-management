const categoryMiddleware = require('../../middlewares/client/category.middleware')

const productRoutes = require("./product.route")
const homeRoutes = require("./home.route")
const searchRoutes = require("./search.route")
module.exports = (app) => {
     app.use(categoryMiddleware.category)
     // Mọi route đều chứa categoryMiddleware.category

     app.use("/", homeRoutes)
     app.use("/product", productRoutes)
     app.use("/search", searchRoutes)
}

