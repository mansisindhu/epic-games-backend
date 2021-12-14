const app = require("./index");

const PORT = process.env.PORT || 2930;

app.listen(PORT, async () => {
  console.log("listening to port", PORT);
});
