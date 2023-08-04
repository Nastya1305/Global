const users = document.querySelectorAll('.users__item');
let zIndex = users.length;
users.forEach((user, index) => {
   user.style.left = index * 22 + 'px';
   user.style.zIndex = zIndex--;
});

const search = document.querySelector('.search-form__input');
search.oninput = function () {
   this.value = this.value.replace(/[!@#$%^&*()]/g, '');
}

const subtitle = document.querySelector('.first-screen__subtitle');
fetch(`https://baconipsum.com/api/?type=lucky`)
   .then(response => response.json())
   .then(text => { subtitle.textContent = text[0] })
   .catch((error) => {
      console.log(error);
   });


const menuBurger = document.querySelector(".burger");
const header = document.querySelector(".header");

if (menuBurger) {
   menuBurger.addEventListener('click', function (e) {
      menuBurger.classList.toggle("burger--close");
      header.classList.toggle("header--dropdown");
      document.body.classList.toggle("lock");
   });
}

// работа с ссылками меню 
const menuLinks = document.querySelectorAll(".nav__link");
if (menuLinks.length > 0) {
   menuLinks.forEach(menuLink => {
      menuLink.addEventListener('click', onMenuLinkClick);
   });
}

function onMenuLinkClick(e) {

   // переход по ссылкам

   if (menuBurger.classList.contains("burger--close")) {
      menuBurger.classList.remove("burger--close");
      header.classList.remove("header--dropdown");
      document.body.classList.remove("lock");
   }
   e.preventDefault();
}
