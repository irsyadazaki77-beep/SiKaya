import fs from 'fs';

['dist', 'server.js'].forEach((p) => {
  fs.rmSync(p, { recursive: true, force: true });
});
