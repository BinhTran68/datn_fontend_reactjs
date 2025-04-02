import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Select, InputNumber, Button, Space } from "antd";
import { apiFilter } from "./api";
import Title from "antd/es/typography/Title";
import { COLORS } from "../../../constants/constants";

const FilterSelect = ({
  onFilter,
  onPaginationChange,
  pagination = { current: 1, pageSize: 10 },
  dataSelectProduct = [],
  dataSelectBrand = [],
  dataSelectType = [],
  dataSelectColor = [],
  dataSelectMaterial = [],
  dataSelectSize = [],
  dataSelectSole = [],
  dataSelectGender = [],
}) => {
  const [requestFilter, setRequestFilter] = useState({
    productId: null,
    brandId: null,
    typeId: null,
    colorId: null,
    materialId: null,
    sizeId: null,
    soleId: null,
    genderId: null,
    minPrice:null,
    maxPrice:null,

  });

  // Sử dụng useRef để lưu giá trị pagination trước đó
  const prevPaginationRef = useRef(pagination);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const filterParams = {
          productId: requestFilter.productId,
          brandId: requestFilter.brandId,
          genderId: requestFilter.genderId,
          typeId: requestFilter.typeId,
          colorId: requestFilter.colorId,
          materialId: requestFilter.materialId,
          minPrice: requestFilter.minPrice,
          maxPrice: requestFilter.maxPrice,
          page: pagination?.current || 1,
          size: pagination?.pageSize || 10,
        };
        const response = await apiFilter(filterParams);

        // Gửi dữ liệu lên component cha
        onFilter({
          products: response.data,
          pagination: {
            current: pagination?.current || 1,
            pageSize: pagination?.pageSize || 10,
            totalPages: response.meta.totalPages,
            totalElements: response.meta.totalElement,
          },
          filters: requestFilter,
        });
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };

    // Chỉ gọi API nếu pagination thực sự thay đổi
    const paginationChanged =
      JSON.stringify(prevPaginationRef.current) !== JSON.stringify(pagination);

    if (paginationChanged || requestFilter) {
      fetchFilteredProducts();
    }

    // Cập nhật giá trị pagination trước đó
    prevPaginationRef.current = pagination;
  }, [requestFilter, pagination, onFilter]);

  const handleFilterChange = (key, value) => {
    if (
      key === "maxPrice" &&
      value !== null &&
      requestFilter.minPrice !== null &&
      value < requestFilter.minPrice
    ) {
      return; // Prevent setting maxPrice less than minPrice
    }
    if (
      key === "minPrice" &&
      value !== null &&
      requestFilter.maxPrice !== null &&
      value > requestFilter.maxPrice
    ) {
      return; // Prevent setting minPrice greater than maxPrice
    }
    onPaginationChange({
      current: 1,
      pageSize: pagination?.pageSize || 10,
    });
    setRequestFilter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Row gutter={[16, 16]}>
      <h5 className="p-2" style={{ color: `${COLORS.primary}` }}>
        Bộ Lọc tìm Kiếm
      </h5>
      <Col>
        <Select
          showSearch
          style={{ width: "10rem" }}
          placeholder="Tất cả sản phẩm"
          optionFilterProp="label"
          value={requestFilter.productId}
          onChange={(value) => handleFilterChange("productId", value)}
          options={[
            { value: null, label: "Tất cả sản phẩm" },
            ...dataSelectProduct.map((p) => ({
              value: p.id,
              label: p.productName,
            })),
          ]}
        />
      </Col>
      <Col>
        <Select
          showSearch
          style={{ width: "10rem" }}
          placeholder="Tất cả thương hiệu"
          optionFilterProp="label"
          value={requestFilter.brandId}
          onChange={(value) => handleFilterChange("brandId", value)}
          options={[
            { value: null, label: "Tất cả thương hiệu" },
            ...dataSelectBrand.map((b) => ({
              value: b.id,
              label: b.brandName,
            })),
          ]}
        />
      </Col>
      <Col>
        <Select
          showSearch
          style={{ width: "10rem" }}
          placeholder="Tất cả loại giày"
          optionFilterProp="label"
          value={requestFilter.typeId}
          onChange={(value) => handleFilterChange("typeId", value)}
          options={[
            { value: null, label: "Tất cả loại giày" },
            ...dataSelectType.map((t) => ({
              value: t.id,
              label: t.typeName,
            })),
          ]}
        />
      </Col>
      <Col>
        <Select
          showSearch
          style={{ width: "10rem" }}
          placeholder="Tất cả màu sắc"
          optionFilterProp="title"
          value={requestFilter.colorId}
          onChange={(value) => handleFilterChange("colorId", value)}
          options={[
            { value: null, label: "Tất cả màu sắc" },
            ...dataSelectColor.map((c) => ({
              value: c.id,
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      backgroundColor: c.code,
                      borderRadius: "50%",
                      border: "1px solid #ccc",
                    }}
                  />
                  {c.colorName}
                </div>
              ),
              title: c.colorName,
            })),
          ]}
        />
      </Col>
      <Col>
        <Select
          showSearch
          style={{ width: "10rem" }}
          placeholder="Tất cả chất liệu"
          optionFilterProp="label"
          value={requestFilter.materialId}
          onChange={(value) => handleFilterChange("materialId", value)}
          options={[
            { value: null, label: "Tất cả chất liệu" },
            ...dataSelectMaterial.map((m) => ({
              value: m.id,
              label: m.materialName,
            })),
          ]}
        />
      </Col>
      {/* <Col>
        <Select
          showSearch
          style={{ width: "10rem" }}
          placeholder="Tất cả kích cỡ"
          optionFilterProp="label"
          value={requestFilter.sizeId}
          onChange={(value) => handleFilterChange("sizeId", value)}
          options={[
            { value: null, label: "Tất cả kích cỡ" },
            ...dataSelectSize.map((s) => ({
              value: s.id,
              label: s.sizeName,
            })),
          ]}
        />
      </Col>
      <Col>
        <Select
          showSearch
          style={{ width: "10rem" }}
          placeholder="Tất cả loại đế giày"
          optionFilterProp="label"
          value={requestFilter.soleId}
          onChange={(value) => handleFilterChange("soleId", value)}
          options={[
            { value: null, label: "Tất cả loại đế giày" },
            ...dataSelectSole.map((s) => ({
              value: s.id,
              label: s.soleName,
            })),
          ]}
        />
      </Col> */}
      <Col>
        <Select
          showSearch
          style={{ width: "10rem" }}
          placeholder="Tất cả giới tính"
          optionFilterProp="label"
          value={requestFilter.genderId}
          onChange={(value) => handleFilterChange("genderId", value)}
          options={[
            { value: null, label: "Tất cả giới tính" },
            ...dataSelectGender.map((g) => ({
              value: g.id,
              label: g.genderName,
            })),
          ]}
        />
      </Col>
      <Col>
        <InputNumber
          style={{ width: "10rem" }}
          placeholder="Giá tối thiểu"
          min={0}
          value={requestFilter.minPrice}
          onChange={(value) => handleFilterChange("minPrice", value)}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          suffix="VND"
          step={10000}

        />
      </Col>
      <Col>
        <InputNumber
          style={{ width: "10rem" }}
          placeholder="Giá tối đa"
          min={0}
          value={requestFilter.maxPrice}
          onChange={(value) => handleFilterChange("maxPrice", value)}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          suffix="VND"
          step={10000}
        />
      </Col>
      <Col>
        <Button
          onClick={() => {
            const resetState = {
              productId: null,
              brandId: null,
              typeId: null,
              colorId: null,
              materialId: null,
              sizeId: null,
              soleId: null,
              genderId: null,
              minPrice: null,
              maxPrice: null,
            };
            setRequestFilter(resetState);
            onPaginationChange({
              current: 1,
              pageSize: pagination?.pageSize || 10,
            }); // Reset pagination
          }}
          type="primary"
        >
          Xóa Bộ lọc
        </Button>
      </Col>
    </Row>
  );
};

export default FilterSelect;
