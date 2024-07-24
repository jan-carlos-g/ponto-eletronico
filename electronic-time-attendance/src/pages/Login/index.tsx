import { FC } from "react";
import "./style.css";
import CodeForm from "./codeForm";
import { Row, Col, Card, CardBody, Container } from "reactstrap";

const Login: FC = () => {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md="4">
          <Card>
            <CardBody>
              <CodeForm />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
