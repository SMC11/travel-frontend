<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import Login from "../services/login.js";

const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    router.push({ name: "home" });
  }
  Login.data();
});

function navigateToHome() {
  router.push({ name: "home" });
}

async function createAccount() {
  await UserServices.addUser(user.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Account created successfully!";
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function login() {
  console.log(user.value);
  await UserServices.loginUser(user)
    .then((data) => {
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Login successful!";
      router.push({ name: "home" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
  router.push({ name: "login" });
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Sign Up</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="user.firstName"
              label="First Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.lastName"
              label="Last Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.phoneNumber"
              label="Phone Number"
              required
            ></v-text-field>

            <v-text-field
              v-model="user.email"
              label="Email"
              required
            ></v-text-field>

            <v-text-field
                v-model="user.password"
                label="Password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show1 ? 'text' : 'password'"
                counter
                @click:append="show1 = !show1"
            ></v-text-field>
            <v-text-field
                v-model="password"
                label="Confirm Password"
                :type="password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="closeCreateAccount()"
              >Go To Login</v-btn
            >
            <v-btn variant="flat" color="primary" @click="createAccount()"
              >Sign Up</v-btn
            >
          </v-card-actions>
        </v-card>

      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>