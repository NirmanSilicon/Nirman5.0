import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

export async function loginUser(email, password) {
  // Firebase login
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;

  // Fetch user data
  const snap = await getDoc(doc(db, "users", uid));
  const data = snap.data();

  if (!data) throw new Error("User data missing!");

  return { uid, role: data.role };
}

// --- connect the login form ---
const loginForm = document.getElementById("auth-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;

    try {
      const result = await loginUser(email, password);

      console.log("Login successful:", result);

      // Redirect based on role
      if (result.role === "farmer") {
        window.location.href = "auth-farmer.html";
      } else {
        window.location.href = "auth-customer.html";
      }
    } catch (err) {
      alert(err.message);
    }
  });
}
