const Product = require("../../models/product.model")

const filterStatusHelper = require("../../helper/filterStatus")
const searchHelper = require("../../helper/search")
const pagiantionHelper = require("../../helper/pagination")
const { query } = require("express")

// [GET] /admin/product
module.exports.product = async (req, res) => {

     const filterStatus=filterStatusHelper(req.query)

     let find = {
          deleted: false
     }
     
     if (req.query.status) {
          find.status = req.query.status
     }

     const objectSearch=searchHelper(req.query)
     // console.log(objectSearch)

     if(objectSearch.regex) {
          find.title = objectSearch.regex
     }
     
// Pagination
     const countProduct = await Product.countDocuments(find)
    
     let objectPagination = pagiantionHelper(
          {
          limitItems: 4,
          currentPage: 1
          },
          req.query,
          countProduct
     )
// End Pagination

     const product = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip)
     // console.log(product)
     res.render("admin/pages/product/index", {
          product: product,
          filterStatus: filterStatus,
          keyword: objectSearch.keyword,
          pagination: objectPagination,
     })
}

// [PATCH] /admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
     const status = req.params.status
     const id = req.params.id
     await Product.updateOne({ _id: id}, {status: status})
     // Cập nhật dữ liệu trong database
     res.redirect("back")
}

// [PATCH] /admin/product/change-multi
module.exports.changeMulti = async (req, res) => {
     const type = req.body.type
     const ids = req.body.ids.split(", ")

     switch (type) {
          case "active":
               await Product.updateMany({_id: { $in: ids}}, {status: "active"})
               break;
          case "inactive":
               await Product.updateMany({_id: { $in: ids}}, {status: "inactive"})              
               break;
          default:
               break;
     }

     res.redirect("back")
}

