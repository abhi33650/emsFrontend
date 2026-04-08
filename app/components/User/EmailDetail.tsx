"use client";

import { ShowEmail } from "@/Interface/ShowEmail";
import { ReplyEmailPayload } from "@/Interface/ReplyEmail";
import { sendReplyEmail } from "@/Action/ReplyEmail";
import { useEffect, useState } from "react";
import { getReplyThreads } from "@/Action/ShowThreads";

import {
  Grid,
  Paper,
  Box,
  Typography,
  Stack,
  Avatar,
  Chip,
  Card,
  CardContent,
  Divider,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";

import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { getRemark, sendRemark } from "@/Action/SendRemakr";
import type { AttachmentInterface } from "@/Interface/Attachment";
import { getAttachmentDownload } from "@/Action/DownloadAttachmnet";


interface showEmailDetailsProps {
  selectedEmail: ShowEmail | null;
  getInitials: (email: string) => string;
  formatDate: (date: string) => string;
   getData: (threadId: string) => void;
   attachments: AttachmentInterface[];
}


const EmailDetail = ({
  selectedEmail,
  getInitials,
  formatDate,
  getData,
  attachments
}: showEmailDetailsProps) => {
  const [threads, setThreads] = useState<ShowEmail[]>([]);
  const [replyText, setReplyText] = useState("");
  const [remarkText, setRemarkText] = useState("");
  const [file , setFile] = useState<File | null>(null);
  const [remarkData , setRemarkData] = useState<{ [key: number]: Array<{ remark?: string; CreatedAt?: string }> }>({});
  const [attachmentLoading , setAttachmentLoading] = useState<Set<string>>(new Set());
  const extractEmail = (value: string) => {
    const match = value.match(/<(.+?)>/);
    return match ? match[1] : value;
  };
const emailId = Number(selectedEmail?.Id);
const remarks = remarkData[emailId] || [];
  // Fetch threads
useEffect(() => {
  if (!selectedEmail?.ThreadId) return;
  const getThreadData = async () => {
    const response = await getReplyThreads(selectedEmail.ThreadId!);
    if (response.success) {
      setThreads(response.data);
    }
  };
  getThreadData();
  const interval = setInterval(getThreadData, 5000);
  return () => clearInterval(interval);
}, [selectedEmail?.ThreadId]); 


const handelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); 
  }
};
  // SEND REPLY
    const handleSendReply = async () => {
    if (!selectedEmail || !replyText.trim()) return;

    const rawMessageId = selectedEmail.MessageId || selectedEmail.ThreadId;
    if (!rawMessageId) {
      console.error("MessageId missing");                              
      return;
    }

    const messageId = rawMessageId.startsWith("<")
      ? rawMessageId
      : `<${rawMessageId}>`;

    const payload: ReplyEmailPayload = {
      fromEmail: "abhishek33650@gmail.com",
      toEmail: extractEmail(selectedEmail.Fromemail), 
      subject: selectedEmail.Subject.startsWith("Re:")           
        ? selectedEmail.Subject : `Re: ${selectedEmail.Subject}`,
      body: replyText,
      inReplyTo: messageId,
      file: file || undefined,         
      emailId:selectedEmail.Id || ""
    };

    try {
      const response = await sendReplyEmail(payload);
      if (response?.success) {
        setReplyText("");
        setFile(null);
        if (selectedEmail?.ThreadId) {
        getData(selectedEmail.ThreadId); 
  }

        if (selectedEmail.ThreadId) {     
          const updatedThreads = await getReplyThreads(selectedEmail.ThreadId);
          if (updatedThreads.success) setThreads(updatedThreads.data);
        }
                              
      } else {
        console.error("Reply failed:", response); 
      }
    } catch (error) {
      console.error("Reply send error:", error);
    }               
  };
                                                                                                                        
  // const handleSendReply = async () => {
  //   if (!selectedEmail || !replyText.trim()) return;

  //   const rawMessageId = selectedEmail.MessageId || selectedEmail.ThreadId;
  //   if (!rawMessageId) {
  //     console.error("MessageId missing");
  //     return;
  //   }

  //   const messageId = rawMessageId.startsWith("<")
  //     ? rawMessageId
  //     : `<${rawMessageId}>`;

  //   const payload: ReplyEmailPayload = {
  //     fromEmail: "abhishek33650@gmail.com",
  //     toEmail: extractEmail(selectedEmail.Fromemail), 
  //     subject: selectedEmail.Subject.startsWith("Re:")
  //       ? selectedEmail.Subject
  //       : `Re: ${selectedEmail.Subject}`,
  //     body: replyText,
  //     inReplyTo: messageId,
  //   };

  //   try {
  //     const response = await sendReplyEmail(payload);
  //     if (response?.success) {
  //       setReplyText("");
  //       if (selectedEmail?.ThreadId) {
  //   getData(selectedEmail.ThreadId); 
  // }

  //       if (selectedEmail.ThreadId) {
  //         const updatedThreads = await getReplyThreads(selectedEmail.ThreadId);
  //         if (updatedThreads.success) setThreads(updatedThreads.data);
  //       }
   
  //     } else {
  //       console.error("Reply failed:", response); 
  //     }
  //   } catch (error) {
  //     console.error("Reply send error:", error);
  //   }               
  // };                        

