export async function errorHandler(req, res, fn) {
  try {
    await fn(req, res);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
}
