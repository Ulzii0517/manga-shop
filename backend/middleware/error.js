const errorHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  if (error.message === "Токен байхгүй.") {
    error.message = "Та нэвтэрч байж энэ үйлдлийг хийх боломжтой!";
    error.statusCode = 401;
  }

  if (err.name === "JsonWebTokenError" && err.message === "jwt malformed") {
    error.message = "Та нэвтэрч байж энэ үйлдлийг хийх боломжтой!";
    error.statusCode = 401;
  }

  if (error.code === 11000) {
    error.message = "Энэ талбарын утгыг давхардуулж өгч болохгүй!";
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
};

export default errorHandler;