const fetchRemark = async () => {
  if (!selectedEmail?.Id) return;

  try {
    const res = await getRemark({ emailId: Number(selectedEmail.Id) });

    if (res?.success) {
      setRemarkData({
        [Number(selectedEmail.Id)]: res.data,
      });
    }
  } catch (e) {
    console.error("Error fetching remark:", e);
  }
};

useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchRemark();     
}, [selectedEmail]);


  // send Remark 
const handleSendRemark = async () => {
  if (!selectedEmail || !remarkText.trim()) return;

  try {
    const payload = {
      emailId: Number(selectedEmail.Id), 
      remark: remarkText.trim(),
    };
    const response = await sendRemark(payload);
    if (response?.status === "success") {      
      setRemarkText("");                      
     await fetchRemark();
      if (selectedEmail?.ThreadId) {
        getData(selectedEmail.ThreadId);
      }
     
    } else {
      console.error("Remark failed:", response);
    }

  } catch (error) {
    console.error("Remark send error:", error);
  }
};


// const handleDownload = async (e: React.MouseEvent, id: number, fileName: string) => {
//   e.stopPropagation();
//   try {
//     const result = await getAttachmentDownload(id);
//     if (!result) return console.error("No token or URL");

//     const res = await fetch(result.url, {
//       method: "POST",                                    
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${result.token}`,
//       },
//       body: JSON.stringify({ id }),                           
//     });

//     if (!res.ok) throw new Error("Download failed");

//     const blob = await res.blob();
//     const blobUrl = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = blobUrl;
//     link.download = fileName;
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(blobUrl);
//   } catch (error) {
//     console.error("Download error:", error);
//   }
// };


const handleDownload = async (messageId: string, fileName: string) => {
  try {
     setAttachmentLoading(prev => new Set(prev).add(fileName));
    const res = await fetch(
      `http://localhost:4000/api/showattachment/downloadFromGmail`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          fileName,
        }),
      }
    );
     
   console.log(
    {
       body: JSON.stringify({
          messageId,
          fileName,
        }),
    }
   );
   
    if (!res.ok) throw new Error("Download failed");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
   
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download error:", err);
  }finally{
    setAttachmentLoading(prev =>{
      const next = new Set(prev);
      next.delete(fileName);
      return next;
    })
  }
};

