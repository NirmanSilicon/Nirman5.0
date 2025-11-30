import { auth, db, storage } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

export async function signupUser({ name, dob, email, password, role, photoFile }) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;

  let photoURL = "";
  if (photoFile) {
    const photoRef = ref(storage, `users/${uid}/profile.jpg`);
    await uploadBytes(photoRef, photoFile);
    photoURL = await getDownloadURL(photoRef);
  }

  await setDoc(doc(db, "users", uid), {
    name,
    dob,
    email,
    role,
    photoURL
  });

  return uid;
}

// --- connect signup form to Firebase ---
const form = document.getElementById("create-account-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("create-name").value;

    const day = document.getElementById("dob-day").value;
    const month = document.getElementById("dob-month").value;
    const year = document.getElementById("dob-year").value;
    const dob = `${day}-${month}-${year}`;

    const email = document.getElementById("create-email-phone").value;
    const password = document.getElementById("create-password").value;
    const role = document.querySelector("input[name='join-as']:checked").value;

    const photoFile = document.getElementById("photo-input").files[0];

    try {
      const uid = await signupUser({ name, dob, email, password, role, photoFile });

      console.log("Signup UID:", uid);

      // Redirect based on role
      if (role === "farmer") {
        window.location.href = "auth-farmer.html";
      } else {
        window.location.href = "auth-customer.html";
      }

    } catch (err) {
      alert(err.message);
    }
  });
}
