"use client";
import React from "react";
import {
  AppBar as MuiAppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Button,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { AiFillHome } from "react-icons/ai";
import { SiGoogleclassroom } from "react-icons/si";
import { IoSchool } from "react-icons/io5";
import Cookies from "js-cookie";
import { useLogin } from "../context/LoginContext";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

export default function AppBar(
  { children }: { children: React.ReactNode },
  props: Props
) {
  const token = Cookies.get("token");
  const { login, setLogin, role } = useLogin();

  const router = useRouter();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key={"Home"} disablePadding>
          <ListItemButton onClick={() => router.push("/")}>
            <ListItemIcon>
              <AiFillHome />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>

        <ListItem key={"CreateClass"} disablePadding>
          <ListItemButton onClick={() => router.push("/addclass")}>
            <ListItemIcon>
              <SiGoogleclassroom />
            </ListItemIcon>
            <ListItemText primary={"CreateClass"} />
          </ListItemButton>
        </ListItem>

        <ListItem key={"ViewClasses"} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <IoSchool />
            </ListItemIcon>
            <ListItemText primary={"ViewClasses"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MuiAppBar
          elevation={0}
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: "white",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: {
                xs: "space-between",
                sm: "right",
              },
            }}
          >
            <IconButton
              style={{ color: "grey" }}
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {role == "PRINCIPAL" && (
              <Button
                variant="contained"
                style={{ borderRadius: 17, marginRight: 5 }}
                onClick={() => {
                  router.push("/signup");
                }}
              >
                Register
              </Button>
            )}

            {login && (
              <Button
                variant="contained"
                style={{ borderRadius: 17 }}
                onClick={() => {
                  setLogin(false);
                  Cookies.remove("token")
                }}
              >
                Logout
              </Button>
            )}

            {!login && (
              <Button
                variant="contained"
                style={{ borderRadius: 17 }}
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </MuiAppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </>
  );
}

// const Appbar = ({ children }: { children: React.ReactNode }) => {
//   const router = useRouter();
//   const { login, setLogin, role } = useLogin();

//   const handleLogout = () => {
//     Cookies.remove("token");
//     setLogin(false);
//     router.push("/");
//   };

//   return (
//     <>
//       <MuiAppBar position="static" style={{ backgroundColor: "#34c300" }}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             width: "100%",
//             marginTop: 2,
//             padding: 2,
//             flexDirection: {
//               xs: "column",
//               md: "row",
//               lg: "row",
//             },
//             gap:5
//           }}
//         >
//           <Typography
//             variant="h5"
//             sx={{ cursor: "pointer", marginLeft: 2 }}
//             onClick={() => {
//               router.push("/");
//             }}
//           >
//             HOME
//           </Typography>
//           <Box
//             sx={{
//               display: "flex",
//               gap: 2,
//               marginRight: 10,
//               flexDirection: {
//                 xs: "column",
//                 md: "row",
//                 lg: "row",
//               },
//             }}
//           >
//             {login ? (
//               <>
//                 <Button
//                   variant="contained"
//                   onClick={handleLogout}

//                 >
//                   Logout
//                 </Button>

//                 {role === "PRINCIPAL" && (
//                   <Button

//                     variant="contained"
//                     onClick={() => {
//                       router.push("/addcar");
//                     }}
//                   >
//                     CreateClassRoom
//                   </Button>
//                 )}

//                 <Button
//                   variant="contained"
//                   onClick={() => {
//                     router.push("/getcars");
//                   }}

//                 >
//                   VIEWCL
//                 </Button>
//               </>
//             ) : (
//               <>
//                 <Button
//                   variant="contained"
//                   onClick={() => {
//                     router.push("/login");
//                   }}

//                 >
//                   Login
//                 </Button>

//               </>
//             )}
//                <SuprSendInbox
//          workspaceKey="irQ1EZbPcX87e9oZulrj"
//       subscriberId="pIzG1VcpZ3dp3Ou1US8RKBvl1tS2OhclpWECzYOzNCU="
//       distinctId="palfalgun@gmail.com"
//       themeType="dark"

//       />
//           </Box>
//         </Box>
//       </MuiAppBar>
//       {children}
//     </>
//   );
// };
