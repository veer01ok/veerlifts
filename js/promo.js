/* ------------------------------------------------------------
   The discount code.

   This does not apply a discount. A page cannot — the price is
   whatever Razorpay charges, and a browser has no say in that.
   What this does is check the code and, if it matches, point every
   buy button at a second Razorpay page that is priced lower.
   Razorpay does the charging.

   So the code being readable in this file is not the hole it looks
   like. The discounted link is the thing that actually gives money
   away, and it is equally readable — which is why OFFER.DISCOUNT
   says to treat that URL as public.

   Values are stamped in by build/build-site.mjs from
   build/offer.mjs; nothing here is typed twice.
   ------------------------------------------------------------ */

(function () {
  var CODE = 'VEERLIFTS10';
  var PRICE = '₹269';
  var WAS = '₹299';
  var NOTE = '10% off — applied at checkout';
  var CHECKOUT = '';

  var form = document.getElementById('promo');
  if (!form) return;

  var open = document.getElementById('promoOpen');
  var row = document.getElementById('promoRow');
  var input = document.getElementById('promoCode');
  var msg = document.getElementById('promoMsg');

  open.addEventListener('click', function () {
    row.hidden = false;
    open.hidden = true;
    input.focus();
  });

  var say = function (text, state) {
    msg.textContent = text;
    msg.className = 'promo__msg' + (state ? ' is-' + state : '');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var typed = (input.value || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!typed) { say('Type the code first.', 'no'); return; }

    if (typed !== CODE) {
      say('That code isn’t valid.', 'no');
      return;
    }

    /* The code is right, but there is no discounted page to send
       anyone to — so say so rather than promising a price that
       will not be charged. */
    if (!CHECKOUT) {
      say('This code isn’t set up yet. It’ll work shortly — or just buy at the normal price.', 'no');
      return;
    }

    /* Every buy link now goes to the discounted page. */
    var links = document.querySelectorAll('[data-offer="buy"]');
    for (var i = 0; i < links.length; i++) links[i].setAttribute('href', CHECKOUT);

    /* Show the new price with the old one struck through beside it;
       a number that silently changes reads as a trick. */
    var nums = document.querySelectorAll('[data-offer="price"]');
    for (var j = 0; j < nums.length; j++) {
      nums[j].textContent = PRICE;
      if (nums[j].classList.contains('price__num') && WAS) {
        var old = document.createElement('span');
        old.className = 'price__was';
        old.textContent = WAS;
        nums[j].insertAdjacentElement('afterend', old);
      }
    }

    say(CODE + ' — ' + NOTE, 'ok');
    input.disabled = true;
    form.querySelector('.promo__go').disabled = true;
  });

  input.addEventListener('input', function () {
    if (msg.classList.contains('is-no')) say('');
  });
})();
