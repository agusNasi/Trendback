import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function CheckoutSteps(props) {
  return (
    <Row className="checkout-steps">
      <Col className={props.step1 ? 'active' : ''}>Crear Cuenta</Col>
      <Col className={props.step2 ? 'active' : ''}>Direccion de Envio</Col>
      <Col className={props.step3 ? 'active' : ''}>Pago</Col>
      <Col className={props.step4 ? 'active' : ''}>Realizar Pedido</Col>
    </Row>
  );
}
