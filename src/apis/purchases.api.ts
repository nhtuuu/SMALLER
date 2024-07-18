import { Purchase, PurchaseListStatus } from 'src/types/purchases.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'purchases'
const purchasesApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return http.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchases(params: { status: PurchaseListStatus }) {
    return http.get<SuccessResponse<Purchase[]>>(`${URL}`, { params })
  },
  updatePurchases(body: { product_id: string; buy_count: number }) {
    return http.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
  },
  buyProducts(body: { product_id: string; buy_count: number }[]) {
    return http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body)
  },
  deletePurchases(purchase_id: string[]) {
    return http.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}`, { data: purchase_id })
  }
}

export default purchasesApi
