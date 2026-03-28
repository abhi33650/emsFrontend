"use client";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { Card, CardContent, CardHeader } from "@mui/material";

interface CardContainerProps {
  children: React.ReactNode;
  minHeight?: string;
  colour?: string;
  elevation?: number;
  minElevation?: number;
  maxElevation?: number;
  title?: string;
  icon?: React.ReactNode;
  subheader?: string;
  padding?: string;
  margin?: string;
  isCardShadow?: boolean; // ✅ added as prop
}

const CardContainer: React.FC<CardContainerProps> = ({
  children,
  minHeight,
  colour,
  elevation = 10,
  minElevation,
  maxElevation,
  title,
  icon,
  subheader,
  padding,
  margin,
  isCardShadow = true, // ✅ default to true
}) => {
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  const [hover, setHover] = React.useState(false);

  return (
    <div style={{ padding: padding ? padding : "0px" }}>
      <Card
        sx={{
          p: 0,
          border: `1px solid ${borderColor}`,
          position: "relative",
          minHeight: minHeight,
          backgroundColor: `${colour}`,
        }}
        elevation={
          minElevation && maxElevation
            ? hover
              ? maxElevation
              : minElevation
            : elevation
        }
        variant={!isCardShadow ? "outlined" : undefined} // ✅ fixed
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {title && (
          <CardHeader
            title={title}
            avatar={icon}
            subheader={subheader}
            sx={{
              "& .MuiCardHeader-title": {
                textTransform: "none",
                fontWeight: "bold",
              },
            }}
          />
        )}
        <CardContent sx={{ margin: margin ? margin : "0px" }}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default CardContainer;