import { useState } from 'react';
import { useFormik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import * as yup from "yup"; 

function LoginForm({ onLogin }) {
    const [popupAlert, setPopupAlert] = useState(false)
    
    const validationSchema = yup.object({
        username: yup.string().required(),
        password: yup.string().required(),
    });

    const formik = useFormik({
        initialValues: {
          username: "",
          password: "",
        },
        
        validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true);
            fetch("/login", {
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
                    setPopupAlert(true)
                }
            })
            .catch((error) => {
                setSubmitting(false);
                console.log(`Error: ${error}`)
            });
        },
    });
    return (
        <Form onSubmit={formik.handleSubmit}>
            <Form.Field>
                <Form.Input 
                    name="username"
                    type="text"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    placeholder="Username"
                />
                <p style={{ color: "red" }}> {formik.errors.username}</p>
            </Form.Field>
            <Form.Field>
                <Form.Input 
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    placeholder="Password"
                />
                <p style={{ color: "red" }}> {formik.errors.password}</p>
                <p>{popupAlert ? <p style={{color:"red"}}>Incorrect Password</p> : ""}</p>
            </Form.Field>
            <Button
                type="submit"
            >
                Log In
            </Button>
        </Form>
    )
}
export default LoginForm;