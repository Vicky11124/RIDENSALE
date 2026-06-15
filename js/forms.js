function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '✓ DIRECTING TO WHATSAPP...';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    window.open("https://wa.me/918056390246", "_blank");
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> SEND MESSAGE';
    btn.style.background = '';
    e.target.reset();
  }, 1000);
}

function revnSetTab(type) {
  const bikeForm = document.getElementById('sell-bike-form');
  const carForm = document.getElementById('sell-car-form');
  const tabBike = document.getElementById('tab-bike');
  const tabCar = document.getElementById('tab-car');
  if (!bikeForm || !carForm) return;
  if (type === 'bike') {
    bikeForm.style.display = '';
    carForm.style.display = 'none';
    tabBike.classList.add('active');
    tabCar.classList.remove('active');
    bikeForm.querySelector('.sell-form-card').style.animation = 'none';
    requestAnimationFrame(() => { bikeForm.querySelector('.sell-form-card').style.animation = ''; });
  } else {
    carForm.style.display = '';
    bikeForm.style.display = 'none';
    tabCar.classList.add('active');
    tabBike.classList.remove('active');
    carForm.querySelector('.sell-form-card').style.animation = 'none';
    requestAnimationFrame(() => { carForm.querySelector('.sell-form-card').style.animation = ''; });
  }
}

function handleSellForm(e, type) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '✓ DIRECTING TO WHATSAPP...';
  btn.style.background = '#22c55e';
  btn.disabled = true;

  const inputs = e.target.querySelectorAll('select, input');
  let details = [];
  inputs.forEach(inp => {
    if (inp.value && inp.type !== 'submit') {
      let label = inp.getAttribute('aria-label') || inp.placeholder || inp.name || 'Detail';
      details.push(`${label}: ${inp.value}`);
    }
  });
  let message = `Hi, I want to sell my ${type}.\n\nDetails:\n${details.join('\n')}`;

  setTimeout(() => {
    window.open("https://wa.me/918056390246?text=" + encodeURIComponent(message), "_blank");
    btn.innerHTML = orig;
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab === 'car' || tab === 'bike') {
    revnSetTab(tab);
  }
});

