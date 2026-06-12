function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.innerHTML = '✓ MESSAGE SENT!';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> SEND MESSAGE';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
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
  btn.innerHTML = '✓ SUBMITTED! WE\'LL CALL YOU SHORTLY';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = orig;
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  if (tab === 'car' || tab === 'bike') {
    revnSetTab(tab);
  }
});
