"use client";

import { getEmailData } from "@/Action/ShowEmail";
import { ShowEmail } from "@/Interface/ShowEmail";
import { useEffect, useState } from "react";
import {Box,Typography,CircularProgress,Alert,Container,Paper,Grid,Stack,} from "@mui/material";
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Inbox as InboxIcon,
} from "@mui/icons-material";
import EmailList from "./EmailList";
import EmailDetail from "./EmailDetail";

export default function EmailBox() {
  const [getEmail, setgetEmail] = useState<ShowEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<ShowEmail | null>(null);
  const [loading, setLoading] = useState(false); 
  const [mounted, setMounted] = useState(false); 
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  setMounted(true);
  let isMounted = true;

  const getData = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const response = await getEmailData();

      console.log("Fetching at:", new Date().toLocaleTimeString());

      if (isMounted && response.status === "success") {
        setgetEmail(response.data);

        if (response.data.length > 0) {
          setSelectedEmail(response.data[0]);
        }
      }
    } catch (err) {
      if (isMounted) {
        setError("Failed to fetch emails");
        console.error(err);
      }
    } finally {
      if (showLoader && isMounted) {
        setLoading(false);
      }
    }
  };

  getData(true);
  const interval = setInterval(() => {
    console.log("Running interval...");
    getData(false);
  }, 5000);

  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);

  

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getInitials = (email: string) => {
    const name = email.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };

  if (!mounted) {
    return (
      <Box display="flex"justifyContent="center"alignItems="center" minHeight="100vh"sx={{ backgroundColor: "#f5f5f5" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex"justifyContent="center"alignItems="center" minHeight="100vh" sx={{ backgroundColor: "#f5f5f5" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }              
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
      <br />
        {/* Header */}
        <Paper elevation={0}
          sx={{ p: 3, mb: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white",borderRadius: 2,}}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <InboxIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">Email Inbox</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {getEmail.length} {getEmail.length === 1 ? "email" : "emails"}{" "}
                in your inbox
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          {/* Email List */}
            <EmailList selectedEmail={selectedEmail} getInitials={getInitials} formatDate={formatDate} getEmail={getEmail}   setSelectedEmail={setSelectedEmail}/>

          {/* Email Detail View */}
          <EmailDetail selectedEmail={selectedEmail} getInitials={getInitials} formatDate={formatDate} />
        </Grid>
      </Container>
    </Box>
  );
}
