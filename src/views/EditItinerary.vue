<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import ItineraryServices from "../services/ItineraryServices";
import EmailServices from "../services/EmailServices";
import ItineraryDayServices from "../services/ItineraryDayServices";
import ItineraryDayCard from "../components/ItineraryDayCardComponent.vue";


const route = useRoute();
const router = useRouter();
const role = ref(0);
const user = ref(null);
const readOnly = ref(true);

var itinerary = ref({});
let isAddItinerary = ref(false);
let isEditItinerary = ref(true);
const itineraryDays = ref([]);
const site = ref([]);
const hotel = ref([]);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if(user.value === null){
    router.push({ name: "login" });
  }
  mounted();
});

async function mounted(){
  await getItinerary();
  if (user !== null) {
    itinerary.value.userId = user.id;
    if(user.value.role > 0){
      readOnly.value = false;
    }else{
      router.push({ name: "itinerary", params: {id: route.params.id} });
    }
  }
}

async function getItinerary() {
  await ItineraryServices.getItinerary(route.params.id)
    .then((response) => {
      itinerary.value = response.data[0];
      itineraryDays.value = itinerary.value.itineraryDay;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addItineraryDay(){

  router.push({ name: "addItineraryDay", params: {id: route.params.id} });
}

async function updateItinerary() {
  await ItineraryServices.updateItinerary(itinerary.value.id, itinerary.value)
    .then(() => {
      sendEmail(itinerary.value.id);
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
async function sendEmail(itineraryId) {
  await ItineraryServices.getItinerary(itineraryId)
    .then((response) => {
      var updatedItinerary = response.data[0];
      var subscribers = updatedItinerary.subscription.map(sub => {return sub.user;});
      var subscriberEmails = subscribers.map(user => {return user.email;});
      if(subscriberEmails.length == 0){
        return;
      }
      var emailList = subscriberEmails.join(",");
      var subject = "Updated Itinerary for " + updatedItinerary.name;
      var href = new URL(router.currentRoute.value.href, window.location.origin).href;
      var body = "An itinerary you subscribed to has been updated. Please check out the changes made to it at : <a href=\""+href+"\">"+updatedItinerary.name+"</a>";
      EmailServices.sendEmail(emailList, subject, body)
        .then((response) => {
          snackbar.value.value = true;
          snackbar.value.color = "green";
          snackbar.value.text = "Emails Sent Successfully";
          setTimeout(()=> {return;}, 2000);
        })
        .catch((error) => {
          console.log(JSON.stringify(error));
          snackbar.value.value = true;
          snackbar.value.color = "error";
          snackbar.value.text = error.text;
        });
    })
    .catch((error) => {
      console.log(error);
    });
  
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

async function deleteItineraryDay(itineraryId, itineraryDayId) {
  await ItineraryDayServices.deleteItineraryDay(itineraryId, itineraryDayId)
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
          >{{ readOnly?"View ":"Edit " }}  Itinerary
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-form ref="form"
          :readonly="readOnly"
          >
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="itinerary.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.number="itinerary.duration"
                  label="Duration"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="itinerary.durationType"
                  label="Duration Type (M - Months/ d - days/ h - hours)"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="itinerary.description"
                  rows="10"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
              <ItineraryDayCard
                v-for="itineraryDay in itineraryDays"
                :key="itineraryDay.id"
                :itineraryDay="itineraryDay"
                @delete-itinerary-day="deleteItineraryDay"
              />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            
            <v-btn 
            variant="flat" color="primary"
            @click="
              isAddItinerary
                ? addItinerary()
                : isEditItinerary
                ? updateItinerary()
                : false
            "
             >
             {{
              isAddItinerary
                ? "Create Itinerary"
                : isEditItinerary
                ? "Update Itinerary"
                : ""
            }}
            </v-btn>
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
