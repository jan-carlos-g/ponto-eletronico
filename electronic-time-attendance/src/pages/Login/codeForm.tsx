import React from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";
import "./style.css";

interface FormValues {
  code: string;
}

const CodeForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    try {
      await loginUser(values.code, login);
      toast.success("Login realizado com sucesso!");
      navigate("/home");
    } catch (error) {
      toast.error(
        "Erro ao realizar login. Verifique suas credenciais e tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ code: "" }}
      validationSchema={Yup.object({
        code: Yup.string().required("O código é obrigatório"),
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form>
          <h1 className="title">
            Ponto <span>Ilumeo</span>
          </h1>
          <label htmlFor="code">Código do usuário</label>
          <Field
            name="code"
            type="text"
            aria-label="Campo para preenchimento do código"
            className={`input ${errors.code && touched.code ? "is-invalid" : ""}`}
          />
          <ErrorMessage
            name="code"
            component="div"
            className="invalid-feedback"
          />
          <Button className="button" type="submit">
            <b>Confirmar</b>
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CodeForm;
