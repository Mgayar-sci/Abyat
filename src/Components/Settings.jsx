import { Box, Button, TextField } from "@material-ui/core";
import React, { useState } from "react";

export function SettingsFields({ fields = {}, handleChange }) {
  return (
    <Box>
      {Object.entries(fields).map(([name, value], index) => (
        <TextField
          id="outlined-basic-size-small"
          style={{ margin: 5, marginTop: 10, maxWidth: 75 }}
          placeholder={name}
          type="number"
          variant="outlined"
          value={value}
          onChange={handleChange}
          margin="dense"
          autoFocus={index===0}
          label={name}
          key={name}
          name={name}
        />
      ))}
    </Box>
  );
}

export default function Settings({settings, updateSettings}) {
  const [fields, setFields] = useState(settings);

  const handleChange = (event) => {
    let value = parseInt(event.target.value);
    const key = event.target.name;
    if(key === "Days")
        value = value > 7? 7: value<1?1:value;
    setFields({ ...fields, [key]: value });
  };
  return (
    <Box display="flex">
      <SettingsFields fields={fields} handleChange={handleChange} />
      <Button color="primary" onClick={e=>updateSettings(fields)}>Save</Button>
    </Box>
  );
}
