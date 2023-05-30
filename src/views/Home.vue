<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ItineraryCard from "../components/ItineraryCardComponent.vue";
import ItineraryServices from "../services/ItineraryServices.js";

const router = useRouter();
const itineraries = ref([]);
const itinerariesList = [ref([]), ref([]), ref([])];

const isAdd = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newItinerary = ref({
  name: "",
  description: "",
  servings: 0,
  time: "30",
  isPublished: false,
});

onMounted(async () => {
  mounted();
});

async function mounted(){
  itinerariesList[0].value = [];
  itinerariesList[1].value = [];
  itinerariesList[2].value = [];
  await getItineraries();
  user.value = JSON.parse(localStorage.getItem("user"));
  // console.log(user.value);
  if(user.value === null){
    router.push({ name: "login" });
  }
}

async function getItineraries() {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value !== null && user.value.id !== null) {
    await ItineraryServices.getItinerariesByUserId(user.value.id)
      .then((response) => {
        itineraries.value = response.data;
        for(let i = 0; i < response.data.length; i++){
          let index = i%3;
          itinerariesList[index].value.push(response.data[i]);
        }
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } else {
    await ItineraryServices.getItineraries()
      .then((response) => {
        itineraries.value = response.data;
        for(let i = 0; i < response.data.length; i++){
          let index = i%3;
          itinerariesList[index].value.push(response.data[i]);
        }
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }
}


async function deleteItinerary(itineraryId) {
  await ItineraryServices.deleteItinerary(itineraryId)
  .then((response) => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = response.data.message;
      mounted();
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}


function openAdd() {
  router.push({ name: "createitinerary" });
}

function closeAdd() {
//  isAdd.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Itineraries For Destinations
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >Create Itinerary</v-btn
          >
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="4">
      <ItineraryCard
        v-for="itinerary in itinerariesList[0].value"
        :key="itinerary.id"
        :itinerary="itinerary"
        @delete-itinerary="deleteItinerary"
      />
    </v-col>
    
        <v-col cols="4">
      <ItineraryCard
        v-for="itinerary in itinerariesList[1].value"
        :key="itinerary.id"
        :itinerary="itinerary"
        @delete-itinerary="deleteItinerary"
      />
    </v-col>
    
        <v-col cols="4">
      <ItineraryCard
        v-for="itinerary in itinerariesList[2].value"
        :key="itinerary.id"
        :itinerary="itinerary"
        @delete-itinerary="deleteItinerary"
      />
    </v-col>
    </v-row>

      <v-row align="center" class="mb-4">
        <v-col cols="10"
          >
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >Create Itinerary</v-btn
          >
        </v-col>
      </v-row>
      
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
