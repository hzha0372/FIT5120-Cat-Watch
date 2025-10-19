<template>
  <div style="width: 900px; margin: 50px auto">
    <h2 style="margin-bottom: 20px; text-align: center">Register</h2>

    <!-- Registration Form -->
    <form @submit.prevent="registerUser" class="program-form">
      <div class="form-row">
        <label for="email">Email:</label>
        <input id="email" type="text" v-model="email" />
      </div>
      <p v-if="emailError" class="error-text" aria-live="polite">{{ emailError }}</p>

      <div class="form-row">
        <label for="password">Password:</label>
        <input id="password" type="password" v-model="password" />
      </div>
      <p v-if="passwordError" class="error-text" aria-live="polite">{{ passwordError }}</p>

      <div class="form-row">
        <label for="role">Role:</label>
        <select id="role" v-model="role">
          <option disabled value="">Please select</option>
          <option value="teen">Teen</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <p v-if="roleError" class="error-text" aria-live="polite">{{ roleError }}</p>

      <div style="text-align: center">
        <button type="submit" class="submit-btn">Register</button>
      </div>
    </form>

    <!-- Users Table -->
    <DataTable
      :value="filteredUsers"
      paginator
      :rows="10"
      responsiveLayout="scroll"
      sortMode="single"
      class="p-datatable-gridlines"
      ref="dt"
      aria-label="Users table"
    >
      <template #header>
        <div class="text-end pb-4">
          <Button
            icon="pi pi-external-link"
            label="Export CSV"
            @click="exportCSV"
            class="mr-2"
            aria-label="Export CSV"
          />
          <Button
            icon="pi pi-file-pdf"
            label="Export PDF"
            @click="exportPDF"
            aria-label="Export PDF"
          />
        </div>
      </template>

      <Column field="email" header="Email" sortable>
        <template #header>
          <InputText
            v-model="filters.email"
            @input="applyFilters"
            placeholder="Search"
            class="p-column-filter"
            aria-label="Search Email"
          />
        </template>
      </Column>

      <Column field="password" header="Password" sortable>
        <template #header>
          <InputText
            v-model="filters.password"
            @input="applyFilters"
            placeholder="Search"
            class="p-column-filter"
            aria-label="Search Password"
          />
        </template>
      </Column>

      <Column field="role" header="Role" sortable>
        <template #header>
          <InputText
            v-model="filters.role"
            @input="applyFilters"
            placeholder="Search"
            class="p-column-filter"
            aria-label="Search Role"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import db from '@/firebase/init'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const email = ref('')
const password = ref('')
const role = ref('')
const users = ref([])
const emailError = ref('')
const passwordError = ref('')
const roleError = ref('')

const filters = reactive({ email: '', password: '', role: '' })
const filteredUsers = computed(() =>
  users.value.filter(
    (u) =>
      (!filters.email || u.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (!filters.password || u.password.includes(filters.password)) &&
      (!filters.role || u.role.toLowerCase().includes(filters.role.toLowerCase())),
  ),
)

const auth = getAuth()
const router = useRouter()

const registerUser = async () => {
  emailError.value = ''
  passwordError.value = ''
  roleError.value = ''

  if (email.value === '') emailError.value = 'Please enter your email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
    emailError.value = 'Please enter a valid email address.'

  if (password.value === '') passwordError.value = 'Please enter your password.'
  else if (password.value.length < 8)
    passwordError.value = 'Password must be at least 8 characters.'
  else if (!/[A-Z]/.test(password.value))
    passwordError.value = 'Password must contain at least one uppercase letter.'
  else if (!/[a-z]/.test(password.value))
    passwordError.value = 'Password must contain at least one lowercase letter.'

  if (role.value === '') roleError.value = 'Please select a role.'

  if (emailError.value || passwordError.value || roleError.value) {
    alert('Please correct the errors before submitting.')
    return
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email.value, password.value)

    await addDoc(collection(db, 'users'), {
      email: email.value,
      password: password.value,
      role: role.value,
      uid: userCred.user.uid,
    })

    alert(`Registered successfully as ${role.value}!`)
    email.value = ''
    password.value = ''
    role.value = ''
    await fetchUsers()
    router.push('/FireLogin')
  } catch (error) {
    console.error(error)
    alert('Register failed: ' + error.code)
  }
}

const fetchUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'users'))
    users.value = snapshot.docs.map((doc) => doc.data())
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const applyFilters = () => {}

const dt = ref(null)
const exportCSV = () => dt.value.exportCSV()
const exportPDF = () => {
  const doc = new jsPDF()
  doc.text('Registered Users Report', 14, 10)
  autoTable(doc, {
    head: [['Email', 'Password', 'Role']],
    body: filteredUsers.value.map((u) => [u.email, u.password, u.role]),
    startY: 20,
  })
  doc.save('users.pdf')
}

onMounted(fetchUsers)
</script>

<style scoped>
.program-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 30px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #fafafa;
}
.form-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.form-row label {
  width: 150px;
  text-align: right;
  font-weight: 500;
}
.form-row input,
.form-row select {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.submit-btn {
  margin-top: 10px;
  padding: 8px 24px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #0056b3;
}
.error-text {
  color: red;
  font-size: 0.9em;
  margin-left: 160px;
}
:deep(.p-column-filter) {
  width: 140px;
  margin-top: 4px;
  border-radius: 4px;
  border: 2px solid #007bff;
  background-color: #e6f0ff;
  padding: 4px 6px;
  display: block;
}
:deep(.p-column-filter:focus) {
  border-color: #0056b3;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}
</style>
