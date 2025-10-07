// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBX3-J3vZlGnM_CkKnXn7jVVdZj7Rrsx-8",
  authDomain: "nepal-trader.firebaseapp.com",
  projectId: "nepal-trader",
  storageBucket: "nepal-trader.firebasestorage.app",
  messagingSenderId: "225982610863",
  appId: "1:225982610863:web:dfe44ff14d72f91013435a",
  measurementId: "G-R6K7E8814T"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const appSection = document.getElementById('app-section');
const authSection = document.getElementById('auth-section');
const userNameEl = document.getElementById('user-name');
const balanceEl = document.getElementById('user-balance');
const packagesDiv = document.getElementById('packages');
const withdrawCard = document.getElementById('withdraw-card');
const historyCard = document.getElementById('history-card');
const withdrawAmount = document.getElementById('withdraw-amount');
const withdrawID = document.getElementById('withdraw-id');
const paymentMethods = document.querySelectorAll('.pay-icon');
const historyTable = document.getElementById('history-table');

// Packages
const packageList = [
  {name:'Silver', amount:300},
  {name:'Gold', amount:500},
  {name:'Nepal', amount:650},
  {name:'Good', amount:1000}
];

let selectedMethod = null;

// Show/Hide Forms
showRegister.addEventListener('click', e=>{
  e.preventDefault();
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
});
showLogin.addEventListener('click', e=>{
  e.preventDefault();
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

// Register
document.getElementById('btn-register').addEventListener('click', async()=>{
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-pass').value;
  try{
    const userCredential = await auth.createUserWithEmailAndPassword(email, pass);
    await db.collection("users").doc(userCredential.user.uid).set({
      displayName: name,
      email,
      balance: 0
    });
    alert("Registered Successfully!");
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  } catch(e){
    alert(e.message);
  }
});

// Login
document.getElementById('btn-login').addEventListener('click', async()=>{
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;
  try{
    const userCredential = await auth.signInWithEmailAndPassword(email, pass);
    const userDoc = await db.collection("users").doc(userCredential.user.uid).get();
    userNameEl.innerText = userDoc.data().displayName;
    balanceEl.innerText = userDoc.data().balance;
    authSection.classList.add('hidden');
    appSection.classList.remove('hidden');
  } catch(e){
    alert(e.message);
  }
});

// Packages Render
packageList.forEach(p=>{
  const div = document.createElement('div');
  div.className='package-card';
  div.innerHTML = `<span>${p.name} Package - Rs.${p.amount}</span><button>Buy</button>`;
  div.querySelector('button').addEventListener('click', ()=>{
    window.open("https://wa.me/9766692182?text=I want to buy "+p.name+" package Rs."+p.amount);
  });
  packagesDiv.appendChild(div);
});

// Payment Method select
paymentMethods.forEach(icon=>{
  icon.addEventListener('click', ()=>{
    paymentMethods.forEach(i=>i.classList.remove('selected'));
    icon.classList.add('selected');
    selectedMethod = icon.dataset.method;
  });
});

// Withdraw Submit
document.getElementById('btn-withdraw-submit').addEventListener('click', async()=>{
  const amount = withdrawAmount.value;
  const id = withdrawID.value;
  if(!selectedMethod){alert("Select payment method"); return;}
  const user = auth.currentUser;
  if(user){
    await db.collection("withdraws").add({
      uid:user.uid,
      amount,
      method:selectedMethod,
      id,
      status:"Pending",
      createdAt:firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Withdraw Request Submitted!");
  }
});

// Logout
document.getElementById('btn-logout').addEventListener('click', ()=>{
  auth.signOut();
  appSection.classList.add('hidden');
  authSection.classList.remove('hidden');
});
