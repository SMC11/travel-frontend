<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import ItineraryServices from "../services/ItineraryServices";
import HotelServices from "../services/HotelServices";
import SiteServices from "../services/SiteServices";

const route = useRoute();
const router = useRouter();
const role = ref(0);
const user = ref(null);
var itinerary = ref({});
let isAddItinerary = ref(false);
let isEditItinerary = ref(true);
const selectedHotel = ref(undefined);
const selectedSite = ref(undefined);
const itineraryDay = ref([]);
const sites = ref([]);
const itineraryDaySites = ref([]);
const hotels = ref([]);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));

  await getItinerary();
  await getSites();
  await getHotels();
  if (user !== null) {
    itinerary.value.userId = user.id;
  }
  console.log(itinerary.value);
});

async function getItinerary() {
  await ItineraryServices.getItinerary(route.params.id)
    .then((response) => {
      itinerary.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getHotels() {
  await HotelServices.getHotels()
    .then((response) => {
      hotels.value = response.data;
      console.log(hotels);
    })
    .catch((error) => {
      console.log(error);
    });
}
async function getSites() {
  await SiteServices.getSites()
    .then((response) => {
      sites.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function addItineraryDay(){
  router.push({ name: "edititinerary", params: {id:route.params.id} });
}

async function addSiteToItineraryDay(){
    itineraryDaySites.value.push(selectedSite.value);
    console.log(itineraryDaySites);
    // await ItineraryServices.updateItinerary(itinerary.value.id, itinerary.value)
    // .then(() => {
    //   snackbar.value.value = true;
    //   snackbar.value.color = "green";
    //   snackbar.value.text = `${itinerary.value.name} updated successfully!`;
    //   setTimeout(()=> {router.push({ name: "home" });}, 5000);
    // })
    // .catch((error) => {
    //   console.log(error);
    //   snackbar.value.value = true;
    //   snackbar.value.color = "error";
    //   snackbar.value.text = error.response.data.message;
    // });
}

async function updateItinerary() {
  await ItineraryServices.updateItinerary(itinerary.value.id, itinerary.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${itinerary.value.name} updated successfully!`;
      setTimeout(()=> {router.push({ name: "home" });}, 5000);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getItinerary();
}

async function addItinerary() {
  await ItineraryServices.addItinerary(itinerary.value).then(
    () => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${itinerary.value.name} created successfully!`;
      setTimeout(()=> {router.push({ name: "home" });}, 5000);
    }
  )
  .catch((error) => {
    console.log(error);
    snackbar.value.value = true;
    snackbar.value.color = "error";
    snackbar.value.text = error.response.data.message;
  });
}

function closeSnackBar() {
  snackbar.value.value = false;
}

</script>

<template>
  <v-container>
    <v-btn v-if="user !== null" class="mx-2" @click="router.go(-1)"> Back </v-btn>
    <br><br>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Add Day to Itinerary
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
                  v-model.date="itineraryDay.dayOfEvent"
                  label="Day Of Event"
                  type="date"
                ></v-text-field>
                </v-col>
              <v-col>
                <v-autocomplete
            v-model="selectedHotel"
            :items="hotels"
            item-title="name"
            item-value="id"
            label="Select Hotel for the Day"
            placeholder="Search Hotel"
            persistent-hint
            return-object
            auto-select-first
            hide-selected
            clearable
          ></v-autocomplete>
               
              </v-col>
              
            </v-row>
            
            <!-- Selected Sites -->
           
            <v-row>
                <v-table>
                    <tbody>
                <tr v-for="site in itineraryDaySites" :key="site.id">
                  <td><a :href=site.link>{{ site.name }}</a></td>
                  <td>{{ site.duration }}</td>
                  <td>{{ site.address }}</td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditSite(site)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteSite(site)"
                    >
                    </v-icon>
                  </td>
                </tr>
              </tbody>
                </v-table>
            </v-row>
            <v-row>
                <v-col>
                    <v-autocomplete
            v-model="selectedSite"
            :items="sites"
            item-title="name"
            item-value="id"
            label="Select Site for the Day"
            placeholder="Search Sites"
            persistent-hint
            return-object
            auto-select-first
            hide-selected
            clearable
          ></v-autocomplete>
              </v-col>
              <v-col>
                <v-btn 
            variant="flat" color="primary"
            @click="addSiteToItineraryDay()"
             >Add Site
            </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn 
            variant="flat" color="primary"
            @click="addItineraryDay()"
             >Add Day To Itinerary
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
