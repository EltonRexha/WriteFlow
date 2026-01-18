import { Node } from "prosemirror-model";
import { getSchema } from "@tiptap/core";
import { Extensions, JSONContent } from "@tiptap/core";

interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateTiptapJSON(
  jsonContent: JSONContent,
  extensions: Extensions,
): ValidationResult {
  const schema = getSchema(extensions);
  const contentNode = Node.fromJSON(schema, jsonContent);
  contentNode.check();
  return { valid: true };
}
