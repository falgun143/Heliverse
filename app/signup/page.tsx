"use client";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLogin } from "../../context/LoginContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SignUpSchema } from "../../utils/validationSchema"; 
import CustomButton from "@/components/CustomButton";

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Role, setRole] = useState("");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const { role,setLogin } = useLogin();

  const validateField = (field: string, value: string) => {
    const result = SignUpSchema.safeParse({ [field]: value });
    if (!result.success) {
      return result.error.errors.find((err) => err.path.includes(field)) || null;
    }
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Clear error for the field being updated
    setErrors((prevErrors) =>
      prevErrors.filter((error) => error.path !== name)
    );

    // Update the state for the specific input field
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }

    // If the value is empty, clear the error for that field
    if (value.trim() === "") {
      setErrors((prevErrors) =>
        prevErrors.filter((error) => error.path !== name)
      );
      return;
    }

    // Validate the updated field if it is not empty
    const error = validateField(name, value);
    if (error) {
      setErrors((prevErrors) => [
        ...prevErrors,
        { path: name, message: error.message },
      ]);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    //Validate the whole form
    const result = SignUpSchema.safeParse({ email, password, role:Role });
    console.log(result.success)
    if (!result.success) {
      setErrors(
        result.error.errors.map((err) => ({
          path: String(err.path[0]),
          message: err.message,
        }))
      );
      return;
    }
  
    try {
      const response = await axios.post("/api/signup", {
        email,
        password,
        role:Role,
      });
      console.log(response)
      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set("token", token);
        setLogin(true);
        setRole(Role);
        toast.success("User registered, redirecting...");
        setTimeout(() => {
          router.push("/getusers");
        }, 1500);
      }
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401 || status === 404) {
          toast.error(data.message);
        } else if (status === 405) {
          console.log(error.response.data.errors);
          setErrors(error.response.data.errors);
        }
      } else {
        toast.error("Network or server error. Please try again later.");
      }
    }
  };

  return (
    <>
      <ToastContainer autoClose={1500} theme="dark" />
      <form onSubmit={onSubmit} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card
          sx={{
            width: {
              xs: "100%",
              md: "40%",
            },
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 15,
            padding: 20,
            marginTop: 100,
          }}
        >
          <Typography variant="h6" style={{ marginBottom: 20 }}>
            Welcome SignUp Below
          </Typography>
          <TextField
            name="email"
            value={email}
            onChange={handleInputChange}
            required
            label="email"
            type="text"
            fullWidth 
            error={errors.some((err) => err.path === "email")}
            helperText={errors.find((err) => err.path === "email")?.message}
          />
          <TextField
            name="password"
            value={password}
            onChange={handleInputChange}
            required
            label="Password"
            type="password"
            fullWidth
      
            error={errors.some((err) => err.path === "password")}
            helperText={errors.find((err) => err.path === "password")?.message}
          />
          <FormControl fullWidth>
            <InputLabel id="Role">
              Role
            </InputLabel>
            <Select
              labelId="Role"
              id="Role"
              required
              label="Role"
              value={Role}
              onChange={(e) => setRole(e.target.value as string)}

            >
              {(role=="TEACHER"||role=="PRINCIPAL")&&(
             <MenuItem value={"STUDENT"}>STUDENT</MenuItem>
              )}

              {(role=="PRINCIPAL")&&(
                <MenuItem value={"TEACHER"}>TEACHER</MenuItem>
              )}
             
              
            </Select>
          </FormControl>
          <CustomButton
           type="submit"
           text="Register"
           onClick={()=>{
            console.log("Clicked")
           }}
          >
           
          </CustomButton>
        </Card>
      </form>
    </>
  );
};

export default Signup;