const bikeData = {
  "Royal Enfield": ["Bullet 350", "Bullet 500", "Classic 350", "Classic 500", "Classic 650", "Hunter 350", "Meteor 350", "Super Meteor 650", "Thunderbird 350", "Thunderbird 500", "Himalayan 411", "Himalayan 450", "Scram 411", "Guerrilla 450", "Interceptor 650", "Continental GT 650", "Shotgun 650", "Bear 650", "Machismo", "Electra", "Standard 350", "Standard 500"],
  "Honda": ["CD 110 Dream", "Shine", "Shine 100", "SP 125", "SP 160", "Livo", "Unicorn", "Hornet 2.0", "CB200X", "CB300F", "CB300R", "CB350", "H'ness CB350", "CB350RS", "NX500", "Transalp XL750", "CBR150R", "CBR250R", "CBR650R", "CBR1000RR-R", "CB500X", "Africa Twin", "Activa", "Activa 3G", "Activa 4G", "Activa 5G", "Activa 6G", "Activa 125", "Activa e (Electric)", "Dio 100", "Dio 110", "Dio 125", "Aviator", "Eterno", "Grazia", "Navi", "Cliq", "Forza 350 (CBU)", "PCX 160 (Limited/CBU)"],
  "Yamaha": ["FZ16", "FZ-S", "FZ-S FI", "FZ-X", "FZS 25", "FZ25", "MT-15", "MT-03", "MT-09", "R15 V1", "R15 V2", "R15 V3", "R15 V4", "R15S", "R3", "R7", "R1", "Fazer", "Fazer FI", "SZ", "SZ-RR", "Saluto", "Saluto RX", "RX100", "RX135", "RX-Z", "Crux", "Gladiator", "Libero", "Enticer", "XSR155", "Ray", "Ray Z", "Ray ZR", "RayZR 125 Fi Hybrid", "Fascino", "Fascino 125", "Fascino 125 Fi Hybrid", "Aerox 155", "Alpha", "Cygnus Ray", "Cygnus Alpha"],
  "TVS": ["Apache RTR 160", "Apache RTR 160 4V", "Apache RTR 180", "Apache RTR 200 4V", "Apache RTR 310", "Apache RR 310", "Raider 125", "Ronin", "Radeon", "Victor", "Phoenix", "Flame", "Max 100", "Sports", "Star City", "Star City Plus", "Samurai", "Shogun", "Fiero", "Fiero FX", "Jupiter", "Jupiter ZX", "Jupiter Grande", "Jupiter 125", "Ntorq 125", "Ntorq Race XP", "Ntorq XT", "Ntorq 150", "Scooty Pep", "Scooty Pep Plus", "Scooty Streak", "Scooty Teenz", "Scooty Zest 110", "Wego", "Jupiter Classic", "iQube", "iQube S", "iQube ST", "Creon"],
  "Bajaj": ["Pulsar 125", "Pulsar 150", "Pulsar 180", "Pulsar 200", "Pulsar 220F", "Pulsar NS125", "Pulsar NS160", "Pulsar NS200", "Pulsar N150", "Pulsar N160", "Pulsar N250", "Pulsar F250", "Dominar 250", "Dominar 400", "Avenger 150", "Avenger 160", "Avenger 180", "Avenger 220", "Discover 100", "Discover 125", "Discover 135", "Platina 100", "Platina 110", "CT100", "CT110", "Boxer", "Boxer AT", "Caliber", "Wind 125", "Eliminator", "Chetak (Classic Gear Scooter)", "Chetak Electric", "Chetak 2903", "Chetak Premium", "Chetak Urbane", "Spirit", "Sunny", "Bravo", "Legend", "Saffire", "Wave", "Kristal DTS-i"],
  "Suzuki": ["Gixxer 150", "Gixxer SF 150", "Gixxer 250", "Gixxer SF 250", "V-Strom SX", "V-Strom 800DE", "Hayabusa", "GSX-S750", "GSX-8R", "GSX-R1000R", "Intruder 150", "Zeus", "Slingshot", "Heat", "Shogun", "Samurai", "Access 125", "Burgman Street", "Burgman Street EX", "Avenis 125", "Swish 125", "Let's", "e-Access"],
  "KTM": ["125 Duke", "200 Duke", "250 Duke", "390 Duke", "790 Duke", "890 Duke", "RC125", "RC200", "RC390", "RC8", "250 Adventure", "390 Adventure", "390 Adventure X", "390 Adventure Rally"],
  "Kawasaki": ["Ninja 300", "Ninja 400", "Ninja 500", "Ninja 650", "Ninja ZX-4R", "Ninja ZX-6R", "Ninja ZX-10R", "Ninja H2", "Ninja H2 SX", "Z250", "Z650", "Z900", "ZH2", "Versys X300", "Versys 650", "Versys 1000", "W175", "W800", "Vulcan S"],
  "Hero": ["Splendor", "Splendor Plus", "Splendor Plus XTEC", "Passion", "Passion Plus", "Passion Pro", "Passion XTEC", "HF Deluxe", "HF100", "Glamour", "Glamour XTEC", "Xtreme 125R", "Xtreme 160R", "Xtreme 200S", "Xtreme 250R", "Karizma", "Karizma R", "Karizma ZMR", "Karizma XMR", "Hunk", "Achiever", "Ignitor", "CBZ", "CBZ Xtreme", "XPulse 200", "XPulse 210", "Maverick 440", "Pleasure", "Pleasure Plus", "Pleasure Plus XTEC", "Maestro", "Maestro Edge", "Maestro Edge 125", "Destini 125", "Destini Prime", "Destini XTEC", "Vida V1 Pro", "Vida V1 Plus", "Vida VX2", "Duet", "Dash"],
  "BMW Motorrad": ["G310R", "G310GS", "F750GS", "F850GS", "F900R", "F900XR", "F900GS", "F450GS", "R1250GS", "R1300GS", "R18", "S1000R", "S1000RR", "M1000RR", "C 400 GT", "CE 04"],
  "Harley-Davidson": ["X440", "Sportster S", "Nightster", "Iron 883", "Forty-Eight", "Street 750", "Street Rod", "Fat Bob", "Fat Boy", "Breakout", "Heritage Classic", "Street Glide", "Road Glide", "Road King", "Pan America 1250"],
  "Ducati": ["Monster 797", "Monster 821", "Monster 937", "Scrambler Icon", "Scrambler Full Throttle", "Scrambler Nightshift", "Streetfighter V2", "Streetfighter V4", "Panigale V2", "Panigale V4", "Multistrada V2", "Multistrada V4", "Diavel 1260", "Diavel V4", "XDiavel", "Hypermotard 950", "DesertX", "SuperSport 950"]
};

