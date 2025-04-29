// Tambahan fitur: random roast, typing effect, sound, share, leaderboard, emoji avatar

async function roastUser(usernameManual = '') {
  const usernameInput = document.getElementById('usernameInput');
  const username = usernameManual || usernameInput.value.trim();
  const loader = document.getElementById('loader');
  const hasil = document.getElementById('hasilRoast');

  if (!username) {
    alert("Masukkan username dulu!");
    return;
  }

  loader.classList.remove('hidden');
  hasil.innerHTML = '';

  // Typing effect
  const typingMsg = document.createElement('p');
  typingMsg.textContent = `@${username} sedang di-roast...`;
  typingMsg.style.fontStyle = 'italic';
  hasil.appendChild(typingMsg);

  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const response = await fetch(`https://backendapi-production-ins.up.railway.app/api/roast?username=${username}`);
    const data = await response.json();

    if (data && data.username && data.avatar && data.roasting) {
      hasil.innerHTML = `
        <img src="${data.avatar}" width="100" height="100" /><br/>
        <div class="result-card">
          <strong>@${data.username}</strong>
          <p class="typing"></p>
          <div class="stars">${generateStars(data.rating)}</div>
          <p><em>${data.ratingText || ''}</em></p>
          <button onclick="copyRoast()">🔗 Share</button>
        </div>
      `;

      typeText(document.querySelector('.typing'), data.roasting);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      const audio = new Audio('https://www.soundjay.com/button/sounds/button-29.mp3');
      audio.play();

      const history = JSON.parse(localStorage.getItem('roastHistory') || '[]');
      history.push({ username: data.username, rating: data.rating });
      localStorage.setItem('roastHistory', JSON.stringify(history));

      showLeaderboard();
    } else {
      hasil.innerHTML = "<p>Data tidak lengkap atau username tidak ditemukan.</p>";
    }
  } catch (err) {
    console.error("Gagal ambil data:", err);
    hasil.innerHTML = "<p>Terjadi kesalahan saat memuat data.</p>";
  } finally {
    loader.classList.add('hidden');
  }
}

function typeText(el, text, i = 0) {
  if (i < text.length) {
    el.textContent += text.charAt(i);
    setTimeout(() => typeText(el, text, i + 1), 40);
  }
}

function generateStars(rating) {
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    starsHTML += `<span class="star ${i <= rating ? 'active' : ''}">&#9733;</span>`;
  }
  return starsHTML;
}


  const history = JSON.parse(localStorage.getItem('roastHistory') || '[]');
  const sorted = history.sort((a, b) => b.rating - a.rating).slice(0, 5);

  board.innerHTML = `<h3>🔥 Top Roastable</h3>` + sorted.map(u => `
    <div>@${u.username} - ⭐️ ${u.rating}</div>
  `).join('');

  document.getElementById('hasilRoast').appendChild(board);
}


// Toggle Dark/Light Mode
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
} 
