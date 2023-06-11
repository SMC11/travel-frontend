<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import HotelServices from "../services/HotelServices";

const route = useRoute();
const router = useRouter();

var hotel = ref({});
let isAddHotel = ref(true);
let isEditHotel = ref(false);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  const user = localStorage.getItem("user");
  if(user === null){
    router.push({ name: "login" });
  }
  if(JSON.parse(user).role < 1){
    router.push({ name: "home" });
  }
});

async function getHotel() {
  await HotelServices.getHotel(route.params.id)
    .then((response) => {
      hotel.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateHotel() {
  await HotelServices.updateHotel(hotel.value.id, hotel.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${hotel.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getHotel();
}

async function addHotel() {
  await HotelServices.addHotel(hotel.value).then(
    () => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${hotel.value.name} created successfully!`;
    }
  )
  .catch((error) => {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  });
  setTimeout(()=> {router.push({ name: "viewhotels" });}, 5000);
}


</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Create Hotel
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-form ref="form"
          >
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="hotel.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="hotel.address"
                  label="Address"
                ></v-text-field>
                <v-text-field
                  v-model="hotel.phone"
                  label="Phone Number"
                ></v-text-field>
                <v-text-field
                  v-model="hotel.link"
                  label="Hotel Link"
                ></v-text-field>
                <v-text-field
                  v-model="hotel.maps"
                  label="Hotel Maps Link"
                ></v-text-field>
                <v-text-field
                  v-model="hotel.photo"
                  label="Photo Link"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            
            <v-btn 
            variant="flat" color="primary"
            @click="
              isAddHotel
                ? addHotel()
                : isEditHotel
                ? updateHotel()
                : false
            "
             >
             {{
              isAddHotel
                ? "Create Hotel"
                : isEditHotel
                ? "Update Hotel"
                : ""
            }}
            </v-btn>
            
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
