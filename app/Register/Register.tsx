"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Box, TextField, Button, Typography, Paper, Container,
  CircularProgress, Alert, Divider, InputAdornment, IconButton,
  Link, Stack
} from "@mui/material";
import {
  EmailOutlined, LockOutlined, Visibility,
  VisibilityOff, ShieldOutlined
} from "@mui/icons-material";
import { User_Register, User_Register_verify } from "@/Action/RegisterUser";


export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [otp, setOtp]               = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep]             = useState<"register" | "otp">("register");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  // ─── Step 1 ───────────────────────────────────────────────────────────────
const handleRegister = async () => {
  if (!email || !password) {
    setError("Both email and password are required.");
    return;
  }

  if (password.length < 6) {
    setError("Password must be at least 8 characters long.");
    return;
  }
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await User_Register(email, password);

      if (result.success) {
        setSuccess(result.message);
        setStep("otp");
      } else {
        setError(result.message);
      }
    } catch {
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2 ───────────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const result = await User_Register_verify(email, otp);

      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => router.push("/userPage"), 1000);
      } else {
        setError(result.message);
      }
    } catch {
      setError("OTP verification failed. try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Styles ───────────────────────────────────────────────────────────────
  const field = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2, backgroundColor: "#FAFAF8", fontSize: "0.875rem",
      "& fieldset": { borderColor: "#E8E8E4" },
      "&:hover fieldset": { borderColor: "#C8C8C4" },
      "&.Mui-focused fieldset": { borderColor: "#1A1A1A", borderWidth: "1.5px" },
      "&.Mui-disabled": { backgroundColor: "#F5F5F2" },
    },
    "& input::placeholder": { color: "#C0C0BC", opacity: 1 },
  };

  const label = {
    fontSize: "0.78rem", fontWeight: 500,
    color: "#424242", mb: 0.75, letterSpacing: "0.02em"
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F7F7F5", display: "flex", alignItems: "center", py: 4 }}>
      <Container maxWidth="sm">

        <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
          <Box sx={{ width: 48, height: 48, backgroundColor: "#1A1A1A", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldOutlined sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
          <Typography variant="overline" sx={{ color: "#9E9E9E", letterSpacing: "0.15em", fontSize: "0.65rem", fontWeight: 500 }}>
            {step === "register" ? "Step 1 of 2 — Account Setup" : "Step 2 of 2 — Verification"}
          </Typography>
        </Stack>

        <Paper elevation={0} sx={{ px: { xs: 3, sm: 5 }, py: { xs: 4, sm: 5 }, borderRadius: 3, border: "1px solid #E8E8E4", backgroundColor: "#FFFFFF" }}>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1A1A1A", letterSpacing: "-0.03em", mb: 0.5 }}>
              {step === "register" ? "Create your account" : "Verify your email"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#9E9E9E" }}>
              {step === "register"
                ? "Fill in your details below to get started."
                : `We sent a 6-digit code to ${email}`}
            </Typography>
          </Box>

          {error   && <Alert severity="error"   sx={{ mb: 2.5, borderRadius: 2, fontSize: "0.82rem" }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2, fontSize: "0.82rem" }}>{success}</Alert>}

          <Stack spacing={2.5}>
            <Box>
              <Typography sx={label}>Email address</Typography>
              <TextField fullWidth placeholder="you@example.com" type="email" size="small"
                value={email} disabled={step === "otp"}
                onChange={(e) => setEmail(e.target.value)} sx={field}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ fontSize: 17, color: "#BDBDBD" }} /></InputAdornment> }}
              />
            </Box>

            {step === "register" && (
              <Box>
                <Typography sx={label}>Password</Typography>
                <TextField fullWidth placeholder="Minimum 8 characters"
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
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#BDBDBD", mr: -0.5 }}>
                          {showPassword ? <VisibilityOff sx={{ fontSize: 17 }} /> : <Visibility sx={{ fontSize: 17 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {step === "otp" && (
              <Box>
                <Typography sx={label}>One-time password</Typography>
                <TextField fullWidth placeholder="– – – – – –" size="small"
                  value={otp} onChange={(e) => setOtp(e.target.value)} sx={field}
                  inputProps={{ maxLength: 6, style: { letterSpacing: "0.5em", fontSize: "1.05rem", fontWeight: 600, textAlign: "center" } }}
                />
                {/* OTP resend option */}
                <Typography variant="caption" sx={{ color: "#9E9E9E", mt: 1, display: "block", textAlign: "right" }}>
                  Code nahi mila?{" "}
                  <Link component="button" underline="hover"
                    onClick={() => { setStep("register"); setOtp(""); setError(""); setSuccess(""); }}
                    sx={{ color: "#1A1A1A", fontWeight: 600, fontSize: "0.75rem", cursor: "pointer" }}>
                    Resend
                  </Link>
                </Typography>
              </Box>
            )}
          </Stack>

          <Button fullWidth variant="contained" disableElevation disabled={loading}
            onClick={step === "register" ? handleRegister : handleVerifyOtp}
            sx={{ mt: 4, py: 1.4, borderRadius: 2, backgroundColor: "#1A1A1A", color: "#fff",
              fontWeight: 600, fontSize: "0.875rem", textTransform: "none",
              "&:hover": { backgroundColor: "#333333" },
              "&.Mui-disabled": { backgroundColor: "#E0E0E0", color: "#9E9E9E" } }}
          >
            {loading
              ? <CircularProgress size={18} sx={{ color: "#fff" }} />
              : step === "register" ? "Continue →" : "Verify & create account"}
          </Button>

          <Divider sx={{ my: 3, borderColor: "#F0F0EC" }} />
          <Typography variant="body2" sx={{ textAlign: "center", color: "#9E9E9E", fontSize: "0.8rem" }}>
            Already have an account?{" "}
            <Link component="button" underline="hover" onClick={() => router.push("/loginPage")}
              sx={{ color: "#1A1A1A", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
              Sign in
            </Link>
          </Typography>
        </Paper>

        <Stack direction="row" justifyContent="center" spacing={0.75} sx={{ mt: 3 }}>
          {(["register", "otp"] as const).map((s) => (
            <Box key={s} sx={{ width: step === s ? 22 : 6, height: 6, borderRadius: "6px",
              backgroundColor: step === s ? "#1A1A1A" : "#D0D0CC", transition: "all 0.3s ease" }} />
          ))}
        </Stack>

      </Container>
    </Box>
  );
}