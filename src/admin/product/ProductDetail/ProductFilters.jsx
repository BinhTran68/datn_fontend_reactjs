import React, { useState } from "react";
import { Row, Col } from "antd";
import FilterSelect from "./ProductFilters"; // Assuming FilterSelect is in the same folder

const ProductFilters = ({
  dataSelectProduct,
  dataSelectBrand,
  dataSelectGender,
  dataSelectMaterial,
  dataSelectType,
  dataSelectSole,
  dataSelectColor,
  dataSelectSize,
  setFilterActice,
  setPagination,
  setRequestFilter,
  requestFilter,
}) => {
  const handleFilterChange = (field) => (value) => {
    setFilterActice(true);
    setPagination({ current: 1, pageSize: pagination.pageSize });
    setRequestFilter((prev) => ({
      ...prev,
      [field]: value, // Dynamically update the filter field
    }));
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <FilterSelect
          placeholder="Chọn sản phẩm"
          value={requestFilter.productName}
          onChange={handleFilterChange("productName")}
          options={[
            { value: "", label: "Chọn sản phẩm..." },
            ...dataSelectProduct?.map((p) => ({
              value: p.productName,
              label: p.productName,
            })),
          ]}
          style={{ width: "10rem" }}
        />

        <FilterSelect
          placeholder="Tất cả Thương hiệu"
          value={requestFilter.brandName}
          onChange={handleFilterChange("brandName")}
          options={[
            { value: "", label: "Tất cả thương hiệu" },
            ...dataSelectBrand?.map((p) => ({
              value: p.brandName,
              label: p.brandName,
            })),
          ]}
          style={{ width: "10rem" }}
        />

        <FilterSelect
          placeholder="Tất cả Giới tính"
          value={requestFilter.genderName}
          onChange={handleFilterChange("genderName")}
          options={[
            { value: "", label: "Tất cả giới tính" },
            ...dataSelectGender?.map((g) => ({
              value: g.genderName,
              label: g.genderName,
            })),
          ]}
          style={{ width: "10rem" }}
        />

        <FilterSelect
          placeholder="Tất cả Chất liệu"
          value={requestFilter.materialName}
          onChange={handleFilterChange("materialName")}
          options={[
            { value: "", label: "Tất cả chất liệu" },
            ...dataSelectMaterial?.map((m) => ({
              value: m.materialName,
              label: m.materialName,
            })),
          ]}
          style={{ width: "10rem" }}
        />

        <FilterSelect
          placeholder="Tất cả Loại giày"
          value={requestFilter.typeName}
          onChange={handleFilterChange("typeName")}
          options={[
            { value: "", label: "Tất cả loại giày" },
            ...dataSelectType?.map((g) => ({
              value: g.typeName,
              label: g.typeName,
            })),
          ]}
          style={{ width: "10rem" }}
        />

        <FilterSelect
          placeholder="Tất cả Loại đế giày"
          value={requestFilter.soleName}
          onChange={handleFilterChange("soleName")}
          options={[
            { value: "", label: "Tất cả loại đế giày" },
            ...dataSelectSole?.map((s) => ({
              value: s.soleName,
              label: s.soleName,
            })),
          ]}
          style={{ width: "10rem" }}
        />
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <FilterSelect
          placeholder="Tất cả Màu sắc"
          value={requestFilter.colorName}
          onChange={handleFilterChange("colorName")}
          options={[
            { value: "", label: "Tất cả màu sắc" },
            ...dataSelectColor?.map((c) => ({
              value: c.colorName,
              label: c.colorName,
            })),
          ]}
          style={{ width: "10rem" }}
        />

        <FilterSelect
          placeholder="Tất cả Kích cỡ"
          value={requestFilter.sizeName}
          onChange={handleFilterChange("sizeName")}
          options={[
            { value: "", label: "Tất cả kích cỡ" },
            ...dataSelectSize?.map((s) => ({
              value: s.sizeName,
              label: s.sizeName,
            })),
          ]}
          style={{ width: "10rem" }}
        />
      </Row>
    </>
  );
};

export default ProductFilters;
