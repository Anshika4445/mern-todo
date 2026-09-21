function notFound(req, res) {
  res
    .status(404)
    .json({
      success: false,
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
}
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  res
    .status(status)
    .json({
      success: false,
      message: status === 500 ? "Internal server error" : err.message,
      errors: err.errors
        ? Object.values(err.errors).map((e) => e.message)
        : undefined,
    });
}
module.exports = { notFound, errorHandler };
