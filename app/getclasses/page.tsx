"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  Button,
  Grid,
  CircularProgress,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useLogin } from "../../context/LoginContext";
import CarDetailsModal from "./CarDetailsModal";
import Cookies from "js-cookie";
import { decode_jwt } from "@falgunpal/jwt-helper-ts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomButton from "@/components/CustomButton";

export type Car = {
  id: number;
  carname: string;
  manufacturingdate: string;
  price: string;
  image: string;
  userId: number;
};

const Cars = () => {
  const { login } = useLogin();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const token = Cookies.get("token");
  const [userRole, setUserRole] = useState<"USER" | "ADMIN">("USER"); // Default to USER

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_JWT_SECRET || !token) {
      return;
    }
    const { payload } = decode_jwt(process.env.NEXT_PUBLIC_JWT_SECRET, token);
    setUserRole(payload.role);

    async function getCars() {
      try {
        const response = await fetch("/api/getcars", {
          next: {
            tags: ["cars"],
          },
        });
        const data = await response.json();
        setCars(data.cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    }

    if (login) {
      getCars();
    } else {
      setLoading(false);
    }
  }, [login, token]);

  const handleCarUpdate = (updatedCar: Car) => {
    setCars((prevCars) =>
      prevCars.map((car) => (car.id === updatedCar.id ? updatedCar : car))
    );
  };

  const handleCarDelete = async (carToDelete: Car) => {
    try {
      const response = await axios.delete(`/api/deletecar/${carToDelete.id}`);
      setCars((prevCars) =>
        prevCars.filter((car) => car.id !== carToDelete.id)
      );
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Failed to delete car.");
    }
  };

  if (!login) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: "#333" }}>
          You are not logged in
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#666" }}>
          Please log in to view the available cars.
        </Typography>
        <CustomButton
          variant="contained"
          text=" Go to Login"
          onClick={() => (window.location.href = "/login")}
        ></CustomButton>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          Loading cars, please wait...
        </Typography>
      </Box>
    );
  }

  const totalCars = cars.length;

  return (
    <>
      <ToastContainer autoClose={1000} theme="dark" />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, color: "#2ba000" }}>
          Car Dashboard
        </Typography>
        {userRole === "ADMIN" && (
          <Box
            sx={{
              marginBottom: 4,
              padding: 2,
              backgroundColor: "#e8f5e9",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Total Cars: {totalCars}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {/* Add more statistics here if needed */}
          </Box>
        )}
        <Grid container spacing={3} justifyContent="center">
          {cars.map((car) => (
            <Grid item key={car.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  padding: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <img
                  src={car.image as string}
                  alt={car.carname}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "200px",
                    borderRadius: "8px",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    marginBottom: 2,
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordBreak: "break-word",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  {car.carname}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 3,
                    flexDirection: "column",
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => setSelectedCar(car)}
                    style={{ backgroundColor: "#36cc00" }}
                  >
                    {userRole === "ADMIN" ? "Edit Details" : "View Details"}
                  </Button>
                  {userRole === "ADMIN" && (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => handleCarDelete(car)}
                      style={{ backgroundColor: "#f82900" }}
                    >
                      Delete Car
                    </Button>
                  )}
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
        {selectedCar && (
          <CarDetailsModal
            car={selectedCar}
            userRole={userRole}
            onClose={() => setSelectedCar(null)}
            onUpdate={handleCarUpdate}
          />
        )}
      </Box>
    </>
  );
};

export default Cars;
