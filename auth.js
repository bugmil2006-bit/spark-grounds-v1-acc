// Importăm Supabase direct prin CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- 1. CONEXIUNEA SUPABASE (PUNE CHEILE TALE AICI) ---
const supabaseUrl = 'https://onacnbxdqdfpdexlsksg.supabase.co'; 
const supabaseKey = 'sb_publishable_y2ZJNfWkd-hfUiSYR1MbVQ_go4ZSfbU';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 2. ELEMENTELE DIN INTERFAȚĂ ---
const loginNavBtn = document.getElementById('login-nav-btn');
const accountNavBtn = document.getElementById('account-nav-btn');
const logoutBtn = document.getElementById('logout-btn');

// --- 3. CREIERUL MENIULUI (Ascultă dacă ești logat sau nu) ---
// Acest cod previne suprapunerea butoanelor din meniu
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        // Dacă ești logat
        if (loginNavBtn) loginNavBtn.style.display = 'none';
        if (accountNavBtn) accountNavBtn.style.display = 'inline-block';
    } else {
        // Dacă NU ești logat
        if (loginNavBtn) loginNavBtn.style.display = 'inline-block';
        if (accountNavBtn) accountNavBtn.style.display = 'none';
    }
});

// --- 4. LOGICA DE DECONECTARE (Dacă există un buton de logout pe pagină) ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signOut();
        
        if (!error) {
            window.location.href = 'home.html'; // Te trimite pe home după delogare
        } else {
            console.error("Eroare la delogare:", error.message);
        }
    });
}

// --- 5. LOGICA PENTRU PAGINA DE LOGIN (auth-form) ---
// Acest cod rulează DOAR dacă ești pe pagina login.html
const authForm = document.getElementById('auth-form');
if (authForm) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const authMessage = document.getElementById('auth-message');

    // Funcție mică pentru a afișa mesaje de eroare/succes
    function showMessage(text, isError = true) {
        authMessage.innerText = text;
        authMessage.classList.remove('hidden', 'error', 'success');
        authMessage.classList.add(isError ? 'error' : 'success');
    }

    // Funcția de AUTENTIFICARE (Log In)
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Oprește refresh-ul paginii
        const email = emailInput.value;
        const password = passwordInput.value;

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            showMessage(error.message);
        } else {
            showMessage("Autentificare reușită! Te redirecționăm...", false);
            setTimeout(() => {
                window.location.href = 'home.html'; 
            }, 1000);
        }
    });

    // Funcția de ÎNREGISTRARE (Creează Cont)
    registerBtn.addEventListener('click', async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password || password.length < 6) {
            showMessage("Te rog introdu un email valid și o parolă de minim 6 caractere.");
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            showMessage(error.message);
        } else {
            showMessage("Cont creat! Verifică-ți adresa de email pentru confirmare.", false);
        }
    });
}