// import React from 'react'
import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import Button from 'react-bootstrap/Button';
import FormRange from 'react-bootstrap/FormRange';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';

import { Container, Row, Col, Card } from 'react-bootstrap';

const ProductsPage = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [validated, setValidated] = useState(false);

  const products = [
    {
      id: 1,
      title: "Giày Nike Zoom Vapor Pro 2 HC 'White'",
      code: "DR6191-101",
      price: "3,500,000 ₫ – 3,100,000 ₫",
      image: "https://authentic-shoes.com/wp-content/uploads/2023/04/1041a182_100.png_31777d11226e41b1af636650ca10426e-300x142.png " ,
    },
    {
      id: 2,
      title: "Giày Tennis Asics Court FF Novak 'Cranberry White'",
      code: "1041A089-605",
      price: "4,500,000 ₫",
      image: "https://authentic-shoes.com/wp-content/uploads/2023/04/1041a182_100.png_31777d11226e41b1af636650ca10426e-300x142.png",
    },
    {
      id: 3,
      title: "Giày Lacoste Tennis AG-LT23 Ultra 'Green White'",
      code: "47SMA0101-2D2",
      price: "5,900,000 ₫",
      image: "https://authentic-shoes.com/wp-content/uploads/2023/04/1041a182_100.png_31777d11226e41b1af636650ca10426e-300x142.png",
    },
    {
      id: 4,
      title: "Giày Adidas Barricade 13 'White Lucid Blue'",
      code: "IF9129",
      price: "3,900,000 ₫",
      image: "https://authentic-shoes.com/wp-content/uploads/2023/04/1041a182_100.png_31777d11226e41b1af636650ca10426e-300x142.png",
    },
    {
      id: 5,
      title: "Giày Nike Zoom Vapor Pro 2 HC 'White'",
      code: "DR6191-101",
      price: "3,500,000 ₫ – 3,100,000 ₫",
      image: "https://authentic-shoes.com/wp-content/uploads/2023/04/1041a182_100.png_31777d11226e41b1af636650ca10426e-300x142.png",
    },
    {
      id: 6,
      title: "Giày Tennis Asics Court FF Novak 'Cranberry White'",
      code: "1041A089-605",
      price: "4,500,000 ₫",
      image: "https://authentic-shoes.com/wp-content/uploads/2023/04/1041a182_100.png_31777d11226e41b1af636650ca10426e-300x142.png",
    },
    {
      id: 7,
      title: "Giày Lacoste Tennis AG-LT23 Ultra 'Green White'",
      code: "47SMA0101-2D2",
      price: "5,900,000 ₫",
      image: "https://authentic-shoes.com/wp-content/uploads/2023/04/1041a182_100.png_31777d11226e41b1af636650ca10426e-300x142.png",
    },
    {
      id: 8,
      title: "Giày Adidas Barricade 13 'White Lucid Blue'",
      code: "IF9129",
      price: "3,900,000 ₫",
      image: "https://authentic-shoes.com/wp-content/uploads/2023/04/1041a182_100.png_31777d11226e41b1af636650ca10426e-300x142.png",
    },
  ];

  return (
    <div className="container">

        <header >
          <Carousel>
            <Carousel.Item interval={500}>
              <img src="https://authentic-shoes.com/wp-content/uploads/2024/05/AJ4MilitaryBlue_Primary_Desktop-2048x623.webp" alt="" width={"100%"}/>
              <Carousel.Caption>
                <h3>aaaaa</h3>
                <p>ccccccc</p>
              </Carousel.Caption>

            </Carousel.Item>
            <Carousel.Item interval={500}>
            <img src="https://authentic-shoes.com/wp-content/uploads/2024/05/AJ4MilitaryBlue_Primary_Desktop-2048x623.webp" alt="" width={"100%"}/>

              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item >

            <Carousel.Item interval={500}>
            <img src="https://authentic-shoes.com/wp-content/uploads/2024/05/AJ4MilitaryBlue_Primary_Desktop-2048x623.webp" alt="" width={"100%"}/>

              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>
                  Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </header>
        <div className='row'>

        <aside className='col-3' style={{paddingTop:'24px'}}>
          <Button variant="light" onClick={handleShow} style={{ fontWeight: 'bolder' }} >
            Lọc theo
          </Button>
          {/* <img src="https://authentic-shoes.com/wp-content/uploads/2023/04/1041a182_100.png_31777d11226e41b1af636650ca10426e-300x142.png" alt="" /> */}

          <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Bộ  Lọc</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Form>
                {['checkbox'].map((type) => (
                  <div key={`inline-${type}`} className="mb-3" >
                    <h6>Giới tính</h6>
                    <Form.Check
                      inline
                      label="Nam"
                      name="group1"
                      type={type}
                      id={`inline-${type}-1`}
                    />
                    <Form.Check
                      inline
                      label="Nữ"
                      name="group1"
                      type={type}
                      id={`inline-${type}-2`}
                    />
                    <h6>Kích cỡ</h6>
                    <Form.Check
                      inline
                      label="35"
                      name="group1"
                      type={type}
                      id={`inline-${type}-3`}
                    />
                    <Form.Check
                      inline
                      label="36"
                      name="group1"
                      type={type}
                      id={`inline-${type}-4`}
                    />
                    <Form.Check
                      inline
                      label="37"
                      name="group1"
                      type={type}
                      id={`inline-${type}-5`}
                    />
                    <Form.Check
                      inline
                      label="38"
                      name="group1"
                      type={type}
                      id={`inline-${type}-6`}
                    />
                    <Form.Check
                      inline
                      label="39"
                      name="group1"
                      type={type}
                      id={`inline-${type}-7`}
                    />
                    <Form.Check
                      inline
                      label="40"
                      name="group1"
                      type={type}
                      id={`inline-${type}-8`}
                    />
                    <h6>Kích cỡ</h6>
                    <Form.Check
                      inline
                      label="Trắng"
                      name="group1"
                      type={type}
                      id={`inline-${type}-9`}
                    />
                    <Form.Check
                      inline
                      label="Đen"
                      name="group1"
                      type={type}
                      id={`inline-${type}-10`}
                    />
                    <h6>Hãng</h6>
                    <Form.Check
                      inline
                      label="Nike"
                      name="group1"
                      type={type}
                      id={`inline-${type}-11`}
                    />
                    <Form.Check
                      inline
                      label="Puma"
                      name="group1"
                      type={type}
                      id={`inline-${type}-12`}
                    />
                    <h6>Loại</h6>
                    <Form.Check
                      inline
                      label="Thời trang"
                      name="group1"
                      type={type}
                      id={`inline-${type}-13`}
                    />
                    <Form.Check
                      inline
                      label="Thể thao"
                      name="group1"
                      type={type}
                      id={`inline-${type}-14`}
                    />
                    <h6>Chất liệu</h6>
                    <Form.Check
                      inline
                      label="Da"
                      name="group1"
                      type={type}
                      id={`inline-${type}-15`}
                    />
                    <Form.Check
                      inline
                      label="Vải"
                      name="group1"
                      type={type}
                      id={`inline-${type}-16`}
                    />
                    <h6>Đế giày</h6>
                    <Form.Check
                      inline
                      label="Cao su"
                      name="group1"
                      type={type}
                      id={`inline-${type}-17`}
                    />
                    <Form.Check
                      inline
                      label="Nhựa"
                      name="group1"
                      type={type}
                      id={`inline-${type}18`}
                    />

                    <div>
                      <Form.Check style={{ fontWeight: 'bolder' }}>Chọn khoảng giá </Form.Check>
                      <Form.Range type="range" class="form-range" id="customRange1" min="500000" max="10000000" step="1" />
                      {/* <Input type="range" class="form-range" id="customRange1" min="500000" max="10000000" step="1"> */}
                    </div>

                  </div>

                ))}

              </Form>
              <div style={{ textAlign: 'center', fontWeight: 'bolder', width: '100%' }}>
                <Button variant="light"> Lọc</Button>
              </div>


            </Offcanvas.Body>
          </Offcanvas>
        </aside>



        <article className='col-9'>
          <Container className="mt-4">
            <Row>
              {products.map((product) => (
                <Col key={product.id} md={4} className="mb-4">
                  <Card>
                    <a href="#" style={{color:'black', textDecoration:'none'}}>
                    <Card.Img className='object-cover' variant="top"  src={product.image} alt={product.title} />
                    </a>
                    <Card.Body>
                      <a href="#" style={{color:'black', textDecoration:'none'}}><Card.Title  className="fw-bold fs-6">{product.title}</Card.Title>
                      </a>
                      <a href="#" style={{color:'black', textDecoration:'none'}}><Card.Text className="text-muted">{product.code}</Card.Text>
                      </a>
                      <Card.Text className="fw-bold text-danger">{product.price}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>

{/* thanh chuyen page */}
          <Pagination style={{ paddingLeft: '400px ',borderRadius:'50' }}>
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis />

            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Item>{11}</Pagination.Item>
            <Pagination.Item active>{12}</Pagination.Item>
            <Pagination.Item>{13}</Pagination.Item>
            <Pagination.Item disabled>{14}</Pagination.Item>

            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </article>

      </div>

    </div>

  )
}

export default ProductsPage;




