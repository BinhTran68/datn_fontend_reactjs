import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Select, Input, Row, Col, Form} from 'antd';

const {Option} = Select;

const tokenGHN = import.meta.env.VITE_GHN_API_KEY;

const GHN_API_URL = 'https://online-gateway.ghn.vn/shiip/public-api/master-data';
const TOKEN = tokenGHN; // Thay bằng API Key của bạn

function AddressSelector({provinceId, districtId, wardId, specificAddressDefault, onAddressChange}) {

    console.log("TOKEN", TOKEN)

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(provinceId);
    const [selectedDistrict, setSelectedDistrict] = useState(districtId);
    const [selectedWard, setSelectedWard] = useState(wardId);
    const [specificAddress, setSpecificAddress] = useState(specificAddressDefault);

    const fetchProvinces = async () => {
        try {
            const response = await axios.get(`${GHN_API_URL}/province`, {
                headers: {Token: TOKEN}
            });
            setProvinces(response.data.data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const response = await axios.post(`${GHN_API_URL}/district`,
                {province_id: provinceId},
                {
                    headers: {Token: TOKEN},
                },
            );
            setDistricts(response.data.data);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const fetchWards = async (districtId) => {
        console.log("districtId", districtId)
        try {
            const response = await axios.post(`${GHN_API_URL}/ward`, {district_id: districtId},
                {
                    headers: {Token: TOKEN}
                },
            );
            setWards(response.data.data);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) fetchDistricts(selectedProvince);
        setDistricts([]);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setWards([]);
        onAddressChange(selectedProvince, null, null, specificAddress);
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) fetchWards(selectedDistrict);
        setSelectedWard(null);
        setWards([]);
        onAddressChange(selectedProvince, selectedDistrict, null, specificAddress);
    }, [selectedDistrict]);

    const handleProvinceChange = (value) => setSelectedProvince(value);

    const handleDistrictChange = (value) => setSelectedDistrict(value);

    const handleWardChange = (value) => {
        setSelectedWard(value);
        onAddressChange(selectedProvince, selectedDistrict, value, specificAddress);
    };

    const handleSpecificAddressChange = (e) => {
        const value = e.target.value;
        setSpecificAddress(value);
        onAddressChange(selectedProvince, selectedDistrict, selectedWard, value);
    };

    return (
        <Form>
            <Row gutter={16}>
                <Col span={12} className="mb-3">
                    <Form.Item label="Tỉnh/Thành phố">
                        <Select
                            value={selectedProvince || null}
                            onChange={handleProvinceChange}
                            placeholder="Chọn tỉnh/thành phố"
                        >
                            {provinces.map(province => (
                                <Option key={province.ProvinceID} value={province.ProvinceID}>
                                    {province.ProvinceName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Quận/Huyện">
                        <Select
                            value={selectedDistrict || null}
                            onChange={handleDistrictChange}
                            placeholder="Chọn quận/huyện"
                            disabled={!selectedProvince}
                        >
                            {districts.map(district => (
                                <Option key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Phường/Xã">
                        <Select
                            value={selectedWard || null}
                            onChange={handleWardChange}
                            placeholder="Chọn xã/phường"
                            disabled={!selectedDistrict}
                        >
                            {wards.map(ward => (
                                <Option key={ward.WardCode} value={ward.WardCode}>
                                    {ward.WardName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item label="Số nhà/ngõ đường">
                        <Input
                            value={specificAddress}
                            onChange={handleSpecificAddressChange}
                            placeholder="Ngõ/tên đường ..."
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

export default AddressSelector;
