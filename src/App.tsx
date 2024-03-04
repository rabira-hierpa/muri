import { useEffect, useState } from "react";
import "./App.css";
import {
  Autocomplete,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { populationMap } from "./utils/helpers";
import usePopulationPrediction from "./hooks/usePopulationPrediction";

function App() {
  const countries = [
    {
      label: "Afghanistan",
      value: "AF",
    },
    {
      label: "Aland Islands",
      value: "AX",
    },
    {
      label: "Albania",
      value: "AL",
    },
  ];

  const [selectedCountry, setSelectedCountry] = useState<{ value: string }>({
    value: "",
  });

  const countryKey = selectedCountry.value as keyof typeof populationMap;
  const [calculationRunning, populationPrediction] = usePopulationPrediction(
    populationMap[countryKey]?.population ?? 0,
    populationMap[countryKey]?.growthRate ?? 0,
    populationMap[countryKey]?.years ?? 0
  );

  return (
    <div className="App">
      <Autocomplete
        id="countries"
        options={countries}
        value={
          countries.find(
            (country) => country.value === selectedCountry?.value
          ) ?? null
        }
        onChange={(event, newValue) => {
          setSelectedCountry(newValue ?? { value: "" });
        }}
        getOptionLabel={(option) => option.label}
        style={{ width: 300 }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              "& .MuiAutocomplete-input": {
                height: "1em",
              },
            }}
            label="Countries"
            variant="outlined"
          />
        )}
        renderOption={(props, option) => (
          <Box
            {...props}
            component="li"
            sx={{
              padding: "8px",
              cursor: "pointer",
              ":hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <Typography variant="body1" mr={1}>
              {option.label}
            </Typography>
          </Box>
        )}
      />
      {(() => {
        if (calculationRunning) {
          return <CircularProgress />;
        }
        if (populationPrediction.length > 0) {
          return (
            <div>
              <Typography variant="h6">
                Population Prediction for{" "}
                {populationMap[countryKey]?.years ?? 0} years
              </Typography>
              <div>
                {populationPrediction.map((population, index) => (
                  <div key={population}>{`Year ${
                    index + 1
                  }: ${population}`}</div>
                ))}
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
}

export default App;
