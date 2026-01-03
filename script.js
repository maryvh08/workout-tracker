document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js cargado correctamente ✅");

  // =======================
  // ELEMENTOS
  // =======================
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const signupBtn = document.getElementById("signup-btn");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  const authInputs = document.getElementById("auth-inputs");
  const userInfo = document.getElementById("user-info");
  const userEmail = document.getElementById("user-email");

  const templateSelect = document.getElementById("template-select");

  // =======================
  // AUTH BUTTONS
  // =======================
  signupBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Usuario registrado. Revisa tu correo.");
    }
  });

  loginBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) alert(error.message);
  });

  logoutBtn.addEventListener("click", async () => {
    console.log("Click en salir");
    const { error } = await supabaseClient.auth.signOut();
    if (error) alert(error.message);
  });

  // =======================
  // AUTH STATE (UNO SOLO)
  // =======================
  supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log("Auth event:", event);

    if (!session) {
      renderLoggedOut();
    } else {
      renderLoggedIn(session);
      loadMesocycleTemplates();
    }
  });

  // =======================
  // UI STATES
  // =======================
  function renderLoggedOut() {
    authInputs.style.display = "block";
    userInfo.style.display = "none";
    logoutBtn.style.display = "none";

    if (templateSelect) {
      templateSelect.innerHTML =
        `<option value="">Inicia sesión</option>`;
    }
  }

  function renderLoggedIn(session) {
    authInputs.style.display = "none";
    userInfo.style.display = "block";
    logoutBtn.style.display = "inline-block";
    userEmail.textContent = session.user.email;
  }

  // =======================
  // PLANTILLAS
  // =======================
  async function loadMesocycleTemplates() {
    if (!templateSelect) return;

    templateSelect.innerHTML =
      `<option value="">Cargando plantillas...</option>`;

    const { data, error } = await supabaseClient
      .from("mesocycle_templates")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Error plantillas:", error);
      templateSelect.innerHTML =
        `<option value="">Error al cargar</option>`;
      return;
    }

    if (!data || data.length === 0) {
      templateSelect.innerHTML =
        `<option value="">No hay plantillas</option>`;
      return;
    }

    templateSelect.innerHTML =
      `<option value="">Selecciona plantilla</option>`;

    data.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.name;
      templateSelect.appendChild(opt);
    });
  }
});