const validAttachments = attachments?.filter(
  (file) => file && file.FileName 
);  
const validRemarks = remarks?.filter(
  (item) => item && item.remark && item.remark.trim() !== ""
);
  return (
    <Grid size={{ xs: 12, md: 8 }}>
      <Paper
        elevation={0}
        sx={{
          height: "calc(100vh - 200px)",
          overflow: "auto",
          borderRadius: 3,
          border: "1px solid #e3e8ef",
        }}
      >
        {selectedEmail ? (
          <Box>
            {/* SUBJECT */}
            <Box
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <Typography variant="h4" fontWeight="700" sx={{ color: "#fff" }}>
                {selectedEmail.Subject || "No Subject"}
              </Typography>
            </Box>
 
            {/* SENDER */}
            <Box sx={{ p: 3 }}>
              <Stack direction="row" spacing={2}>
                <Avatar sx={{ bgcolor: "#667eea", width: 56, height: 56 }}>
                  {getInitials(selectedEmail.Fromemail)}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between">
                    <Box>
                      <Typography fontWeight="700">
                        {selectedEmail.Fromemail}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        to: me
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <ScheduleIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        {selectedEmail.DaysAgo} days ago
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip
                      icon={<CalendarIcon />}
                      label={formatDate(selectedEmail.RecivedDate)}
                      size="small"
                      sx={{
                        backgroundColor: "#ede9fe",
                        color: "#7c3aed",
                        fontWeight: "600",
                        border: "none",
                        "& .MuiChip-icon": { color: "#7c3aed" },
                      }}
                    />

                    <Chip
                      icon={<BadgeIcon />}
                      label={`Reg: ${selectedEmail.RegNo}`}
                      size="small"
                      sx={{
                        backgroundColor: "#d1fae5",
                        color: "#059669",
                        fontWeight: "600",
                        border: "none",
                        "& .MuiChip-icon": { color: "#059669" },
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ mx: 3 }} />

            {/* BODY */}
          

            {/* THREAD - WhatsApp Style */}
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f0f4f8",
                borderRadius: 3,
                mx: 3,
                mb: 2,
                minHeight: 300,
                maxHeight: 450,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, px: 1 }}>
                Conversation
              </Typography>

              {threads
                .sort((a, b) => Number(a.Id) - Number(b.Id)) 
                .map((thread) => {
                 
                  const isMe =
                    thread.Fromemail === "abhishek33650@gmail.com" ||
                    thread.Fromemail.toLowerCase().includes("abhishek33650") ||
                    thread.Fromemail === "Support Team";

                  const cleanBody = thread.Body.split("\nOn ")[0].trim();

                  return (
                    <Box
                      key={thread.Id}
                      sx={{
                        display: "flex",
                        justifyContent: isMe ? "flex-end" : "flex-start",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
    
                      {!isMe && (
                        <Avatar
                          sx={{ bgcolor: "#059669", width: 32, height: 32 }}
                        >
                          {getInitials(thread.Fromemail)}
                        </Avatar>
                      )}

                      <Box
                        sx={{
                          maxWidth: "65%",
                          backgroundColor: isMe ? "#667eea" : "#ffffff",
                          color: isMe ? "#fff" : "#1a1a1a",
                          px: 2,
                          py: 1,
                          borderRadius: isMe
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                        }}
                      >
                        {/* Sender name — sirf opposite side ke liye */}
                        {!isMe && (
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 700,
                              color: "#059669",
                              display: "block",
                              mb: 0.3,
                            }}
                          >
                            {extractEmail(thread.Fromemail).split("@")[0]}{" "}
                            {/* ✅ Clean name */}
                          </Typography>
                        )}
        
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {cleanBody}
                        </Typography>
                         

  
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: "right",
                            mt: 0.5,
                            opacity: 0.7,
                            fontSize: "0.65rem",
                          }}
                        >
                          {formatDate(thread.RecivedDate)}
                        </Typography>
                      </Box>

                      {/*  avatar — right */}
                      {isMe && (
                        <Avatar
                          sx={{ bgcolor: "#667eea", width: 32, height: 32 }}
                        >
                          AB
                        </Avatar>

                        
                      )}
                      
                    </Box>
                  );
                })}
            </Box>
