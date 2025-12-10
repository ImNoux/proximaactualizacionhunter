 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://esm.sh/firebase/app";
 import { getDatabase, ref, push, set, onValue, query, orderByKey, limitToFirst } from "https://esm.sh/firebase/database";

 // Your web app's Firebase configuration
 const firebaseConfig = {
  apiKey: "AIzaSyDM9E8Y_YW-ld8MH8-yKS345hklA0v5P_w",
  authDomain: "hunterteam.firebaseapp.com",
  databaseURL: "https://hunterteam-default-rtdb.firebaseio.com",
  projectId: "hunterteam",
  storageBucket: "hunterteam.firebasestorage.app",
  messagingSenderId: "1001713111500",
  appId: "1:1001713111500:web:8729bf9a47a7806f6c4d69",
  measurementId: "G-W6E0YQ8PEJ"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 // Get a reference to the database
 const db = getDatabase(app);

 const threadsRef = ref(db, 'threads'); // Reference to the threads in Firebase
 const threadsPerPage = 5; // Number of threads per page
 let currentPage = 1; // Current page number
 let totalThreads = 0; // Total number of threads

 document.addEventListener('DOMContentLoaded', function() {
  const newThreadButton = document.getElementById('newThreadButton');
  const newThreadModalContent = document.getElementById('newThreadModalContent');
  const closeButton = document.querySelector('.close-button');
  const newThreadForm = document.getElementById('newThreadForm');
  const threadContainer = document.querySelector('.thread-container');
  const noThreadsMessage = document.getElementById('noThreadsMessage');
  const paginationContainer = document.getElementById('pagination-container');

  // Function to save threads to Firebase
  function saveThreadToFirebase(thread) {
  push(threadsRef, thread);
  }

  // Function to load threads from Firebase with pagination
  function loadThreadsFromFirebase(page) {
  const firstThreadIndex = (page - 1) * threadsPerPage;

  // Query to get the threads for the current page
  const getThreads = query(threadsRef, orderByKey(), limitToFirst(threadsPerPage));

  onValue(getThreads, (snapshot) => {
  threadContainer.innerHTML = ''; // Clear the thread container
  let threads = snapshot.val();
  if (threads) {
  let index = 0;
  Object.keys(threads).forEach((key) => {
  let thread = threads[key];
  let newThread = document.createElement('div');
  newThread.classList.add('thread');
  newThread.innerHTML = `
  <h2>${thread.title}</h2>
  <p><strong>Categoría:</strong> ${thread.category}</p>
  <p>${thread.description}</p>
  `;
  threadContainer.appendChild(newThread);
  index++;
  });
  noThreadsMessage.style.display = 'none'; // Hide the "No threads yet" message
  } else {
  noThreadsMessage.style.display = 'block'; // Show the "No threads yet" message
  threadContainer.appendChild(noThreadsMessage);
  }
  createPaginationButtons(); // Create pagination buttons after loading threads
  });
  }

  // Function to create pagination buttons
  function createPaginationButtons() {
  paginationContainer.innerHTML = ''; // Clear the pagination container

  // "Previous" button
  const prevButton = document.createElement('button');
  prevButton.textContent = '« Anterior';
  prevButton.classList.add('pagination-button');
  prevButton.disabled = (currentPage === 1); // Disable if on the first page
  prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
  currentPage--;
  loadThreadsFromFirebase(currentPage);
  updatePaginationButtons();
  }
  });
  paginationContainer.appendChild(prevButton);

  // "Next" button
  const nextButton = document.createElement('button');
  nextButton.textContent = 'Siguiente »';
  nextButton.classList.add('pagination-button');
  nextButton.addEventListener('click', () => {
  currentPage++;
  loadThreadsFromFirebase(currentPage);
  updatePaginationButtons();
  });
  paginationContainer.appendChild(nextButton);
  }

  // Function to update pagination buttons based on current page
  function updatePaginationButtons() {
  const prevButton = paginationContainer.querySelector('.pagination-button:first-child');
  const nextButton = paginationContainer.querySelector('.pagination-button:last-child');
  prevButton.disabled = (currentPage === 1);
  }

  // Load threads from Firebase on page load
  loadThreadsFromFirebase(currentPage);

  // Event listener for "+ Nuevo" button click
  newThreadButton.addEventListener('click', function(event) {
  newThreadModalContent.style.display = (newThreadModalContent.style.display === 'none') ? 'block' : 'none';
  });

  // Event listener for modal close button
  closeButton.addEventListener('click', function() {
  newThreadModalContent.style.display = 'none';
  });

  // Event listener for new thread form submission
  newThreadForm.addEventListener('submit', function(event) {
  event.preventDefault();

  let category = document.getElementById('category').value;
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;

  // Create a new thread object
  let thread = {
  title: title,
  category: category,
  description: description
  };

  // Save the thread to Firebase
  saveThreadToFirebase(thread);

  // Close the modal
  newThreadModalContent.style.display = 'none';

  // Clear the form
  newThreadForm.reset();

  // Reload the threads
  loadThreadsFromFirebase(currentPage);
  });
 });