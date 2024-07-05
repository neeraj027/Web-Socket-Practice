import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [msg, setMsg] = useState("");
  const [room, setRoom] = useState("");
  const [msgs, setMsgs] = useState([]);

  const handelSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { msg, room });
    setMsg("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
    socket.on("welcome", (e) => {
      console.log(e);
    });

    socket.on("receive-msg", (data) => {
      setMsgs((msgs) => [...msgs, data]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <Container maxWidth={"sm"}>
      <Box height={100} />
      <Typography>Welcome To socket.io</Typography>
      <form onSubmit={handelSubmit}>
        <TextField
          onChange={(e) => {
            setMsg(e.target.value);
          }}
          value={msg}
          variant="outlined"
          label="Message"
        />
        <TextField
          onChange={(e) => setRoom(e.target.value)}
          label={"Room"}
          variant="outlined"
          value={room}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack paddingTop={2}>
        {msgs.map((item, index) => {
          return <Typography key={index}>{item}</Typography>;
        })}
      </Stack>
    </Container>
  );
};

export default App;
