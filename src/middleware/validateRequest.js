

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    // If validation fails, extract error messages and return a 400 response
 if (!result.success) {
  // Format the Zod error to extract messages
      const formatted = result.error.format();

      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      return res.status(400).json({ message: flatErrors.join(", ") });
    }

    next();
  };
};