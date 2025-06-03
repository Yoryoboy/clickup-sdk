const buildQuery = (params) => {
  if (!params || Object.keys(params).length === 0) return "";

  const parts = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    // Handle arrays specially for ClickUp API (needs brackets in parameter name)
    if (Array.isArray(value)) {
      value.forEach((item) => {
        // Encode both the key and value
        const encodedKey = encodeURIComponent(`${key}[]`);
        const encodedValue = encodeURIComponent(item);
        parts.push(`${encodedKey}=${encodedValue}`);
      });
    } else {
      // Handle non-array values normally
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      parts.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return parts.join("&");
};

export default buildQuery;