<Box sx={{ px: 3, pb: 2 }}>
  <Typography variant="h6" sx={{ mb: 2 }}>
    Attachments
  </Typography>
{/* 
  {validAttachments.length > 0 ? ( 
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {validAttachments.map((file) => {
       const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${encodeURI(file.FilePath)}`;
       const fileName = file?.FileName ?? "";
       const isImage = /\.(jpg|jpeg|png)$/i.test(fileName);
       const isPdf = /\.pdf$/i.test(fileName);
        return (
          <Card
            key={file.id}
            sx={{
              width: 160,
              borderRadius: 3,
              cursor: "pointer",
              "&:hover": { boxShadow: 5 },
            }}
            onClick={() => window.open(fileUrl)}
          >
            <CardContent>
              {isImage ? (
                <img
                  src={fileUrl}
                  style={{
                    width: "100%",
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: 90,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f1f5f9",
                    borderRadius: 2,
                    fontSize: 32,
                  }}
                >
                  {isPdf ? "📄" : "📎"}                                         
                </Box>
              )}

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {file.FileName}
              </Typography>

            <Button
  size="small"
  sx={{ mt: 1 }}
  onClick={(e) => handleDownload(e, Number(selectedEmail?.Id), file.FileName)}  // ✅ emailId
>
  Download
</Button>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  ) : (
    <Typography variant="body2" color="text.secondary">
      No Attachments
    </Typography>
  )} */}
  {validAttachments.length > 0 ? (
  <Stack direction="row" spacing={2} flexWrap="wrap">
    {validAttachments.map((file, index) => {
      const fileName = file?.FileName ?? "";
      const isImage = /\.(jpg|jpeg|png)$/i.test(fileName);
      const isPdf = /\.pdf$/i.test(fileName);

      return (
        <Card
          key={`${fileName}-${index}`}
          sx={{
            width: 160,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Box
              sx={{
                height: 90,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#f1f5f9",
                borderRadius: 2,
                fontSize: 32,
              }}
            >
              {isImage ? "🖼️" : isPdf ? "📄" : "📎"}
            </Box>       

            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {fileName}
            </Typography>
             <Stack direction="row" justifyContent="center" alignItems="center">
            <Button size="small" sx={{ mt: 1 }} disabled={attachmentLoading.has(fileName)}
             onClick={() =>handleDownload(file.MessageId, file.FileName)}>
  {attachmentLoading.has(fileName) ?(
 <> 
  <CircularProgress size="30px"  /> 
    </>
  ):(<> Download</>)}
</Button>
</Stack>
          </CardContent>
        </Card>
      );
    })}
  </Stack>
) : (
  <Typography variant="body2" color="text.secondary">
    No Attachments
  </Typography>
)}
</Box>
            
            {/* REPLY BOX */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Reply
              </Typography>

              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      multiline
                      minRows={4}
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      fullWidth
                    />

                    <Box sx={{ display: "flex", justifyContent: "flex-end"  , gap:2}}>
                      <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleSendReply}
                      >
                        Send Reply
                      </Button>
                         <Button variant="contained" component="label">
  Attachment
  <input
    type="file"
    hidden
    onChange={handelFileChange}
  />
</Button>
{file && (
  <Typography variant="body2" sx={{ mt: 1 }}>
    File: {file.name}
  </Typography>
)}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

<Box sx={{ p: 3 }}>
  {/* Title */}
  <Typography variant="h6" sx={{ mb: 2 }}>
    Remarks
  </Typography>

  {/* Remarks List */}
  <Box
    sx={{
      mb: 3,
      maxHeight: 250,
      overflowY: "auto",
      border: "1px solid #eee",
      borderRadius: 2,
      p: 2,
      background: "#fafafa",
    }}
  >
    {validRemarks.length > 0 ? (
      validRemarks.map((item, index) => (
        <Box
          key={index}
          sx={{
            mb: 1.5,
            p: 1.5,
            borderRadius: 2,
            background: "#fff",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {item.remark}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {item.CreatedAt}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="text.secondary">
        No Remark
      </Typography>
    )}
  </Box>

  {/* Add Remark */}
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Stack spacing={2}>
        <TextField
          multiline
          minRows={4}
          placeholder="Write your remark..."
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
          fullWidth
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSendRemark}
          >
            Remark
          </Button>
        </Box>
      </Stack>
    </CardContent>
  </Card>
</Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
            }}
          >
            <EmailIcon sx={{ fontSize: 60 }} />

            <Typography variant="h6">Select an email to view</Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default EmailDetail;
