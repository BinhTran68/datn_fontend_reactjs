
import React, { useState, useEffect } from 'react';
import styles from './CustomerProfile.module.css';
import axios from 'axios';
import moment from 'moment';
import { Upload, DatePicker, Input, Select, Radio, Button, message, Modal, Form } from 'antd';
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import AddressSelectorAntd from "../utils/AddressSelectorAntd"; // Đảm bảo đường dẫn chính xác

const { Option } = Select;

const CustomerProfile = () => {
  // Trạng thái cho các giá trị biểu mẫu
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
    idNumber: '',
    address: '',
    phone: '',
    email: '',
    addresses: []
  });

  // Trạng thái cho mục menu đang hoạt động
  const [activeMenu, setActiveMenu] = useState('personal');

  // Trạng thái để tải và xử lý lỗi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [avatarPublicId, setAvatarPublicId] = useState(null);

  // Trạng thái mới cho chế độ chỉnh sửa
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);

  // Thêm state để quản lý địa chỉ
  const [address, setAddress] = useState({
    provinceId: null,
    districtId: null,
    wardId: null,
    specificAddress: null,
  });
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [isAddressLoaded, setIsAddressLoaded] = useState(false);
  // Add these state variables with the other useState declarations
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editAddressData, setEditAddressData] = useState(null);

  // Add these state variables at the top with other useState declarations
  const [isAddAddressModalVisible, setIsAddAddressModalVisible] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    provinceId: null,
    districtId: null,
    wardId: null,
    specificAddress: '',
  });

  const handleAddNewAddress = async (values) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/customers/add-address/${customerId}`, newAddressData);
      message.success('Thêm địa chỉ mới thành công');
      setIsAddAddressModalVisible(false);
      setNewAddressData({
        provinceId: null,
        districtId: null,
        wardId: null,
        specificAddress: '',
      });
      fetchCustomerData(customerId); // Refresh data
    } catch (error) {
      message.error('Không thể thêm địa chỉ mới');
      console.error('Error adding new address:', error);
    }
  };

  // Add these functions before the render methods
  const handleViewAddress = (address) => {
    setSelectedAddress(address);
    setIsViewModalVisible(true);
  };

  const handleEditAddress = (address) => {
    setEditAddressData(address);
    setIsEditModalVisible(true);
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/customers/set-default-address/${addressId}`);
      message.success('Địa chỉ mặc định đã được cập nhật');
      fetchCustomerData(customerId); // Refresh the data
    } catch (error) {
      message.error('Không thể đặt địa chỉ mặc định');
      console.error('Error setting default address:', error);
    }
  };

  const handleSaveAddressEdit = async (addressId, updatedData) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/customers/update-address/${addressId}`, updatedData);
      message.success('Cập nhật địa chỉ thành công');
      setIsEditModalVisible(false);
      fetchCustomerData(customerId); // Refresh the data
    } catch (error) {
      message.error('Không thể cập nhật địa chỉ');
      console.error('Error updating address:', error);
    }
  };

  // Lấy dữ liệu khách hàng khi thành phần được gắn kết
  useEffect(() => {
    // Bạn có thể lấy ID khách hàng từ tham số URL, ngữ cảnh xác thực, v.v.
    const id = localStorage.getItem('customerId') || 1; // Quay lại ID 1 nếu không tìm thấy
    setCustomerId(id);
    fetchCustomerData(id);
  }, []);

  // Chức năng lấy dữ liệu khách hàng từ API
  const fetchCustomerData = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/admin/customers/detail/${id}`);
      const customerData = response.data;

      // Tìm địa chỉ mặc định
      const defaultAddress = customerData.addresses?.find(addr => addr.isAddressDefault);
      let addressString = '';

      if (defaultAddress) {
        // Cải thiện cách hiển thị địa chỉ bằng cách kiểm tra các thành phần tồn tại
        const parts = [
          defaultAddress.specificAddress,
          defaultAddress.ward,
          defaultAddress.district,
          defaultAddress.province
        ].filter(part => part && part.trim() !== '');

        addressString = parts.join(', ');

        // Lưu thông tin chi tiết về địa chỉ
        setAddress({
          provinceId: String(defaultAddress.provinceId || ''),
          districtId: String(defaultAddress.districtId || ''),
          wardId: String(defaultAddress.wardId || ''),
          specificAddress: defaultAddress.specificAddress || ''
        });

        setDefaultAddressId(defaultAddress.id);
        setIsAddressLoaded(true);
      }

      // Phản hồi API bản đồ cho cấu trúc dữ liệu biểu mẫu
      const formattedData = {
        fullName: customerData.fullName || '',
        birthDate: customerData.dateBirth ? moment(customerData.dateBirth).format('YYYY-MM-DD') : '',
        gender: customerData.gender === true ? 'Nam' : customerData.gender === false ? 'Nữ' : '',
        idNumber: customerData.citizenId || '',
        address: addressString,
        phone: customerData.phoneNumber || '',
        email: customerData.email || '',
        status: customerData.status === 1 ? 'Kích hoạt' : 'Khóa',
        addresses: customerData.addresses || []
      };

      setFormData(formattedData);

      // Đặt dữ liệu để chỉnh sửa biểu mẫu
      setEditFormData({
        fullName: customerData.fullName || '',
        birthDate: customerData.dateBirth ? moment(customerData.dateBirth) : null,
        gender: customerData.gender,
        citizenId: customerData.citizenId || '',
        phoneNumber: customerData.phoneNumber || '',
        email: customerData.email || '',
        status: customerData.status
      });

      setSelectedGender(customerData.gender);

      // Nếu có hình đại diện, hãy thiết lập nó
      if (customerData.avatar) {
        setAvatar(customerData.avatar);
        setAvatarPublicId(customerData.avatarPublicId);

        setFileList([{
          uid: customerData.avatarPublicId || '-1',
          name: 'avatar',
          status: 'done',
          url: customerData.avatar,
        }]);
      }

    } catch (err) {
      console.error("Error fetching customer data:", err);
      setError("Không thể tải thông tin khách hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý mục menu nhấp chuột
  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    // Thoát chế độ chỉnh sửa khi chuyển đổi menu
    setEditMode(false);
  };

  // Nhận huy hiệu trạng thái khách hàng
  const getStatusBadge = () => {
    if (formData.status === 'Kích hoạt') {
      return styles.statusBadgeActive;
    } else {
      return styles.statusBadgeInactive;
    }
  };

  // Chuyển đổi chế độ chỉnh sửa
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  // Xử lý thay đổi biểu mẫu
  const handleFormChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Xử lý thay đổi hình đại diện
  const handleAvatarChange = async ({ fileList: newFileList }) => {
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      try {
        const result = await cloudinaryUpload(newFileList[0].originFileObj);
        setFileList([{
          uid: result.public_id,
          name: result.public_id,
          status: 'done',
          url: result.url,
        }]);
      } catch (error) {
        message.error('Upload ảnh thất bại!');
      }
    } else {
      setFileList(newFileList);
    }
  };

  // Thêm xử lý thay đổi địa chỉ
  const handleAddressChange = (provinceId, districtId, wardId, specificAddress) => {
    setAddress({
      provinceId: provinceId,
      districtId: districtId,
      wardId: wardId,
      specificAddress: specificAddress
    });
  };

  // Tải hình ảnh lên Cloudinary
  const cloudinaryUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'uploaddatn');

    try {
      const res = await axios.post(
        'https://api.cloudinary.com/v1_1/dieyhvcou/image/upload',
        formData
      );
      return {
        url: res.data.secure_url,
        public_id: res.data.public_id
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  // Yêu cầu tùy chỉnh cho thành phần Tải lên
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const result = await cloudinaryUpload(file);
      onSuccess(result, file);
    } catch (error) {
      console.error("Custom request error:", error);
      onError(error);
    }
  };

  // Xử lý xóa hình đại diện
  const handleRemove = async (file) => {
    try {
      await axios.post('http://localhost:8080/cloudinary/delete', {
        public_id: file.uid
      });
    } catch (error) {
      console.error('Lỗi xóa ảnh:', error);
    }
  };

  // Xác thực hình ảnh trước khi tải lên
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  // Lưu dữ liệu khách hàng đã cập nhật
  const saveCustomerData = async () => {
    setLoading(true);

    try {
      // Chuẩn bị dữ liệu khách hàng
      let avatarUrl = avatar || '';
      let newAvatarPublicId = avatarPublicId || '';

      // Nếu hình ảnh mới được tải lên
      if (fileList.length > 0 && fileList[0].url) {
        avatarUrl = fileList[0].url;
        newAvatarPublicId = fileList[0].uid;
      }

      const customerData = {
        fullName: editFormData.fullName,
        citizenId: editFormData.citizenId,
        phoneNumber: editFormData.phoneNumber,
        email: editFormData.email,
        gender: selectedGender,
        dateBirth: editFormData.birthDate ? editFormData.birthDate.format('YYYY-MM-DDTHH:mm:ss') : null,
        status: editFormData.status,
        avatar: avatarUrl,
        avatarPublicId: newAvatarPublicId,
      };

      // Cập nhật thông tin khách hàng
      await axios.put(`http://localhost:8080/api/admin/customers/update/${customerId}`, customerData);

      // Xử lý cập nhật địa chỉ
      const addressData = {
        provinceId: address.provinceId,
        districtId: address.districtId,
        wardId: address.wardId,
        specificAddress: address.specificAddress,
        isAddressDefault: true
      };

      if (defaultAddressId) {
        // Cập nhật địa chỉ nếu đã tồn tại
        await axios.put(`http://localhost:8080/api/admin/customers/update-address/${defaultAddressId}`, addressData);
      } else if (address.provinceId && address.districtId && address.wardId && address.specificAddress) {
        // Thêm địa chỉ mới nếu chưa có
        await axios.post(`http://localhost:8080/api/admin/customers/add-address/${customerId}`, addressData);
      }

      message.success('Cập nhật thông tin thành công!');
      setEditMode(false);
      fetchCustomerData(customerId); // Refresh data

    } catch (error) {
      console.error('Error updating customer:', error);
      message.error('Cập nhật thông tin thất bại!');
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditMode(false);
    fetchCustomerData(customerId); // Reset data to original
  };

  // Render the appropriate content based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case 'personal':
        return renderPersonalSection();
      case 'financial':
        return (
          <>
            <div className={styles.sectionHeader}>
              <h2>Thông tin tài chính</h2>
            </div>
            <div className={styles.infoCard}>
              <p>Nội dung thông tin tài chính sẽ hiển thị ở đây.</p>
            </div>
          </>
        );
      case 'history':
        return (
          <>
            <div className={styles.sectionHeader}>
              <h2>Lịch sử mua hàng</h2>
            </div>
            <div className={styles.infoCard}>
              <p>Nội dung lịch sử mua hàng sẽ hiển thị ở đây.</p>
            </div>
          </>
        );
      case 'contact':
        return renderContactSection();
      default:
        return (
          <>
            <div className={styles.sectionHeader}>
              <h2>Thông tin cá nhân</h2>
            </div>
            <div className={styles.infoCard}>
              <p>Vui lòng chọn một mục để xem chi tiết.</p>
            </div>
          </>
        );
    }
  };

  // Function to render personal section (view or edit mode)
  const renderPersonalSection = () => {
    return (
      <>
        <div className={styles.sectionHeader}>
          <h2>Thông tin cá nhân</h2>
          {!editMode && (
            <Button
              type="primary"
              onClick={toggleEditMode}
              className={styles.editButton}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>

        {loading ? (
          <div className={styles.loadingIndicator}>Đang tải thông tin...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <div className={styles.infoCard}>
            {editMode ? renderEditForm() : renderViewForm()}
          </div>
        )}
      </>
    );
  };

  // Render view form
  const renderViewForm = () => {
    // Find default address to display more detailed information
    const defaultAddress = formData.addresses?.find(addr => addr.isAddressDefault);

    return (
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>Họ và tên:</label>
          <div className={styles.formValue}>{formData.fullName}</div>
        </div>

        <div className={styles.formGroup}>
          <label>Ngày sinh:</label>
          <div className={styles.formValue}>{formData.birthDate}</div>
        </div>

        <div className={styles.formGroup}>
          <label>Giới tính:</label>
          <div className={styles.formValue}>{formData.gender}</div>
        </div>

        <div className={styles.formGroup}>
          <label>Số CMND/CCCD:</label>
          <div className={styles.formValue}>{formData.idNumber}</div>
        </div>

        <div className={styles.formGroup}>
          <label>Trạng thái:</label>
          <div className={styles.formValue}>
            <span className={getStatusBadge()}>{formData.status}</span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Số điện thoại:</label>
          <div className={styles.formValue}>{formData.phone}</div>
        </div>

        <div className={styles.formGroup}>
          <label>Email:</label>
          <div className={styles.formValue}>{formData.email}</div>
        </div>

        <div className={styles.formGroup} style={{ gridColumn: '1 / span 2' }}>
          <label>Địa chỉ:</label>
          {defaultAddress ? (
            <div className={styles.addressDetailView}>
              <div className={styles.addressDetailRow}>
                <span className={styles.addressDetailLabel}>Số nhà/ngõ đường:</span>
                <span>{defaultAddress.specificAddress || 'Chưa có thông tin'}</span>
              </div>
              <div className={styles.addressDetailRow}>
                <span className={styles.addressDetailLabel}>Phường/Xã:</span>
                <span>{defaultAddress.wardId || 'Chưa có thông tin'}</span>
              </div>
              <div className={styles.addressDetailRow}>
                <span className={styles.addressDetailLabel}>Quận/Huyện:</span>
                <span>{defaultAddress.districtId || 'Chưa có thông tin'}</span>
              </div>
              <div className={styles.addressDetailRow}>
                <span className={styles.addressDetailLabel}>Tỉnh/Thành phố:</span>
                <span>{defaultAddress.provinceId || 'Chưa có thông tin'}</span>
              </div>
            </div>
          ) : (
            <div className={styles.formValue}>Chưa có địa chỉ</div>
          )}
        </div>
      </div>
    );
  };

  // Render edit form
  const renderEditForm = () => {
    return (
      <div className={styles.editFormContainer}>
        <div className={styles.avatarEditSection}>
          <Upload
            customRequest={customRequest}
            fileList={fileList}
            onChange={handleAvatarChange}
            onRemove={handleRemove}
            beforeUpload={beforeUpload}
            maxCount={1}
            showUploadList={false}
          >
            {fileList.length > 0 ? (
              <div className={styles.avatarPreview}>
                <img
                  src={fileList[0]?.response?.url || fileList[0]?.url}
                  alt="Avatar"
                  className={styles.avatarImage}
                />
              </div>
            ) : (
              <div className={styles.avatarUploadBtn}>
                <UserOutlined className={styles.avatarIcon} />
                <div>Upload</div>
              </div>
            )}
          </Upload>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Họ và tên:</label>
            <Input
              value={editFormData.fullName}
              onChange={(e) => handleFormChange('fullName', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Ngày sinh:</label>
            <DatePicker
              value={editFormData.birthDate}
              onChange={(date) => handleFormChange('birthDate', date)}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Giới tính:</label>
            <Radio.Group
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </div>

          <div className={styles.formGroup}>
            <label>Số CMND/CCCD:</label>
            <Input
              value={editFormData.citizenId}
              onChange={(e) => handleFormChange('citizenId', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Trạng thái:</label>
            <Select
              value={editFormData.status}
              onChange={(value) => handleFormChange('status', value)}
              style={{ width: '100%' }}
            >
              <Option value={1}>Kích hoạt</Option>
              <Option value={0}>Khóa</Option>
            </Select>
          </div>

          <div className={styles.formGroup}>
            <label>Số điện thoại:</label>
            <Input
              value={editFormData.phoneNumber}
              onChange={(e) => handleFormChange('phoneNumber', e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email:</label>
            <Input
              value={editFormData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
            />
          </div>

          {/* Thêm phần chọn địa chỉ */}
          <div className={styles.formGroup} style={{ gridColumn: '1 / span 2' }}>
            <label>Địa chỉ:</label>
            {isAddressLoaded ? (
              <AddressSelectorAntd
                provinceId={parseInt(address.provinceId) || undefined}
                districtId={parseInt(address.districtId) || undefined}
                wardId={parseInt(address.wardId) || undefined}
                specificAddressDefault={address.specificAddress}
                onAddressChange={handleAddressChange}
              />
            ) : (
              <AddressSelectorAntd
                onAddressChange={handleAddressChange}
              />
            )}
          </div>
        </div>

        <div className={styles.formActions}>
          <Button type="primary" onClick={saveCustomerData} loading={loading}>
            Lưu
          </Button>
          <Button onClick={cancelEdit} style={{ marginLeft: '10px' }}>
            Hủy
          </Button>
        </div>
      </div>
    );
  };

  // Function to render contact section
  // Update the renderContactSection function
  const renderContactSection = () => {
    const customerAddresses = formData.addresses || [];

    return (
      <>
        <div className={styles.sectionHeader}>
          <h2>Thông tin liên hệ</h2>
        </div>

        {loading ? (
          <div className={styles.loadingIndicator}>Đang tải thông tin...</div>
        ) : error ? (
          <div className={styles.errorMessage}>{error}</div>
        ) : (
          <div className={styles.infoCard}>
            <div className={styles.addressList}>
              
              <div className={styles.addressListHeader}>
                <h3>Danh sách địa chỉ</h3>
                <Button
                  type="primary"
                  onClick={() => setIsAddAddressModalVisible(true)}
                  style={{ marginBottom: 16 }}
                >
                  Thêm địa chỉ mới
                </Button>
              </div>
              {/* Add Address Modal */}
              <Modal
  title="Thêm địa chỉ mới"
  visible={isAddAddressModalVisible}
  onCancel={() => setIsAddAddressModalVisible(false)}
  footer={null}
>
  <Form onFinish={handleAddNewAddress}>
    <AddressSelectorAntd
      onAddressChange={(provinceId, districtId, wardId, specificAddress) => {
        setNewAddressData({
          provinceId,
          districtId,
          wardId,
          specificAddress
        });
      }}
    />
    <Form.Item>
      <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
        Thêm địa chỉ
      </Button>
      <Button onClick={() => setIsAddAddressModalVisible(false)}>
        Hủy
      </Button>
    </Form.Item>
  </Form>
</Modal>
              {customerAddresses.length === 0 ? (
                <p>Chưa có địa chỉ nào được thêm.</p>
              ) : (
                customerAddresses.map((address, index) => {
                  return (
                    <div key={address.id || index} className={styles.addressItem}>
                      <div className={styles.addressInfo}>
                        <div className={styles.addressHeader}>
                          <p className={styles.addressTitle}>
                            {address.isAddressDefault ? (
                              <span className={styles.defaultAddressBadge}>Địa chỉ mặc định</span>
                            ) : (
                              `Địa chỉ ${index + 1}`
                            )}
                          </p>
                          <div className={styles.addressActions}>
                            <Button
                              type="primary"
                              ghost
                              onClick={() => handleViewAddress(address)}
                              style={{ marginRight: 8 }}
                            >
                              Xem
                            </Button>
                            <Button
                              onClick={() => handleEditAddress(address)}
                              style={{ marginRight: 8 }}
                            >
                              Sửa
                            </Button>
                            {!address.isAddressDefault && (
                              <Button
                                type="dashed"
                                onClick={() => handleSetDefaultAddress(address.id)}
                              >
                                Đặt mặc định
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className={styles.addressDetails}>
                          <div className={styles.addressRow}>
                            <span className={styles.addressLabel}>Số nhà/ngõ đường:</span>
                            <span className={styles.addressValue}>{address.specificAddress || 'Chưa có thông tin'}</span>
                          </div>

                          <div className={styles.addressRow}>
                            <span className={styles.addressLabel}>Phường/Xã:</span>
                            <span className={styles.addressValue}>{address.wardId || 'Chưa có thông tin'}</span>
                          </div>

                          <div className={styles.addressRow}>
                            <span className={styles.addressLabel}>Quận/Huyện:</span>
                            <span className={styles.addressValue}>{address.districtId || 'Chưa có thông tin'}</span>
                          </div>

                          <div className={styles.addressRow}>
                            <span className={styles.addressLabel}>Tỉnh/Thành phố:</span>
                            <span className={styles.addressValue}>{address.provinceId || 'Chưa có thông tin'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* View Address Modal */}
            <Modal
              title="Chi tiết địa chỉ"
              visible={isViewModalVisible}
              onCancel={() => setIsViewModalVisible(false)}
              footer={[
                <Button key="close" onClick={() => setIsViewModalVisible(false)}>
                  Đóng
                </Button>
              ]}
            >
              {selectedAddress && (
                <div className={styles.modalAddressDetails}>
                  <div className={styles.modalAddressRow}>
                    <strong>Số nhà/ngõ đường:</strong>
                    <span>{selectedAddress.specificAddress || 'Chưa có thông tin'}</span>
                  </div>
                  <div className={styles.modalAddressRow}>
                    <strong>Phường/Xã:</strong>
                    <span>{selectedAddress.wardId || 'Chưa có thông tin'}</span>
                  </div>
                  <div className={styles.modalAddressRow}>
                    <strong>Quận/Huyện:</strong>
                    <span>{selectedAddress.districtId || 'Chưa có thông tin'}</span>
                  </div>
                  <div className={styles.modalAddressRow}>
                    <strong>Tỉnh/Thành phố:</strong>
                    <span>{selectedAddress.provinceId || 'Chưa có thông tin'}</span>
                  </div>
                  {selectedAddress.isAddressDefault && (
                    <div className={styles.defaultAddressNote}>
                      <CheckCircleOutlined /> Đây là địa chỉ mặc định
                    </div>
                  )}
                </div>
              )}
            </Modal>

            {/* Edit Address Modal */}
            <Modal
  title="Chỉnh sửa địa chỉ"
  visible={isEditModalVisible}
  onCancel={() => setIsEditModalVisible(false)}
  footer={null}
>
  {editAddressData && (
    <Form
      initialValues={{
        specificAddress: editAddressData.specificAddress,
        // Use the latest values from state instead of initial values
      }}
      onFinish={() => handleSaveAddressEdit(editAddressData.id, editAddressData)}
    >
      <AddressSelectorAntd
        provinceId={parseInt(editAddressData.provinceId) || undefined}
        districtId={parseInt(editAddressData.districtId) || undefined}
        wardId={parseInt(editAddressData.wardId) || undefined}
        specificAddressDefault={editAddressData.specificAddress}
        onAddressChange={(provinceId, districtId, wardId, specificAddress) => {
          setEditAddressData({
            ...editAddressData,
            provinceId,
            districtId,
            wardId,
            specificAddress
          });
        }}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          Lưu thay đổi
        </Button>
        <Button onClick={() => setIsEditModalVisible(false)}>
          Hủy
        </Button>
      </Form.Item>
    </Form>
  )}
</Modal>
          </div>
        )}
      </>
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Hồ Sơ Khách Hàng</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <div className={styles.profileCard}>
            <div className={styles.avatarSection}>
              <div
                className={styles.avatar}
                style={avatar ? { backgroundImage: `url(${avatar})`, backgroundSize: 'cover' } : {}}
              >
                {!avatar && <div className={styles.avatarPlaceholder}>{formData.fullName ? formData.fullName.charAt(0) : 'KH'}</div>}
              </div>
              <div className={`${styles.statusBadge} ${getStatusBadge()}`}>{formData.status}</div>
            </div>

            <div className={styles.customerInfo}>
              <h3>{formData.fullName || 'Khách hàng'}</h3>
              <p>{formData.phone || 'Chưa có số điện thoại'}</p>
            </div>

            <div className={styles.menuItems}>
              <div
                className={`${styles.menuItem} ${activeMenu === 'personal' ? styles.active : ''}`}
                onClick={() => handleMenuClick('personal')}
              >
                <i className={`${styles.icon} ${styles.personalIcon}`}></i>
                Thông tin cá nhân
              </div>
              <div
                className={`${styles.menuItem} ${activeMenu === 'financial' ? styles.active : ''}`}
                onClick={() => handleMenuClick('financial')}
              >
                <i className={`${styles.icon} ${styles.financialIcon}`}></i>
                Thông tin tài chính
              </div>
              <div
                className={`${styles.menuItem} ${activeMenu === 'history' ? styles.active : ''}`}
                onClick={() => handleMenuClick('history')}
              >
                <i className={`${styles.icon} ${styles.historyIcon}`}></i>
                Lịch sử mua hàng
              </div>
              <div
                className={`${styles.menuItem} ${activeMenu === 'feedback' ? styles.active : ''}`}
                onClick={() => handleMenuClick('feedback')}
              >
                <i className={`${styles.icon} ${styles.feedbackIcon}`}></i>
                Đánh giá & Phản hồi
              </div>
              <div
                className={`${styles.menuItem} ${activeMenu === 'marketing' ? styles.active : ''}`}
                onClick={() => handleMenuClick('marketing')}
              >
                <i className={`${styles.icon} ${styles.marketingIcon}`}></i>
                Thông tin tiếp thị
              </div>
              <div
                className={`${styles.menuItem} ${activeMenu === 'contact' ? styles.active : ''}`}
                onClick={() => handleMenuClick('contact')}
              >
                <i className={`${styles.icon} ${styles.contactIcon}`}></i>
                Thông tin liên hệ
              </div>
              <div
                className={`${styles.menuItem} ${activeMenu === 'preferences' ? styles.active : ''}`}
                onClick={() => handleMenuClick('preferences')}
              >
                <i className={`${styles.icon} ${styles.preferencesIcon}`}></i>
                Sở thích & Nhu cầu
              </div>
              <div
                className={`${styles.menuItem} ${activeMenu === 'category' ? styles.active : ''}`}
                onClick={() => handleMenuClick('category')}
              >
                <i className={`${styles.icon} ${styles.categoryIcon}`}></i>
                Phân loại khách hàng
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;