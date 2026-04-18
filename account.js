import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://PROIECTUL_TAU.supabase.co';
const supabaseKey = 'CHEIA_TA_ANONIMA';
const supabase = createClient(supabaseUrl, supabaseKey);

const userEmailDisplay = document.getElementById('user-email-display');
const discountsGrid = document.getElementById('discounts-grid');
const noDiscountsMsg = document.getElementById('no-discounts-msg');
const logoutBtn = document.getElementById('logout-btn');

async function loadAccountData() {
    // 1. Verificăm dacă user-ul este logat
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        // Dacă nu e logat, îl dăm afară înapoi la login
        window.location.href = 'login.html';
        return;
    }

    // Afișăm adresa de mail
    userEmailDisplay.innerText = session.user.email;

    // 2. Extragem reducerile din baza de date
    const { data: discounts, error } = await supabase
        .from('user_discounts')
        .select('*')
        .order('achieved_at', { ascending: false }); // Cele mai noi primele

    if (error) {
        console.error("Eroare la extragerea reducerilor:", error);
        return;
    }

    // 3. Afișăm voucherele
    if (discounts && discounts.length > 0) {
        noDiscountsMsg.style.display = 'none'; // Ascundem mesajul "nu ai reduceri"
        
        discounts.forEach(discount => {
            const card = document.createElement('div');
            card.className = 'discount-card';
            card.innerHTML = `
                <div class="percentage">-${discount.percentage}%</div>
                <div class="code">${discount.code}</div>
            `;
            discountsGrid.appendChild(card);
        });
    }
}

// Logica de Deconectare
logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    window.location.href = 'home.html';
});

// Pornim funcția
loadAccountData();