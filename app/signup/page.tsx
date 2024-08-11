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
import { SignUpSchema } from "../../utils/validationSchema"; // Import the validation schema

const Signup = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [errors, setErrors] = useState<{ path: string; message: string }[]>([]);
  const { setLogin, setrole } = useLogin();

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
    if (name === "username") {
      setUsername(value);
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

    // Validate the whole form
    const result = SignUpSchema.safeParse({ username, password, role });
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
        username,
        password,
        role,
      });

      if (response.status === 200) {
        const token = response.data.token;
        Cookies.set("token", token);
        setLogin(true);
        setrole(role);
        toast.success("User registered, redirecting...");
        setTimeout(() => {
          router.push("/getcars");
        }, 3000);
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
      <ToastContainer autoClose={3000} theme="dark" />
      <form onSubmit={onSubmit} style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <Card
          sx={{
            width: {
              xs: "100%",
              md: "30%",
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
            name="username"
            value={username}
            onChange={handleInputChange}
            required
            label="Username"
            type="text"
            fullWidth
            color="success"
            error={errors.some((err) => err.path === "username")}
            helperText={errors.find((err) => err.path === "username")?.message}
          />
          <TextField
            name="password"
            value={password}
            onChange={handleInputChange}
            required
            label="Password"
            type="password"
            fullWidth
            color="success"
            error={errors.some((err) => err.path === "password")}
            helperText={errors.find((err) => err.path === "password")?.message}
          />
          <FormControl fullWidth>
            <InputLabel id="role" color="success">
              Role
            </InputLabel>
            <Select
              labelId="role"
              id="role"
              required
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as string)}
              color="success"
            >
              <MenuItem value={"USER"}>USER</MenuItem>
              <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            style={{ width: "50%", backgroundColor: "#36cc00" }}
            type="submit"
          >
            SignUp
          </Button>
        </Card>
      </form>
    </>
  );
};

export default Signup;
