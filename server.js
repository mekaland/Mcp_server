  import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
  import { SSEServerTransport} from "@modelcontextprotocol/sdk/server/sse.js";
  import express from "express";
  import bodyParser from "body-parser";
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
    "createUser",
    {
      title: "Create User",
      description: "Create a new user with name and email",
      inputSchema: {
        name: z.string(),
        email: z.string(),
      },
    },
    async({ name, email }) => {
      try {
        const result = await pool.query(
          "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
          [name, email]
        );

        return {
          content: [
            {
              type: "text",
              text: `✅ Kullanıcı eklendi: ${result.rows[0].name} (${result.rows[0].email})`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Kullanıcı eklenemedi: ${err.message}`,
            },
          ],
        };
      }
    }
  );

  //kullancıı listeleme
  server.registerTool(
    "listUsers",
    {
      title: "List Users",
      description: "Get a list of all users",
      inputSchema: {},
    },
    async () => {
      try {
        const result = await pool.query("SELECT * FROM users");
        const users = result.rows;

        if (users.length === 0) {
          return {
            content: [{ type: "text", text: "📭 Kayıtlı kullanıcı yok." }],
          };
        }

        const text = users
          .map((u) => `👤 ${u.name} (${u.email})`)
          .join("\n");

        return {
          content: [{ type: "text", text }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `❌ Hata: ${err.message}` }],
        };
      }
    }
  );

  //kullanıcı güncelleme
  server.registerTool(
    "updateUser",
    {
      title: "Update User",
      description: "Update a user's name and email by id",
      inputSchema: {
        id: z.number(),
        name: z.string(),
        email: z.string(),
      },
    },
    async ({ id, name, email }) => {
      try {
        const result = await pool.query(
          "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
          [name, email, id]
        );

        if (result.rowCount === 0) {
          return {
            content: [{ type: "text", text: `❌ Kullanıcı bulunamadı.` }],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `✅ Kullanıcı güncellendi: ${result.rows[0].name} (${result.rows[0].email})`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `❌ Hata: ${err.message}` }],
        };
      }
    }
  );

  //kullanıcı sil
  server.registerTool(
    "deleteUser",
    {
      title: "Delete User",
      description: "Delete a user by id",
      inputSchema: {
        id: z.number(),
      },
    },
    async ({ id }) => {
      try {
        const result = await pool.query(
          "DELETE FROM users WHERE id = $1 RETURNING *",
          [id]
        );

        if (result.rowCount === 0) {
          return {
            content: [{ type: "text", text: `❌ Kullanıcı bulunamadı.` }],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `🗑️ Kullanıcı silindi: ${result.rows[0].name}`,
            },
          ],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `❌ Hata: ${err.message}` }],
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
      params: z.any(), // tüm tool parametreleri için esnek yapı
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
