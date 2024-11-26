// ref. https://developers.cloudflare.com/pages/functions/middleware/
// ref. https://developers.cloudflare.com/pages/functions/api-reference/#eventcontext
type EventContext = {
  request: Request;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: {
    ASSETS: object;
    CF_PAGES: string;
    CF_PAGES_BRANCH: string;
    CF_PAGES_COMMIT_SHA: string;
    CF_PAGES_URL: string;
    [key: string]: any;
  };
};

type Middleware = (context: EventContext) => Promise<Response>;

type Middlewares = Middleware | Middleware[];

const errorHandler: Middleware = async ({
  next,
}: EventContext): Promise<Response> => {
  try {
    return await next();
  } catch (err: unknown) {
    console.log(`Error: ${err.message}\n${err.stack}`);
    return new Response("Internal Server Error. Please contact the admin", {
      status: 500,
    });
  }
};

const passEnvPrefix = "PASSWORD_";

const basicAuth: Middleware = async ({
  request,
  next,
  env,
}: EventContext): Promise<Response> => {
  if (!request.headers.has("Authorization")) {
    return new Response("You need to login.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Input username and password"',
      },
    });
  }
  const authorizationHeader = request.headers.get("Authorization");
  if (!authorizationHeader) {
    return new Response("Authorization header is missing.", {
      status: 400,
    });
  }

  const [scheme, encoded] = authorizationHeader.split(" ");
  if (!encoded || scheme !== "Basic") {
    return new Response("Malformed authorization header.", {
      status: 400,
    });
  }

  const buffer = Uint8Array.from(atob(encoded), (character) =>
    character.charCodeAt(0)
  );
  const decoded = new TextDecoder().decode(buffer).normalize();
  const index = decoded.indexOf(":");

  if (index === -1 || /[\0-\x1F\x7F]/.test(decoded)) {
    return new Response("Invalid authorization value.", {
      status: 400,
    });
  }

  const username = decoded.substring(0, index);
  const password = decoded.substring(index + 1);
  if (password === "") {
    return new Response("Password is empty.", {
      status: 401,
    });
  }

  const key = passEnvPrefix + username.toUpperCase();
  const storedPassword = env[key];
  const userExists = typeof storedPassword === "string";
  // Even if the user does not exist, a constant time comparison with a dummy string is performed
  // to prevent timing attacks.
  const matchPassword = await compareStrings(
    password,
    userExists ? storedPassword : "dummy"
  );
  if (!userExists || !matchPassword) {
    return new Response("Invalid username or password.", {
      status: 401,
    });
  }

  return await next();
};

async function sha256(str: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest("SHA-256", data);
}

async function compareStrings(a: string, b: string): Promise<boolean> {
  const hashA = await sha256(a);
  const hashB = await sha256(b);

  // The buffer lengths must be the same, and they were aligned to the same length by hashing,
  // but we are checking to be sure because timeSafeEqual will throw an exception if the lengths
  // are different.
  // ref. https://developers.cloudflare.com/workers/examples/protect-against-timing-attacks/
  if (hashA.byteLength !== hashB.byteLength) {
    return false;
  }
  return crypto.subtle.timingSafeEqual(hashA, hashB);
}

export const onRequest: Middlewares = [errorHandler, basicAuth];
