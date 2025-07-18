// React Imports
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// Formik Imports
import { Form, Formik, FormikProps } from "formik";
// MUI Imports
import { Button, Box, Typography } from "@mui/material";
// Custom Imports
import { SubHeading } from "../../components/Heading";
import PrimaryInput from "../../components/PrimaryInput/PrimaryInput";
import ToastAlert from "../../components/ToastAlert/ToastAlert";
// React Icons Imports
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
// Validation Schema Imports
import { loginSchema } from "./components/validationSchema";
// Utils Imports
import { onKeyDown } from "../../utils";
// Images Imports
import DoctorAppointmentImage from "../../assets/images/doctor-appointment.png";
// Redux API
import { useLoginMutation } from "../../redux/api/authApiSlice";
import { setUser } from "../../redux/auth/authSlice";

interface ISLoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formValues] = useState<ISLoginForm>({ email: "", password: "" });
  const [toast, setToast] = useState({ message: "", appearence: false, type: "" });
  const [loginUser, { isLoading }] = useLoginMutation();

  const hideShowPassword = () => setShowPassword(!showPassword);
  const handleCloseToast = () => setToast({ ...toast, appearence: false });

  const LoginHandler = async (data: ISLoginForm) => {
    try {
      const user: any = await loginUser(data);
      if (user?.data?.status) {
        dispatch(setUser(user?.data));
        localStorage.setItem("user", JSON.stringify(user?.data));
        navigate("/");
      } else if (user?.error) {
        setToast({ ...toast, message: user?.error?.data?.message, appearence: true, type: "error" });
      }
    } catch (error) {
      console.error("Login Error:", error);
      setToast({ ...toast, message: "Something went wrong", appearence: true, type: "error" });
    }
  };

  return (
    <>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        px: 2,
        py: 4,
        background: "linear-gradient(135deg, #e0f7fa 0%, #f0f4ff 100%)",
      }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            bgcolor: "#fff",
            p: 4,
            borderRadius: 4,
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            backdropFilter: "blur(8px)",
            border: "1px solid #e0e7ef",
            transition: "box-shadow 0.3s",
            '&:hover': {
              boxShadow: "0 12px 40px rgba(0,0,0,0.16)",
            },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <img
              src={DoctorAppointmentImage}
              alt="Doctor's Appointment"
              style={{
                height: 120,
                width: "auto",
                objectFit: "contain",
                borderRadius: 16,
                boxShadow: "0 2px 8px rgba(37,99,235,0.10)",
                background: "#f8fafc"
              }}
            />
          </Box>
          <Typography
            sx={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: "'Poppins', sans-serif",
              mb: 3,
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              textAlign: "center",
              textDecoration: "underline",
              color: "#22223b",
            }}
          >
            Book Your Appointment
          </Typography>
          <Formik
            initialValues={formValues}
            onSubmit={(values: ISLoginForm) => LoginHandler(values)}
            validationSchema={loginSchema}
          >
            {(props: FormikProps<ISLoginForm>) => {
              const { values, touched, errors, handleBlur, handleChange } = props;
              return (
                <Form onKeyDown={onKeyDown}>
                  <Box sx={{ mb: 3 }}>
                    <SubHeading sx={{ mb: 1, color: "#22223b" }}>Email</SubHeading>
                    <PrimaryInput
                      type="text"
                      name="email"
                      placeholder="Email"
                      value={values.email}
                      helperText={touched.email && errors.email ? errors.email : ""}
                      error={touched.email && Boolean(errors.email)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      sx={{
                        borderRadius: 2,
                        border: "1px solid #e0e7ef",
                        '&:focus-within': {
                          borderColor: '#2563eb',
                        },
                        background: '#f7faff',
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <SubHeading sx={{ mb: 1, color: "#22223b" }}>Password</SubHeading>
                    <PrimaryInput
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={values.password}
                      helperText={touched.password && errors.password ? errors.password : ""}
                      error={touched.password && Boolean(errors.password)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onClick={hideShowPassword}
                      endAdornment={showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                      sx={{
                        borderRadius: 2,
                        border: "1px solid #e0e7ef",
                        '&:focus-within': {
                          borderColor: '#2563eb',
                        },
                        background: '#f7faff',
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: 14, mb: 2, textAlign: "center" }}>
                    New here?{' '}
                    <Link to="/signup" style={{ fontWeight: 600, textDecoration: "none", color: "#2563eb" }}>
                      Create a new account
                    </Link>
                  </Typography>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: 16,
                      borderRadius: 2,
                      backgroundColor: "#2563eb",
                      boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
                      '&:hover': {
                        backgroundColor: "#1e40af",
                        boxShadow: "0 4px 16px rgba(30,64,175,0.12)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Box>
      </Box>
      <ToastAlert appearence={toast.appearence} type={toast.type} message={toast.message} handleClose={handleCloseToast} />
    </>
  );
};

export default Login;
