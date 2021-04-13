const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

//register
app.use("/api/students", require("./routes/api/students"));
app.use("/api/scholars", require("./routes/api/scholars"));

// login
app.use("/api/studentlogin", require("./routes/api/studentlogin"));
app.use("/api/scholarlogin", require("./routes/api/scholarlogin"));

// profiles
app.use("/api/studentprofile", require("./routes/api/studentprofile"));
app.use("/api/scholarprofile", require("./routes/api/scholarprofile"));

// Serve static assets in production
// if (process.env.NODE_ENV === "production") {
//   // Set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
