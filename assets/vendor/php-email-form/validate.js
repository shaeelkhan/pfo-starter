/**
* PHP Email Form Validation - v3.5
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, addDoc, FieldValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
import * as firebase from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js'
const firebaseConfig = {
  apiKey: "AIzaSyAuZV6URlfZG3YtY9AhNAZnz6Hi2t99PZg",
  authDomain: "pfo-starter.firebaseapp.com",
  projectId: "pfo-starter",
  storageBucket: "pfo-starter.appspot.com",
  messagingSenderId: "62430084522",
  appId: "1:62430084522:web:74f57ff85a782076077fd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');
  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptcha, { action: 'php_email_form_submit' })
                .then(token => {
                  formData.set('recaptcha-response', token);
                  php_email_form_submit(thisForm, action, formData);
                })
            } catch (error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        let payload = { name: thisForm[0].value, email: thisForm[1].value, subject: thisForm[2].value, message: thisForm[3].value }
        php_email_form_submit(thisForm, action, formData, payload);
      }
    });
  });


  function php_email_form_submit(thisForm, action, formData, payload) {
    debugger
    thisForm.querySelector('.loading').classList.add('d-block');
    addDoc(collection(db, "messages"), { ...payload }).then((data) => {
      console.log(data);
      debugger
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.add('d-block');
      thisForm.reset();
      setTimeout(() => {
        thisForm.querySelector('.sent-message').classList.remove('d-block');
      }, 2000);
    }).catch(err => {
      displayError(thisForm, err);
    });
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error.message;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
