export default {
  body: {
    type: "object",
    required: ["username", "password"],
    properties: {
      email: { type: "string", format: "email" },
      username: { type: "string", maxLength: 20 },
      password: { type: "string", minLength: 6 },
    },
  },
};
