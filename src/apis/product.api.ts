import { Product, ProductListConfig, ProductList } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'products'
const productApi = {
  getProducts(params: ProductListConfig) {
    return http.get<SuccessResponse<ProductList>>(URL, { params })
  },
  getProductDetails(id: string) {
    return http.get<SuccessResponse<Product>>(`${URL}/${id}`)
  }
}

export default productApi
