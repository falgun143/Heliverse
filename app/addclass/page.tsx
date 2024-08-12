"use client";
import React, { useState, useEffect } from "react";
import { Card, TextField, Typography, Box } from "@mui/material";
import { decode_jwt } from "@falgunpal/jwt-helper-ts";
import Cookies from "js-cookie";
import axios from "axios";
import { useLogin } from "../../context/LoginContext";
import { useRouter } from "next/navigation";
import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomButton from "@/components/CustomButton";
import { Autocomplete } from "@mui/material";

const CreateClassRoom = () => {
  const { login, role } = useLogin();
  const [classname, setClassName] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(dayjs().hour(12).minute(0));
  const [endTime, setEndTime] = useState(dayjs().hour(18).minute(0));
  const [teachers, setTeachers] = useState<string[]>([]);
  const [allStudents, setAllStudents] = useState<string[]>([]);
  const [students, setStudents] = useState<string[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (login) {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/getusers");


      setTeachers(  response.data.users.filter((user: any) => user.role === "TEACHER").map((user:any)=>user.email));
      setAllStudents(response.data.users.filter((user: any) => user.role === "STUDENT").map((user:any)=>user.email));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDay = event.target.value;
    setDays((prevDays) =>
      prevDays.includes(selectedDay)
        ? prevDays.filter((day) => day !== selectedDay)
        : [...prevDays, selectedDay]
    );
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");
      if (process.env.NEXT_PUBLIC_JWT_SECRET && token) {
        const { id } = decode_jwt(process.env.NEXT_PUBLIC_JWT_SECRET, token);
        await axios.post("/api/addclass", {
          classname,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          days: days.join(","),
          userId: id,
        });
        toast.success("Class added successfully");
        toast.success("Redirecting to classes Page....");
        setTimeout(() => {
          router.push("/getclass");
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  if (!login || role !== "PRINCIPAL") {
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
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: "#666" }}>
          Only Principal Can Access this Page.
        </Typography>
        <CustomButton
          text="Login"
          onClick={() => router.push("/login")}
        ></CustomButton>
      </Box>
    );
  }

  return (
    <>
      <ToastContainer theme="dark" autoClose={3000} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          Add Class
        </Typography>
        <form
          onSubmit={handleAddClass}
          style={{ width: "100%", maxWidth: "600px" }}
        >
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              paddingTop: 8,
              paddingLeft: 2,
              paddingRight: 2,
              paddingBottom: 3,
              boxShadow: 3,
            }}
          >
            <TextField
              required
              label="Class Name"
              onChange={(e) => setClassName(e.target.value)}
              fullWidth
            />
            <Autocomplete
              options={teachers}
              getOptionLabel={(option) => option} 
              value={selectedTeacher}
              onChange={(event, newValue) => setSelectedTeacher(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Teacher" />
              )}
              fullWidth
              sx={{ mt: 2 }}
            />

            <Autocomplete
              multiple
              options={allStudents}
              getOptionLabel={(option) => option} 
              value={students}
              onChange={(event, newValue) => setStudents(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Select Students" />
              )}
              fullWidth
              sx={{ mt: 2 }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TimePicker
                    label="Start Time"
                    value={startTime}
                    onChange={(newValue: dayjs.Dayjs | null) => {
                      if (newValue) {
                        setStartTime(newValue);
                      }
                    }}
                    ampm={false}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TimePicker
                    label="End Time"
                    value={endTime}
                    onChange={(newValue: dayjs.Dayjs | null) => {
                      if (newValue) {
                        setEndTime(newValue);
                      }
                    }}
                    ampm={false}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      value={day}
                      checked={days.includes(day)}
                      onChange={handleDayChange}
                    />
                  }
                  label={day}
                />
              ))}
            </Box>

            <CustomButton
              variant="contained"
              type="submit"
              text="Add Class"
              style={{
                width: 120,
                borderRadius: 20,
                backgroundColor: "#146fe6",
                padding: 9,
              }}
            ></CustomButton>
          </Card>
        </form>
      </Box>
    </>
  );
};

export default CreateClassRoom;
