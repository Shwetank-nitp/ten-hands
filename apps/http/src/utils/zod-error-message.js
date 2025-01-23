const zodErrorMessage = (error) => {
  return error.issues.map((e) => e.path + ": " + e.message).join(", ");
};

export { zodErrorMessage };
