const backendURL = "http://localhost:3000";

async function loginAndGetToken(username, password) {
  try {
    const res = await fetch(`${backendURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      credentials: "include",
      body: new URLSearchParams({ username, password }),
    });

    const data = await res.json();
    console.log(res);

    try {
        if (res.ok && data.token) {
            localStorage.setItem("Authorization", data.token);
            console.log("Token stored.");
            return {success: 1};
        } else {
            return {message: data.message};
        }
    } catch (error) {
        return { message: (error.message || "Invalid Details")};
    }
  } catch (err) {
    console.error("Login request error:", err.message);
    return {message: err.message};
  }
}

async function signUp(json) {
  try {
    const res = await fetch(`${backendURL}/signUp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        credentials: "include",
        body: new URLSearchParams(json)
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      console.error("SignUp failed:", data);
      return null;
    }
  } catch (err) {
    console.error("SignUp error:", err);
    return null;
  }
}

async function sendRequest(json, path) {
  try {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      throw new Error("No token found in localStorage.");
    }

    const res = await fetch(`${backendURL}/${path}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    //   body: json,
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      console.error("Request failed:", data);
      return null;
    }
  } catch (err) {
    console.error("Send request error:", err);
    return null;
  }
}

export { loginAndGetToken, signUp ,sendRequest}