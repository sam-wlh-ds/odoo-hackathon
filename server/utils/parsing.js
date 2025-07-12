function safeParseArray(value) {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      console.warn("JSON parse failed for:", value);
    }
  } else if (typeof value == Array) return value;
  return [];
}

export {safeParseArray};