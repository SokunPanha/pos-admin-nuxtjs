import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import * as yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SWAGGER_URL = process.env.SWAGGER_URL || "http://localhost:4000/admin/docs-yaml";
const OUTPUT_FILE = path.resolve(__dirname, "../shared/types/ApiResponseType.ts");

interface SchemaProperty {
  type?: string;
  $ref?: string;
  enum?: string[];
  items?: SchemaProperty;
  format?: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  example?: unknown;
  description?: string;
  default?: unknown;
}

interface Schema {
  type?: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
}

interface OpenAPIDoc {
  components?: {
    schemas?: Record<string, Schema>;
  };
}

function resolveRef(ref: string): string {
  // "#/components/schemas/UserItemType" → "UserItemType"
  const parts = ref.split("/");
  return parts[parts.length - 1];
}

function toTsType(prop: SchemaProperty): string {
  if (prop.$ref) {
    return resolveRef(prop.$ref);
  }

  if (prop.enum) {
    return prop.enum.map((v) => `"${v}"`).join(" | ");
  }

  if (prop.type === "array") {
    if (prop.items) {
      const itemType = toTsType(prop.items);
      return `${itemType}[]`;
    }
    return "unknown[]";
  }

  if (prop.type === "object") {
    if (prop.properties) {
      const required = prop.required || [];
      const fields = Object.entries(prop.properties).map(([key, val]) => {
        const optional = !required.includes(key) ? "?" : "";
        return `  ${key}${optional}: ${toTsType(val)};`;
      });
      return `{\n${fields.join("\n")}\n}`;
    }
    return "Record<string, unknown>";
  }

  switch (prop.type) {
    case "string":
      return "string";
    case "number":
    case "integer":
      return "number";
    case "boolean":
      return "boolean";
    default:
      return "unknown";
  }
}

function generateInterface(name: string, schema: Schema): string {
  if (!schema.properties) {
    return `export type ${name} = Record<string, unknown>;\n`;
  }

  const required = schema.required || [];
  const fields = Object.entries(schema.properties).map(([key, prop]) => {
    const optional = !required.includes(key) ? "?" : "";
    return `  ${key}${optional}: ${toTsType(prop)};`;
  });

  return `export interface ${name} {\n${fields.join("\n")}\n}\n`;
}

async function main() {
  console.log(`Fetching OpenAPI spec from ${SWAGGER_URL}...`);

  const response = await fetch(SWAGGER_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const doc = yaml.load(text) as OpenAPIDoc;

  const schemas = doc.components?.schemas;
  if (!schemas) {
    throw new Error("No schemas found in components.schemas");
  }

  const lines: string[] = [
    "// Auto-generated from OpenAPI spec — do not edit manually",
    `// Generated at: ${new Date().toISOString()}`,
    `// Source: ${SWAGGER_URL}`,
    "",
  ];

  for (const [name, schema] of Object.entries(schemas)) {
    lines.push(generateInterface(name, schema));
  }

  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");
  console.log(`Generated ${Object.keys(schemas).length} types → ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
