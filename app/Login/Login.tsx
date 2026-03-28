"use client";

import { User_Register_Login } from "@/Action/Login";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Paper, TextField, Button, Typography, Alert,
  CircularProgress, Link, Container, Stack, InputAdornment,
  IconButton, Divider,
} from "@mui/material";
import {
  EmailOutlined, LockOutlined, Visibility,
  VisibilityOff, ShieldOutlined,
} from "@mui/icons-material";

const Login = () => {
  const router = useRouter();

  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);      
  const [message, setMessage]           = useState("");
  const [error, setError]               = useState("");
  const [loading, setLoading]           = useState(false);
      
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email or password is required .");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    const res = await User_Register_Login({ email, password });

    if (res.status === "success") {
      setMessage(res.message);
      setTimeout(() => {
        if (res.role === "Admin") router.push("/adminPage");
        else router.push("/userPage");
      }, 800);
    } else {
      setError(res.message);
    }

    setLoading(false);
  };

  const field = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2, backgroundColor: "#FAFAF8", fontSize: "0.875rem",
      "& fieldset": { borderColor: "#E8E8E4" },
      "&:hover fieldset": { borderColor: "#C8C8C4" },
      "&.Mui-focused fieldset": { borderColor: "#1A1A1A", borderWidth: "1.5px" },
    },
    "& input::placeholder": { color: "#C0C0BC", opacity: 1 },
  };

  const label = {
    fontSize: "0.78rem", fontWeight: 500,
    color: "#424242", mb: 0.75, letterSpacing: "0.02em",
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F7F7F5", display: "flex", alignItems: "center", py: 4 }}>
      <Container maxWidth="sm">

        {/* ── Logo / Header ───────────────────────────────────── */}
        <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
          <Box sx={{
            width: 48, height: 48, backgroundColor: "#1A1A1A",
            borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ShieldOutlined sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
          <Typography variant="overline" sx={{ color: "#9E9E9E", letterSpacing: "0.15em", fontSize: "0.65rem", fontWeight: 500 }}>
            Secure Sign In
          </Typography>
        </Stack>

        {/* ── Card ────────────────────────────────────────────── */}
        <Paper elevation={0} sx={{
          px: { xs: 3, sm: 5 }, py: { xs: 4, sm: 5 },
          borderRadius: 3, border: "1px solid #E8E8E4", backgroundColor: "#FFFFFF",
        }}>

          {/* Title */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.03em", mb: 0.5 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ color: "#9E9E9E" }}>
              Sign in to continue to your account.
            </Typography>
          </Box>

          {/* Alerts */}
          {error   && <Alert severity="error"   sx={{ mb: 2.5, borderRadius: 2, fontSize: "0.82rem" }}>{error}</Alert>}
          {message && <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2, fontSize: "0.82rem" }}>{message}</Alert>}

          {/* Fields */}
          <Stack spacing={2.5}>

            {/* Email */}
            <Box>
              <Typography sx={label}>Email address</Typography>
              <TextField fullWidth placeholder="you@example.com" type="email" size="small"
                value={email} onChange={(e) => setEmail(e.target.value)} sx={field}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ fontSize: 17, color: "#BDBDBD" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Password */}
            <Box>
              <TextField fullWidth placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                size="small" value={password}
                onChange={(e) => setPassword(e.target.value)} sx={field}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ fontSize: 17, color: "#BDBDBD" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)}
                        edge="end" sx={{ color: "#BDBDBD", mr: -0.5 }}>
                        {showPassword
                          ? <VisibilityOff sx={{ fontSize: 17 }} />
                          : <Visibility sx={{ fontSize: 17 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

          </Stack>

          {/* Submit */}
          <Button fullWidth variant="contained" disableElevation
            disabled={loading} onClick={handleLogin}
            sx={{
              mt: 4, py: 1.4, borderRadius: 2,
              backgroundColor: "#1A1A1A", color: "#fff",
              fontWeight: 600, fontSize: "0.875rem", textTransform: "none",
              "&:hover": { backgroundColor: "#333333" },
              "&.Mui-disabled": { backgroundColor: "#E0E0E0", color: "#9E9E9E" },
            }}
          >
            {loading
              ? <CircularProgress size={18} sx={{ color: "#fff" }} />
              : "Sign in →"}
          </Button>

          <Divider sx={{ my: 3, borderColor: "#F0F0EC" }} />

          {/* Register redirect */}
          <Typography variant="body2" sx={{ textAlign: "center", color: "#9E9E9E", fontSize: "0.8rem" }}>
            Dont have an account?{" "}
            <Link component="button" underline="hover"
              onClick={() => router.push("/registerPage")}
              sx={{ color: "#1A1A1A", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
              Create one
            </Link>
          </Typography>

        </Paper>
      </Container>
    </Box>
  );
};

export default Login;