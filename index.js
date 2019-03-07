const Koa = require("koa");
const { initializeServer } = require("kerberos");

const decodeToken = async token => {
  const server = await initializeServer("HTTP@hostname");

  await server.step(token);

  return server.username.split("@")[0];
};

const app = new Koa();

app.use(async (ctx, next) => {
  const authHeader = ctx.get("Authorization");

  if (!authHeader) {
    ctx.status = 401;
    ctx.set("WWW-Authenticate", "Negotiate");
    return;
  }

  const token = authHeader.replace("Negotiate ", "");
  const username = await decodeToken(token);

  ctx.body = username;
});

app.listen(3000);
