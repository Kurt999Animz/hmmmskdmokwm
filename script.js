function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))
}
//premade student
const students = [
  { name: "Yui Hirasawa", age: 16, club: "Light Music Club", pic: "images/ids/yui.webp" },
  { name: "Mio Akiyama", age: 16, club: "Light Music Club", pic: "images/ids/mio.webp" },
  { name: "Ritsu Tainaka", age: 16, club: "Light Music Club", pic: "images/ids/ritsu.webp" },
  { name: "Tsumugi Kotobuki", age: 16, club: "Light Music Club", pic: "images/ids/mugi.webp" },
  { name: "Azusa Nakano", age: 15, club: "Light Music Club", pic: "images/ids/azusa.webp" },
];

let selectedName = null;
const listEl = document.getElementById("studentList");
const detailsEl = document.getElementById("details");
const preview = document.getElementById("previewCard");

//student list
function renderList(){
  listEl.innerHTML = '';
  students.forEach(s => {
    const li = document.createElement('li');
    li.className = 'student-item';
    li.dataset.name = s.name;
    li.innerHTML = `
      <div class="student-thumb"><img src="${s.pic}" onerror="this.src='https://via.placeholder.com/120x120?text=No+Img'"></div>
      <div class="student-meta">
        <div class="name">${escapeHtml(s.name)}</div>
        <div class="club">${escapeHtml(s.club)}</div>
      </div>
    `;
    li.addEventListener("mouseenter", e=>showPreview(e,s));
    li.addEventListener("mousemove", e=>movePreview(e));
    li.addEventListener("mouseleave", hidePreview);
    li.addEventListener("click", ()=>selectStudent(s.name));
    listEl.appendChild(li);
  });
}

function showPreview(e, s){
  preview.style.display = 'block';
  preview.querySelector('img').src = s.pic;
  preview.querySelector('.pn').textContent = s.name;
  preview.querySelector('.pd').textContent = `${s.age} • ${s.club}`;
  movePreview(e);
}
function movePreview(e){
  let x = e.clientX + 18;
  let y = e.clientY + 20;
  const rect = preview.getBoundingClientRect();
  if(x + rect.width > window.innerWidth) x = window.innerWidth - rect.width - 12;
  if(y + rect.height > window.innerHeight) y = window.innerHeight - rect.height - 12;
  preview.style.left = x+'px';
  preview.style.top = y+'px';
}
function hidePreview(){ preview.style.display = 'none'; }

function selectStudent(name){
  const s = students.find(x => x.name === name);
  if(!s) return;
  selectedName = name;
  detailsEl.innerHTML = `
    <div class="id-picture"><img src="${s.pic}" onerror="this.src='https://via.placeholder.com/280x180?text=No+Image'"></div>
    <div class="id-info">
      <div class="fullname">${escapeHtml(s.name)}</div>
      <div>
        <div>Age: <strong>${s.age}</strong></div>
        <div>Club: <strong>${escapeHtml(s.club)}</strong></div>
      </div>
      <div class="id-actions">
        <button class="delete-btn" onclick="deleteStudent('${s.name}')">Delete student</button>
      </div>
    </div>
  `;
}

function deleteStudent(name){
  const idx = students.findIndex(s => s.name === name);
  if(idx === -1) return;
  if(confirm(`Delete ${students[idx].name}?`)){
    students.splice(idx,1);
    if(selectedName === name){
      detailsEl.innerHTML = '<div style="color:#9a9a9a">Student removed. Click a student to display their ID card here.</div>';
      selectedName = null;
    }
    renderList();
  }
}

document.getElementById("studentForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const age = Number(document.getElementById("age").value);
  const club = document.getElementById("club").value.trim();
  const fileInput = document.getElementById("picFile");
  let pic = 'images/ids/placeholder.jpg';
  if(fileInput.files[0]){
    pic = URL.createObjectURL(fileInput.files[0]);
  }
  if(!name || !age || !club) return alert("Fill all fields!");
  const newStudent = { name, age, club, pic };
  students.push(newStudent);
  renderList();
  selectStudent(newStudent.name);
  e.target.reset();
});

document.getElementById("clearForm").addEventListener("click", ()=>document.getElementById("studentForm").reset());

renderList();
