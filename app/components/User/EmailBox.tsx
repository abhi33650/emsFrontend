"use client";

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
import { User_getAssignedEmails } from "@/Action/UserGetassignEmail";
import { getReplyThreads } from "@/Action/ShowThreads";
import { UpdateReadStatus } from "@/Action/UpdateStatus";
import type { AttachmentInterface } from "@/Interface/Attachment";
import { getAttchmentData } from "@/Action/GetAttachment";

export default function EmailBox() {
  const [getEmail, setgetEmail] = useState<ShowEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<ShowEmail | null>(null);
  const [loading, setLoading] = useState(false); 
  const [mounted, setMounted] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [getThread , setThreads ] = useState <ShowEmail[]>([])
  const [getAttachment , setAttachment] = useState<AttachmentInterface[]>([]) 

const getData = async () => {
  try {
    setLoading(true);
    const response = await User_getAssignedEmails();

    if (response.status === "success") {
      setgetEmail(response.data);

      if (response.data.length > 0) {
        setSelectedEmail(response.data[0]);
      }
    }
  } catch (err) {
    setError("Failed to fetch emails");
    console.error(err);
  } finally {
    setLoading(false);
  }
};
const attachmnetData = async (threadid: string) => {
  try {
    const response = await getAttchmentData(threadid);
    if (response?.success) {
      setAttachment(response.data);
      return response.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching attachments:", error);
    return [];
  }
};

useEffect(() => {
  const threadId = selectedEmail?.ThreadId;
  if (!threadId) return;

  attachmnetData(threadId);

  const interval = setInterval(() => {
    attachmnetData(threadId);
  }, 5000);

  return () => clearInterval(interval);
}, [selectedEmail?.ThreadId]);


useEffect(() => {
  setMounted(true);
  getData();
}, []);
const moveEmailToTop = (threadId: string) => {
  setgetEmail((prevEmails) => {
    const email = prevEmails.find((e) => e.ThreadId === threadId);
    const updated = prevEmails.filter((e) => e.ThreadId !== threadId);
    return email ? [email, ...updated] : prevEmails;
  });
};
useEffect(() => {
  const getThreadData = async () => {
    if (!selectedEmail?.ThreadId) return;

    try {
      const response = await getReplyThreads(selectedEmail.ThreadId);

      if (response.success) {
        setThreads(response.data);
      }

    } catch (error) {
      console.error(error);
    }
  };

  getThreadData();
}, [selectedEmail]);

const handleToggleRead = async (id: number, isRead: number) => {
  const newStatus = isRead === 1 ? 0 : 1;

  await UpdateReadStatus(id, newStatus);

  setgetEmail(prev =>
    prev.map(e =>
      e.Id === id ? { ...e, isRead: newStatus === 1 } : e // ✅ FIX
    )
  );

  setSelectedEmail(prev =>
    prev?.Id === id ? { ...prev, isRead: newStatus === 1 } : prev // ✅ FIX
  );
};

const readCount = getEmail.filter(e => e.isRead === true).length;
const unreadCount = getEmail.filter(e => e.isRead === false).length;
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
  Total: {getEmail.length} | 
  Read: {readCount} | 
  Pending: {unreadCount}
</Typography>
            </Box>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          {/* Email List */}
            <EmailList selectedEmail={selectedEmail} getInitials={getInitials} formatDate={formatDate} getEmail={getEmail}   setSelectedEmail={setSelectedEmail} onToggleRead={handleToggleRead }/>

          {/* Email Detail View */}
          <EmailDetail selectedEmail={selectedEmail} getInitials={getInitials} formatDate={formatDate}   getData={moveEmailToTop}  attachments={getAttachment}/>
        </Grid>
      </Container>
    </Box>
  );
}
