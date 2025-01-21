import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import NavBar from "../components/compo/nav";

const InsightPage = () => {
  const [loading, setLoading] = useState(false);
  const [dropdownOptions, setDropdownOptions] = useState({
    states: [],
    districts: [],
    markets: [],
    commodities: [],
  });
  const [selectedValue, setSelectedValue] = useState({
    state: "",
    district: "",
    market: "",
    commodity: "",
    month: null,
  });
  const [graphData, setGraphData] = useState(null);
  const [priceData, setPriceData] = useState(null);

  // Fetch dropdown options dynamically
  useEffect(() => {
    const fetchDropdownData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://127.0.0.1:5000/fetch_data");
        setDropdownOptions(response.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  const fetchGraph = async () => {
    const { commodity, month } = selectedValue;
    try {
      const response = await axios.get("http://127.0.0.1:5000/generate_graph", {
        params: { commodity, month },
        responseType: "arraybuffer",
      });
      const graphImage = `data:image/png;base64,${btoa(
        String.fromCharCode(...new Uint8Array(response.data))
      )}`;
      setGraphData(graphImage);
    } catch (error) {
      console.error("Error fetching graph:", error);
    }
  };

  const fetchPrice = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/recommend_price", {
        state: selectedValue.state,
        district: selectedValue.district,
        market: selectedValue.market,
        commodity: selectedValue.commodity,
        month: selectedValue.month,
      });
      setPriceData(response.data);
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  };

  const handleSubmit = () => {
    const { commodity, month, state, district, market } = selectedValue;

    if (commodity && month) {
      fetchGraph();
    }

    if (state && district && market && commodity && month) {
      fetchPrice();
    }
  };

  const renderDropdown = (label, key, options) => (
    <Box mb={2} width="100%">
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option}
        renderInput={(params) => <TextField {...params} label={label} variant="outlined" />}
        onChange={(event, newValue) =>
          setSelectedValue((prev) => ({ ...prev, [key]: newValue || "" }))
        }
        value={selectedValue[key] || ""}
        loading={loading}
        loadingText="Loading options..."
        ListboxProps={{ style: { maxHeight: 200, overflow: "auto" } }} // Makes it scrollable
      />
    </Box>
  );

  return (
    <>
    <NavBar></NavBar>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Insight
        </Typography>

        {/* Graph Section */}
        <Paper
          elevation={3}
          style={{ height: 400, display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          {graphData ? (
            <img
              src={graphData}
              alt="Graph"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <Typography variant="body1">
              Select options and submit to generate the graph.
            </Typography>
          )}
        </Paper>

        {/* Dropdowns */}
        <Box mt={3}>
          {renderDropdown("State", "state", dropdownOptions.states)}
          {renderDropdown("District", "district", dropdownOptions.districts)}
          {renderDropdown("Market", "market", dropdownOptions.markets)}
          {renderDropdown("Commodity", "commodity", dropdownOptions.commodities)}
          {renderDropdown("Month", "month", Array.from({ length: 12 }, (_, i) => i + 1))}
        </Box>

        {/* Submit Button */}
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Submit
          </Button>
        </Box>

        {/* Prediction Section */}
        {priceData && (
          <Box mt={3} p={2} border={1} borderColor="grey.400" borderRadius={4}>
            <Typography variant="h6" align="center">
              Price Prediction
            </Typography>
            <Typography variant="body1">Max Price: {priceData.max_price}</Typography>
            <Typography variant="body1">Min Price: {priceData.min_price}</Typography>
            <Typography variant="body1">
              Predicted Price: {priceData.predicted_price.toFixed(2)}
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default InsightPage;
