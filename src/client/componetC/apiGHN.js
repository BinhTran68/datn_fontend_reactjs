import axios from "axios";

const GHN_API_URL = "https://online-gateway.ghn.vn/shiip/public-api";
const SERVICE_TYPE_ID = 5; // Giao hàng tiêu chuẩn
const TOKEN = import.meta.env.VITE_GHN_API_KEY;
const SHOP_ID = 5638683;

/**
 * Hàm tính phí vận chuyển GHN
 */

/**
 * Hàm lấy địa chỉ đầy đủ từ GHN
 */
export async function generateAddressString(
  provinceId,
  districtId,
  wardId,
  specificAddress = ""
) {
  let provinceName = "",
    districtName = "",
    wardName = "";

  try {
    if (provinceId) {
      const response = await axios.post(
        `${GHN_API_URL}/master-data/province`,
        {},
        {
          headers: { Token: TOKEN },
        }
      );
      const province = response.data.data.find(
        (p) => p.ProvinceID === parseInt(provinceId)
      );
      provinceName = province?.ProvinceName || "";
    }

    if (districtId) {
      const response = await axios.post(
        `${GHN_API_URL}/master-data/district`,
        { province_id: parseInt(provinceId) },
        { headers: { Token: TOKEN } }
      );
      const district = response.data.data.find(
        (d) => d.DistrictID === parseInt(districtId)
      );
      districtName = district?.DistrictName || "";
    }

    if (wardId) {
      const response = await axios.post(
        `${GHN_API_URL}/master-data/ward`,
        { district_id: parseInt(districtId) },
        { headers: { Token: TOKEN } }
      );
      const ward = response.data.data.find((w) => w.WardCode === wardId);
      wardName = ward?.WardName || "";
    }
  } catch (error) {
    console.error(
      "Lỗi khi lấy thông tin địa chỉ:",
      error.response?.data || error.message
    );
  }

  return `${specificAddress ? specificAddress + ", " : ""}${
    wardName ? wardName + ", " : ""
  }${districtName ? districtName + ", " : ""}${
    provinceName ? provinceName : ""
  }`.trim();
}

export const calculateShippingFee = async ({
  shopId = 5638683,
  fromDistrictId,
  fromWardCode,
  toDistrictId,
  toWardCode,
  length = 30,
  width = 40,
  height = 20,
  weight = 1,
  insuranceValue = 0,
  coupon = null,
  items = [],
}) => {
  try {
    const tokenGHN = import.meta.env.VITE_GHN_API_KEY;
    const response = await axios.post(
      GHN_API_URL+"/v2/shipping-order/fee",
      {
        service_type_id: SERVICE_TYPE_ID,
        from_district_id: fromDistrictId,
        from_ward_code: fromWardCode,
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        length,
        width,
        height,
        weight,
        insurance_value: insuranceValue,
        coupon,
        items: [
          {
            name: "TEST1",
            quantity: 1,
            length: 200,
            width: 20,
            height: 20,
            weight: 1,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: tokenGHN,
          ShopId: shopId,
        },
      }
    );

    return response.data.data.total;
  } catch (error) {
    console.error(
      "Error calculating shipping fee:",
      error.response?.data || error.message
    );
    throw new Error("Failed to calculate shipping fee");
  }
};
