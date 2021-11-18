import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../context/Auth";
import { Formik, Form } from "formik";
import TextInput from "../ui/TextInput";
import Error from "../components/Error";
import * as Yup from "yup";
import { LockClosedIcon } from "@heroicons/react/solid";

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be 3 characters or more.")
    .required("Username is required."),
  email: Yup.string().email("Invalid email.").required("Email is required."),
  password: Yup.string()
    .min(8, "Password must be 8 characters or more.")
    .required("Password is required."),
});

const Signup = () => {
  const authContext = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await axios.post("/api/signup", values);
      authContext.setAuthState(data);
      history.push("/");
    } catch (e) {
      setLoading(false);
      const { data } = e.response;
      setError(data.message);
    }
  };

  return (
    <main className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <section className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign up for an account
        </h2>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          onSubmit={(values) => handleSubmit(values)}
          validationSchema={SignupSchema}
        >
          <Form className="mt-8 space-y-6">
            <TextInput
              id="username"
              label="Username"
              name="username"
              type="text"
              autoFocus
            />
            <TextInput label="Email" id="email" name="email" type="text" />
            <TextInput
              id="password"
              label="Password"
              name="password"
              type="password"
            />
            <button
              id="signup-btn"
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-2xl font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-8 w-8 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Sign up
            </button>
            {error && <Error error={error} />}
          </Form>
        </Formik>
      </section>
    </main>
  );
};

export default Signup;
