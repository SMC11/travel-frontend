<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ItineraryCard from "../components/ItineraryCardComponent.vue";
import ItineraryServices from "../services/ItineraryServices.js";

const router = useRouter();
const itineraries = ref([]);
const itinerariesList = [ref([]), ref([]), ref([])];
const subscribedItinerariesList = [ref([]), ref([]), ref([])];

const role = ref(0);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  mounted();
});

async function mounted(){
  itinerariesList[0].value = [];
  itinerariesList[1].value = [];
  itinerariesList[2].value = [];
  subscribedItinerariesList[0].value = [];
  subscribedItinerariesList[1].value = [];
  subscribedItinerariesList[2].value = [];
  await getItineraries();
  user.value = JSON.parse(localStorage.getItem("user"));
  role.value = user.value.role;
  // console.log(user.value);
  if(user.value === null){
    router.push({ name: "login" });
  }
}

async function getItineraries() {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value !== null && user.value.id !== null && user.value.role > 0) {
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
  if (user.value !== null && user.value.id !== null && user.value.role == 0) {
    await ItineraryServices.getItinerariesByUserId(user.value.id)
      .then((response) => {
        for(let i = 0; i < response.data.length; i++){
          let index = i%3;
          subscribedItinerariesList[index].value.push(response.data[i]);
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

function navigateToItinerary(itineraryId) {
  router.push({ name: "itinerary", params: {id: itineraryId} });
}


function openAdd() {
  router.push({ name: "createitinerary" });
}

function viewHotels() {
  router.push({ name: "viewhotels" });
}
function viewSites() {
  router.push({ name: "viewsites" });
}

function closeSnackBar() {
  snackbar.value.value = false;
}

</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="6"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Itineraries For Destinations
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && role > 0" color="accent" @click="openAdd()"
            >Create Itinerary</v-btn
          >
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && role > 0" color="accent" @click="viewHotels()"
            >View Hotels</v-btn
          >
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && role > 0" color="accent" @click="viewSites()"
            >View Sites</v-btn
          >
        </v-col>
      </v-row>
      <v-row class="mb-4">
        <v-col cols="4">
      <ItineraryCard
        v-for="itinerary in itinerariesList[0].value"
        :key="itinerary.id"
        :itinerary="itinerary"
        @click="navigateToItinerary(itinerary.id)"
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
          <v-card-title v-if="user !== null && role == 0" class="pl-0 text-h4 font-weight-bold"
            >Subscribed Itineraries
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && role > 0" color="accent" @click="openAdd()"
            >Create Itinerary</v-btn
          >
        </v-col>
      </v-row>
      <v-row v-if="user !== null && role == 0" class="mb-4">
        <v-col cols="4">
      <ItineraryCard
        v-for="itinerary in subscribedItinerariesList[0].value"
        :key="itinerary.id"
        :itinerary="itinerary"
        @click="navigateToItinerary(itinerary.id)"
      />
    </v-col>
    
        <v-col cols="4">
      <ItineraryCard
        v-for="itinerary in subscribedItinerariesList[1].value"
        :key="itinerary.id"
        :itinerary="itinerary"
        @click="navigateToItinerary(itinerary.id)"
      />
    </v-col>
    
        <v-col cols="4">
      <ItineraryCard
        v-for="itinerary in subscribedItinerariesList[2].value"
        :key="itinerary.id"
        :itinerary="itinerary"
        @click="navigateToItinerary(itinerary.id)"
      />
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
