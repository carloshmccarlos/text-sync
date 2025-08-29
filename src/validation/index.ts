// Export all validation schemas and types from a central location

// Re-export from schema file
export * from "./schema";
export * from "./types";

// Re-export valibot for convenience
export * as v from "valibot";

// Validation utilities
import * as v from "valibot";

/**
 * Safely parse data with a schema and return a result object
 * @param schema - Valibot schema to validate against
 * @param data - Data to validate
 * @returns Object with success flag and either data or error
 */
export function safeParse<T extends v.BaseSchema<any, any, any>>(
	schema: T,
	data: unknown,
): { success: true; data: v.InferOutput<T> } | { success: false; error: string; issues: v.ValiError<T>["issues"] } {
	try {
		const result = v.parse(schema, data);
		return { success: true, data: result };
	} catch (error) {
		if (error instanceof v.ValiError) {
			return {
				success: false,
				error: error.message,
				issues: error.issues,
			};
		}
		return {
			success: false,
			error: "Unknown validation error",
			issues: [],
		};
	}
}

/**
 * Validate data and throw an error if invalid
 * @param schema - Valibot schema to validate against
 * @param data - Data to validate
 * @returns Validated data
 * @throws ValiError if validation fails
 */
export function validateOrThrow<T extends v.BaseSchema<any, any, any>>(
	schema: T,
	data: unknown,
): v.InferOutput<T> {
	return v.parse(schema, data);
}

/**
 * Check if data is valid according to a schema
 * @param schema - Valibot schema to validate against
 * @param data - Data to validate
 * @returns True if valid, false otherwise
 */
export function isValid<T extends v.BaseSchema<any, any, any>>(
	schema: T,
	data: unknown,
): data is v.InferOutput<T> {
	try {
		v.parse(schema, data);
		return true;
	} catch {
		return false;
	}
}

/**
 * Get validation errors as a formatted string
 * @param error - ValiError from validation
 * @returns Formatted error message
 */
export function formatValidationError(error: v.ValiError<any>): string {
	return error.issues
		.map((issue) => {
			const path = issue.path?.map((p) => p.key).join(".") || "root";
			return `${path}: ${issue.message}`;
		})
		.join(", ");
}

/**
 * Get validation errors as an object with field paths as keys
 * @param error - ValiError from validation
 * @returns Object with field paths as keys and error messages as values
 */
export function getValidationErrors(error: v.ValiError<any>): Record<string, string> {
	const errors: Record<string, string> = {};
	
	for (const issue of error.issues) {
		const path = issue.path?.map((p) => p.key).join(".") || "root";
		errors[path] = issue.message;
	}
	
	return errors;
}