function updateBikeModels() {
  const brandSelect = document.getElementById("bikeBrand");
  const modelSelect = document.getElementById("bikeModel");
  
  if (!brandSelect || !modelSelect) return;

  const brand = brandSelect.value;
  modelSelect.innerHTML = '<option value="" disabled selected></option>';

  if (bikeData[brand]) {
    bikeData[brand].forEach(model => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  }
  
  const optionOther = document.createElement("option");
  optionOther.value = "Other";
  optionOther.textContent = "Other";
  modelSelect.appendChild(optionOther);
}

const carData = {
  "Maruti Suzuki": ["800", "Alto", "Alto K10", "A-Star", "Celerio", "Celerio X", "Estilo", "Ritz", "Swift", "Baleno", "Ignis", "S-Presso", "Wagon R", "Zen", "Zen Estilo", "Dzire", "Swift Dzire", "SX4", "Ciaz", "Kizashi", "Brezza", "Vitara Brezza", "Grand Vitara", "Fronx", "Jimny", "S-Cross", "e Vitara", "Ertiga", "XL6", "Invicto", "Omni", "Eeco", "Versa", "Gypsy", "Esteem", "Grand Nomade"],
  "Hyundai": ["Santro", "Santro Xing", "i10", "Grand i10", "Grand i10 Nios", "i20", "Elite i20", "Getz", "Getz Prime", "Eon", "Exter", "Accent", "Verna", "Xcent", "Aura", "Elantra", "Sonata", "Venue", "Creta", "Alcazar", "Tucson", "Kona Electric", "Ioniq 5", "Stargazer"],
  "Tata": ["Indica", "Indica V2", "Indica Vista", "Tiago", "Altroz", "Indigo", "Indigo CS", "Tigor", "Manza", "Zest", "Sierra", "Safari", "Safari Storme", "Sumo", "Hexa", "Harrier", "Nexon", "Punch", "Curvv", "Tiago EV", "Tigor EV", "Nexon EV", "Punch EV", "Curvv EV"],
  "Mahindra": ["Scorpio", "Scorpio Classic", "Scorpio N", "Bolero", "Bolero Neo", "Thar", "Thar Roxx", "XUV300", "XUV 3XO", "XUV500", "XUV700", "XUV.e8", "TUV300", "Quanto", "Nuvosport", "Marazzo", "Armada", "Major", "Imperio", "Bolero Camper"],
  "Honda": ["Brio", "Jazz", "WR-V", "City", "Amaze", "Civic", "Accord", "Elevate", "BR-V", "CR-V"],
  "Toyota": ["Glanza", "Etios Liva", "Etios", "Yaris", "Camry", "Corolla Altis", "Urban Cruiser", "Urban Cruiser Hyryder", "Fortuner", "Land Cruiser Prado", "Land Cruiser 300", "Hilux", "Innova", "Innova Crysta", "Innova Hycross", "Rumion", "Vellfire"],
  "Kia": ["Sonet", "Seltos", "Syros", "Carens Clavis EV", "Carens", "EV6", "EV9", "Carnival"],
  "Volkswagen": ["Polo", "Beetle", "Vento", "Virtus", "Jetta", "Passat", "Taigun", "Tiguan", "T-Roc", "Touareg"],
  "Skoda": ["Slavia", "Rapid", "Laura", "Octavia", "Superb", "Kylaq", "Kushaq", "Karoq", "Kodiaq", "Yeti"],
  "Ford": ["Figo", "Freestyle", "Aspire", "Fiesta", "Fiesta Classic", "Ikon", "EcoSport", "Endeavour", "Fusion"],
  "Renault": ["Kwid", "Pulse", "Scala", "Kiger", "Duster", "Captur", "Lodgy", "Triber"]
};

function updateCarModels() {
  const brandSelect = document.getElementById("carBrand");
  const modelSelect = document.getElementById("carModel");
  
  if (!brandSelect || !modelSelect) return;

  const brand = brandSelect.value;
  modelSelect.innerHTML = '<option value="" disabled selected></option>';

  if (carData[brand]) {
    carData[brand].forEach(model => {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  }
  
  const optionOther = document.createElement("option");
  optionOther.value = "Other";
  optionOther.textContent = "Other";
  modelSelect.appendChild(optionOther);
}
