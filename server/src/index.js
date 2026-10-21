// server/src/index.js
//
// Process startup only. The app itself is built in app.js.

import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Inkwell API listening on port ${PORT}`);
});
