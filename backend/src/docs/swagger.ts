import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Teabag",
      version: "1.0.0",
      description: "Express + TypeScript API with Swagger",
    },
  },
  apis: ["./src/docs/**/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
