import { useState} from "react";
import { useFormik } from "formik";
import { Form, Button } from 'semantic-ui-react';
import * as yup from 'yup';

function SignUpForm({ onLogin }) {
    const [popupAlert, setPopupAlert] = useState(false)

    const validationSchema = yup.object({
        username: yup.string().required(),
        password: yup.string().required(),
        passwordConfirmation: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords must match")
            .required(),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            passwordConfirmation: "",
        },
        validationSchema,
        onSubmit: (values, { setErrors, setSubmitting }) => {
          setSubmitting(true);
          fetch("/signup", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((r) => {
              setSubmitting(false);
              if (r.ok) {
                r.json().then((user) => onLogin(user));
              } else {
                r.json().then((err) => setErrors(err.errors));
    
              }
            })
            .catch((error) => {
              setSubmitting(false);
              console.error(error);
            });
        },
    });

    return (
        <div style={{width:"15%"}}>
            <h2 style={{textAlign:"center", marginTop:"75px"}}>Create Account</h2>
            <Form onSubmit={formik.handleSubmit} style={{textAlign:"center"}}>
                <Form.Field>
                    <Form.Input
                    className="form-control"
                    type="text"
                    id="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    placeholder="Username..."
                    />
                    <p style={{ color: "red" }}> {formik.errors.username}</p>
                </Form.Field>
                <Form.Field>
                    <Form.Input
                    className="form-control"
                    type="password"
                    id="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="password..."
                    />
                </Form.Field>
                <Form.Field>
                    <Form.Input
                    className="form-control"
                    type="password"
                    id="passwordConfirmation"
                    value={formik.values.passwordConfirmation}
                    onChange={formik.handleChange}
                    placeholder="confirm password"
                    />
                    <p>{popupAlert ? <p style={{color:"red"}}>Incorrect Password</p> : ""}</p>
                </Form.Field>
                <Button type="submit">
                    Sign Up
                </Button>
            </Form>
        </div>
    )
}
export default SignUpForm;