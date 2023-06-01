<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import IngredientServices from "../services/IngredientServices.js";
import RecipeIngredientServices from "../services/RecipeIngredientServices";
import RecipeStepServices from "../services/RecipeStepServices";
import HotelServices from "../services/HotelServices";

const route = useRoute();
const router = useRouter();

var hotel = ref({});
let isAddHotel = ref(false);
let isEditHotel = ref(true);
const hotelDay = ref([]);
const site = ref([]);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  const user = localStorage.getItem("user");
  console.log(JSON.parse(user).id);
    
  await getHotel();
  // await getHotelDays();
  // await getHotelDaySites();
  // await getHotelDayHotel();
  // console.log(hotel);
  if (user !== null) {
    hotel.value.userId = JSON.parse(user).id;
  }
  console.log(hotel.value);
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
      setTimeout(()=> {router.push({ name: "viewhotels" });}, 5000);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getHotel();
}

function closeSnackBar() {
  snackbar.value.value = false;
}

</script>

<template>
  <v-container>
    <v-btn v-if="user !== null" class="mx-2" :to="{ name: 'home' }"> Back </v-btn>
    <br><br>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Edit Hotel
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
                  label="Maps Link"
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
