  import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
  import { SSEServerTransport} from "@modelcontextprotocol/sdk/server/sse.js";
  import express from "express";
  import bodyParser from "body-parser";
  import axios from "axios";
  import { z } from "zod";
  import pkg from "pg";
  const { Pool } = pkg;

  const pool = new Pool({
    user: "admin",
    host: "localhost",
    database: "mcp",
    password: "2345", 
    port: 5433,
  });

  const server = new McpServer({
    name: "demo-server",
    version: "1.0.0",
  });
  //kullanıcı ekleme
  server.registerTool(
  "createUserViaApi",
  {
    title: "Create User via API",
    description: "Katmanlı API üzerinden yeni kullanıcı oluşturur",
    inputSchema: {
      name: z.string(),
      email: z.string(),
    },
  },
  async ({ name, email }) => {
    try {
      const response = await axios.post("http://localhost:3000/users", { name, email });
      return {
        content: [
          {
            type: "json",
            data: response.data,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ API çağrısı başarısız: ${error.message}`,
          },
        ],
      };
    }
  }
);

  //kullancıı listeleme
  server.registerTool(
  "listUsersViaApi",
  {
    title: "List Users via API",
    description: "Katmanlı API üzerinden kullanıcıları listeler",
    inputSchema: {},
  },
  async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      return {
        content: [
          {
            type: "json",
            data: response.data,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ API çağrısı başarısız: ${error.message}`,
          },
        ],
      };
    }
  }
);

  //kullanıcı güncelleme
server.registerTool(
  "updateUserViaApi",
  {
    title: "Update User via API",
    description: "Katmanlı API üzerinden kullanıcı günceller",
    inputSchema: {
      id: z.number(),
      name: z.string(),
      email: z.string(),
    },
  },
  async ({ id, name, email }) => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${id}`, { name, email });
      return {
        content: [
          {
            type: "json",
            data: response.data,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ API çağrısı başarısız: ${error.message}`,
          },
        ],
      };
    }
  }
);

  //kullanıcı sil
 server.registerTool(
  "deleteUserViaApi",
  {
    title: "Delete User via API",
    description: "Katmanlı API üzerinden kullanıcı siler",
    inputSchema: {
      id: z.number(),
    },
  },
  async ({ id }) => {
    try {
      const response = await axios.delete(`http://localhost:3000/users/${id}`);
      return {
        content: [
          {
            type: "json",
            data: response.data,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `❌ API çağrısı başarısız: ${error.message}`,
          },
        ],
      };
    }
  }
);


  // TOOLS
  server.registerTool(
    "add",
    {
      title: "Addition Tool",
      description: "Add two numbers",
      inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }],
    })
  );

  server.registerTool(
    "subtract",
    {
      title: "Subtraction Tool",
      description: "Subtract b from a",
      inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a - b) }],
    })
  );

  server.registerTool(
    "multiply",
    {
      title: "Multiplication Tool",
      description: "Multiply two numbers",
      inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a * b) }],
    })
  );

  server.registerTool(
    "divide",
    {
      title: "Division Tool",
      description: "Divide a by b",
      inputSchema: {
        a: z.number(),
        b: z.number().refine((val) => val !== 0, {
          message: "Cannot divide by zero",
        }),
      },
    },
    async ({ a, b }) => ({
      content: [{ type: "text", text: String(a / b) }],
    })
  );

  server.registerTool(
    "passwordStrengthChecker",
    {
      title: "Password Strength Checker",
      description: "Evaluates the strength of a given password",
      inputSchema: {
        password: z.string(),
      },
    },  
    async ({ password }) => {
      const lengthCriteria = password.length >= 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

      const passedCriteria = [
        lengthCriteria,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar,
      ].filter(Boolean).length;

      let strength = "Zayıf";
      if (passedCriteria >= 4) strength = "Güçlü";
      else if (passedCriteria === 3) strength = "Orta";

      return {
        content: [
          {
            type: "text",
            text: `🔐 Şifre Gücü: ${strength}\n\nKriterler:\n- Uzunluk >= 8: ${lengthCriteria ? "✅" : "❌"}\n- Büyük harf: ${hasUpperCase ? "✅" : "❌"}\n- Küçük harf: ${hasLowerCase ? "✅" : "❌"}\n- Rakam: ${hasNumber ? "✅" : "❌"}\n- Özel karakter: ${hasSpecialChar ? "✅" : "❌"}`,
          },
        ],
      };
    }
  );


server.registerTool(
  "format_final_json_response",
  {
    title: "Final JSON Formatter",
    description: "Son yanıtı kullanıcıya iletir",
    inputSchema: {
      method: z.string(),
      params: z.any(), 
    },
  },
  async ({ method, params }) => {
    return {
      content: [
        {
          type: "tool_call",
          method,
          params,
        },
      ],
    };
  }
);

  // EXPRESS HTTP SERVER
  const app = express();
  app.use(bodyParser.json());

  const transports = {};

  app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;

    res.on("close", () => {
      delete transports[transport.sessionId];
    });

    await server.connect(transport);
  });
  app.post("/messages", async (req, res) => {
    console.log("POST /messages alındı:", req.query.sessionId, JSON.stringify(req.body, null, 2));
    const sessionId = req.query.sessionId;
    const transport = transports[sessionId];

    if (transport instanceof SSEServerTransport) {
      await transport.handlePostMessage(req, res, req.body);
    } else {
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "session",
        },
        id: null,
      });
    }
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `✅ MCP HTTP sunucusu http://0.0.0.0:${PORT}/sse adresinde çalışıyor.`
    );
  });
