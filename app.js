// Stockage des données IMC
let imcData = JSON.parse(localStorage.getItem('imcData')) || [];
let currentChart = null;

// Navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = e.target.dataset.page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    document.getElementById(page).classList.add('active');
    e.target.classList.add('active');
  });
});

// Calcul IMC
function calculerIMC() {
  const poids = parseFloat(document.getElementById('poids').value);
  const taille = parseFloat(document.getElementById('taille').value);
  
  if (poids && taille) {
    const imc = poids / (taille * taille);
    const date = new Date().toISOString().split('T')[0];
    
    imcData.push({ date, imc });
    localStorage.setItem('imcData', JSON.stringify(imcData));
    
    document.getElementById('imc-value').textContent = imc.toFixed(1);
    document.getElementById('imc-status').textContent = getStatusIMC(imc);
    document.getElementById('resultat-imc').classList.remove('hidden');
    
    updateGraph();
  }
}

function getStatusIMC(imc) {
  if (imc < 18.5) return "Insuffisance pondérale";
  if (imc < 25) return "Poids normal";
  if (imc < 30) return "Surpoids";
  return "Obésité";
}

// Graphique
function updateGraph() {
  const ctx = document.getElementById('imc-graph').getContext('2d');
  
  // Destroy previous chart if it exists
  if (currentChart) {
    currentChart.destroy();
  }
  
  currentChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: imcData.map(d => d.date),
      datasets: [{
        label: 'IMC',
        data: imcData.map(d => d.imc),
        borderColor: '#3498db',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

// Recettes
const recettes = [
  {
    nom: "Salade de quinoa aux légumes",
    type: "maigrir",
    ingredients: ["quinoa", "tomates", "concombre", "poivron", "huile d'olive"],
    instructions: "1. Cuire le quinoa\n2. Couper les légumes\n3. Mélanger et assaisonner"
  },
  {
    nom: "Bowl de riz au saumon",
    type: "maigrir",
    ingredients: ["riz brun", "saumon", "avocat", "concombre", "sauce soja"],
    instructions: "1. Cuire le riz\n2. Griller le saumon\n3. Assembler le bowl"
  },
  {
    nom: "Wrap aux légumes grillés",
    type: "maigrir",
    ingredients: ["tortilla complète", "courgettes", "aubergines", "houmous"],
    instructions: "1. Griller les légumes\n2. Étaler le houmous\n3. Rouler le wrap"
  },
  {
    nom: "Poulet aux légumes vapeur",
    type: "maintien",
    ingredients: ["blanc de poulet", "brocoli", "carottes", "riz complet"],
    instructions: "1. Cuire le poulet\n2. Cuire les légumes à la vapeur\n3. Servir avec du riz"
  },
  {
    nom: "Buddha bowl équilibré",
    type: "maintien",
    ingredients: ["quinoa", "pois chiches", "patate douce", "épinards", "sauce tahini"],
    instructions: "1. Cuire le quinoa et la patate douce\n2. Assembler le bowl\n3. Ajouter la sauce"
  },
  {
    nom: "Tofu sauté aux légumes",
    type: "maintien",
    ingredients: ["tofu ferme", "brocoli", "champignons", "sauce soja"],
    instructions: "1. Presser et couper le tofu\n2. Faire sauter avec les légumes\n3. Assaisonner"
  },
  {
    nom: "Smoothie protéiné",
    type: "masse",
    ingredients: ["banane", "lait", "protéine en poudre", "beurre de cacahuète"],
    instructions: "1. Mixer tous les ingrédients\n2. Servir frais"
  },
  {
    nom: "Omelette protéinée",
    type: "masse",
    ingredients: ["œufs", "blanc d'œufs", "fromage", "épinards", "avoine"],
    instructions: "1. Battre les œufs\n2. Cuire l'omelette\n3. Ajouter les garnitures"
  },
  {
    nom: "Bowl de pâtes au poulet",
    type: "masse",
    ingredients: ["pâtes complètes", "poulet", "sauce crémeuse", "parmesan"],
    instructions: "1. Cuire les pâtes\n2. Griller le poulet\n3. Mélanger avec la sauce"
  }
];

function afficherRecettes(filter = 'all') {
  const container = document.getElementById('recettes-container');
  container.innerHTML = '';
  
  recettes
    .filter(r => filter === 'all' || r.type === filter)
    .forEach(recette => {
      const card = document.createElement('div');
      card.className = 'recette-card';
      card.innerHTML = `
        <h3>${recette.nom}</h3>
        <div class="content">
          <h4>Ingrédients:</h4>
          <ul>${recette.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
          <h4>Instructions:</h4>
          <p>${recette.instructions}</p>
        </div>
      `;
      container.appendChild(card);
    });
}

document.getElementById('filter-type').addEventListener('change', (e) => {
  afficherRecettes(e.target.value);
});

// Gestion du lecteur YouTube
let player;
let isYouTubeAPIReady = false;

function onYouTubeIframeAPIReady() {
  isYouTubeAPIReady = true;
  initYouTubePlayer();
}

function initYouTubePlayer() {
  if (!document.getElementById('player')) return;
  
  player = new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: '2ZN2rgj0Xj4',
    playerVars: {
      'autoplay': 0,
      'controls': 1,
      'rel': 0,
      'modestbranding': 1
    },
    events: {
      'onReady': function(event) {
        console.log('Player ready');
      },
      'onError': function(event) {
        console.error('Player error:', event);
      }
    }
  });
}

function handleTrackClick(videoId) {
  if (player && player.loadVideoById) {
    player.loadVideoById(videoId);
  } else {
    console.log('Réinitialisation du lecteur...');
    initYouTubePlayer();
    setTimeout(() => {
      if (player && player.loadVideoById) {
        player.loadVideoById(videoId);
      }
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Gestion des clics sur les boutons de lecture
  document.querySelectorAll('.track').forEach(track => {
    const playBtn = track.querySelector('.play-btn');
    const videoId = track.dataset.videoId;
    
    if (playBtn && videoId) {
      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleTrackClick(videoId);
      });
    }
  });

  // Autres initialisations existantes
  if (imcData.length > 0) {
    updateGraph();
  }
  afficherRecettes();
  genererPlanning();
});

// Planning
function genererPlanning() {
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  const grid = document.getElementById('planning-grid');
  grid.innerHTML = '';
  
  jours.forEach(jour => {
    const recette = recettes[Math.floor(Math.random() * recettes.length)];
    const dayCard = document.createElement('div');
    dayCard.className = 'planning-day';
    dayCard.innerHTML = `
      <h3>${jour}</h3>
      <p>${recette.nom}</p>
    `;
    grid.appendChild(dayCard);
  });
}