"use client";

import { ShowEmail } from "@/Interface/ShowEmail";
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
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Reply as ReplyIcon,
  ReplyAll as ReplyAllIcon,
  Forward as ForwardIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon
} from "@mui/icons-material";

interface showEmailDetailsProps {
  selectedEmail: ShowEmail | null;
  getInitials: (email: string) => string;
  formatDate: (date: string) => string;
}

const EmailDetail = ({ selectedEmail, getInitials, formatDate }: showEmailDetailsProps) => {
  return (
    <Grid size={{ xs: 12, md: 8 }}>
      <Paper 
        elevation={0}
        sx={{
          height: "calc(100vh - 200px)",
          overflow: "auto",
          borderRadius: 3,
          border: "1px solid #e3e8ef",
          background: "#ffffff",
        }}
      >
        {selectedEmail ? (
          <Box sx={{ height: "100%" }}>
            {/* Email Header Section */}
            <Box 
              sx={{ 
                p: 3, 
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px 12px 0 0",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  opacity: 0.4,
                }
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                fontWeight="700" 
                sx={{ 
                  mb: 0,
                  color: "#ffffff",
                  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  position: "relative",
                  zIndex: 1
                }}
              >
                {selectedEmail.Subject || "No Subject"}
              </Typography>
            </Box>

            {/* Action Bar */}
            {/* <Box 
              sx={{ 
                px: 3, 
                py: 2, 
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e3e8ef",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Stack direction="row" spacing={1}>
                <Tooltip title="Reply">
                  <IconButton size="small" sx={{ color: "#667eea" }}>
                    <ReplyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reply All">
                  <IconButton size="small" sx={{ color: "#667eea" }}>
                    <ReplyAllIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Forward">
                  <IconButton size="small" sx={{ color: "#667eea" }}>
                    <ForwardIcon />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Tooltip title="Star">
                  <IconButton size="small" sx={{ color: "#94a3b8" }}>
                    <StarBorderIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="More">
                  <IconButton size="small" sx={{ color: "#94a3b8" }}>
                    <MoreVertIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box> */}

            {/* Sender Information */}
            <Box sx={{ p: 3 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar 
                  sx={{ 
                    bgcolor: "#667eea",
                    width: 56,
                    height: 56,
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
                  }}
                >
                  {getInitials(selectedEmail.Fromemail)}
                </Avatar>
                
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="700"
                        sx={{ color: "#1e293b", mb: 0.5 }}
                      >
                        {selectedEmail.Fromemail}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: "#64748b", mb: 1 }}
                      >
                        to: me
                      </Typography>
                    </Box>
                    
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ScheduleIcon sx={{ fontSize: 16, color: "#94a3b8" }} />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: "#64748b",
                          fontWeight: "500"
                        }}
                      >
                        {selectedEmail.DaysAgo} days ago
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack 
                    direction="row" 
                    spacing={1} 
                    flexWrap="wrap" 
                    sx={{ gap: 1, mt: 2 }}
                  >
                    <Chip 
                      icon={<CalendarIcon sx={{ fontSize: 16 }} />} 
                      label={formatDate(selectedEmail.RecivedDate)} 
                      size="small"
                      sx={{
                        backgroundColor: "#ede9fe",
                        color: "#7c3aed",
                        fontWeight: "600",
                        border: "none",
                        "& .MuiChip-icon": {
                          color: "#7c3aed"
                        }
                      }}
                    />
                    <Chip 
                      icon={<BadgeIcon sx={{ fontSize: 16 }} />} 
                      label={`Reg: ${selectedEmail.RegNo}`} 
                      size="small"
                      sx={{
                        backgroundColor: "#d1fae5",
                        color: "#059669",
                        fontWeight: "600",
                        border: "none",
                        "& .MuiChip-icon": {
                          color: "#059669"
                        }
                      }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ mx: 3 }} />

            {/* Email Body */}
            <Box sx={{ p: 3 }}>
              <Card 
                variant="outlined" 
                sx={{ 
                  backgroundColor: "#fafbfc",
                  border: "1px solid #e3e8ef",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography 
                    variant="body1" 
                    sx={{
                      whiteSpace: "pre-wrap", 
                      wordBreak: "break-word", 
                      lineHeight: 1.8, 
                      color: "#334155",
                      fontSize: "1rem",
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
                    }}
                  >
                    {selectedEmail.Body || "No content"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)"
              }}
            >
              <EmailIcon sx={{ fontSize: 60, color: "#ffffff" }} />
            </Box>
            <Typography 
              variant="h5" 
              fontWeight="600"
              sx={{ color: "#475569", mb: 1 }}
            >
              Select an email to view
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ color: "#94a3b8" }}
            >
              Choose a message from the inbox to read
            </Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default EmailDetail;