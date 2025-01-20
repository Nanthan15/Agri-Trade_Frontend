import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const Title = styled(Typography)({
  fontFamily: "'Roboto Slab', serif",
  color: "#2e7d32",
  textAlign: "center",
  fontWeight: "bold",
  marginBottom: 30,
});

const DummyGraph = styled(Box)({
  height: 300,
  marginBottom: 30,
  background: "linear-gradient(45deg, #6a1b9a, #ab47bc)",
  borderRadius: 8,
});

const StyledButton = styled(Button)({
  margin: "10px",
  background: "linear-gradient(45deg, #1e88e5, #42a5f5)",
  color: "#ffffff",
  fontWeight: "bold",
  "&:hover": {
    background: "linear-gradient(45deg, #1565c0, #1e88e5)",
  },
});

const PredictionBox = styled(Box)({
  marginTop: 30,
  padding: "20px",
  background: "#f5f5f5",
  textAlign: "center",
  borderRadius: 8,
  fontSize: "18px",
  fontWeight: "bold",
});

const InsightPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedValue, setSelectedValue] = useState({
    State: "Select State",
    District: "Select District",
    AMPC: "Select AMPC",
    Commodity: "Select Commodity",
    Date: "Select Date",
  });

  const handleClick = (event, key) => {
    setAnchorEl({ anchor: event.currentTarget, key });
  };

  const handleClose = (value) => {
    if (value) {
      setSelectedValue((prev) => ({
        ...prev,
        [anchorEl.key]: value,
      }));
    }
    setAnchorEl(null);
  };

  const dropdownOptions = {
    State: ["Karnataka", "Maharashtra", "Tamil Nadu", "Kerala"],
    District: ["Bangalore", "Mumbai", "Chennai", "Kochi"],
    AMPC: ["Market 1", "Market 2", "Market 3"],
    Commodity: ["Rice", "Wheat", "Maize", "Sugar"],
    Date: ["2025-01-20", "2025-01-21", "2025-01-22"],
  };

  return (
    <Container maxWidth="md">
      <Title variant="h4">Insight</Title>

      {/* Graph Section */}
      <Paper elevation={3}>
        <DummyGraph />
      </Paper>

      {/* Dropdown Buttons */}
      <Box display="flex" justifyContent="center" flexWrap="wrap" mt={3}>
        {Object.keys(dropdownOptions).map((key) => (
          <div key={key}>
            <StyledButton
              onClick={(event) => handleClick(event, key)}
            >
              {key}
              <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
            </StyledButton>
            <Menu
              anchorEl={anchorEl?.anchor}
              open={anchorEl?.key === key}
              onClose={() => handleClose()}
            >
              {dropdownOptions[key].map((option) => (
                <MenuItem
                  key={option}
                  onClick={() => handleClose(option)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
            <Typography
              variant="caption"
              display="block"
              align="center"
              mt={1}
            >
              {selectedValue[key]}
            </Typography>
          </div>
        ))}
      </Box>

      {/* Prediction Section */}
      <PredictionBox>
        PREDICT COST: <span style={{ color: "#1e88e5" }}>XXX</span>
      </PredictionBox>
    </Container>
  );
};

export default InsightPage;
