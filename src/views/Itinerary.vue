<script setup>
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import ItineraryServices from "../services/ItineraryServices";
import ItineraryDayServices from "../services/ItineraryDayServices";
import ItineraryDayCard from "../components/ItineraryDayCardComponent.vue";
import UserServices from "../services/UserServices";
import EmailServices from "../services/EmailServices";


const route = useRoute();
const router = useRouter();
const role = ref(undefined);
const user = ref(null);
const readOnly = ref(true);

const emailList = ref('');
var itinerary = ref({});
let isSubscribed = ref(false);
const isSending = ref(false);
const itineraryDays = ref([]);
const userSubscriptions = ref([]);
const site = ref([]);
const hotel = ref([]);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  if(user.value === null){
    router.push({ name: "login" });
  }
  mounted();
});

async function mounted(){
  await getItinerary();
  await getSubscriptions();
  if (user !== null) {
    itinerary.value.userId = user.id;
    role.value = user.value.role;
    if(user.value.role > 0){
      readOnly.value = false;
    }
  }
  console.log(readOnly);
}

async function getSubscriptions() {
  await UserServices.getUserSubscriptions(user.value.id)
    .then((response) => {
      userSubscriptions.value = response.data;
      isSubscribed.value = false;
      console.log(userSubscriptions.value);
      for(let i=0; i< userSubscriptions.value.length; i++){
        if(route.params.id == userSubscriptions.value[i].itineraryId){
          isSubscribed.value = true;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
async function subscribe() {
  console.log(user.value.id, route.params.id);
  await UserServices.subscribe(user.value.id, route.params.id)
    .then((response) => {
      getSubscriptions();
    })
    .catch((error) => {
      console.log(error);
    });
}

async function unsubscribe() {
  await UserServices.unsubscribe(user.value.id, route.params.id)
    .then((response) => {
      getSubscriptions();
    })
    .catch((error) => {
      console.log(error);
    });
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
async function sendEmail() {
  if(isSending.value){
    return;
  }
  isSending.value = true;
  var subject = "Itinerary for " + itinerary.value.name;
  var href = new URL(router.currentRoute.value.href, window.location.origin).href;
  var body = "Please check out this itinerary : " + href;
  await EmailServices.sendEmail(emailList.value, subject, body)
    .then((response) => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Emails Sent Successfully";
      isSending.value = false;
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.text;
      isSending.value = false;
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
          <v-card-actions class="pt-0">
            
            <v-btn 
            v-if="role == 0"
            variant="flat" color="primary"
            @click="
              isSubscribed
                ? unsubscribe()
                : subscribe()
            "
             >
             {{
              isSubscribed
                ? "Unsubscribe"
                : "Subscribe"
            }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-text-field
                  v-model="emailList"
                  label="Email List"
                  placeholder="Comma separated list of emails"
                  required
                ></v-text-field>
            <v-btn 
            v-if="role == 0"
            variant="flat" color="primary"
            @click=" sendEmail()"
             >
             {{
              isSending
                ? "Sharing Itinerary..."
                : "Share Itinerary"
            }}
            </v-btn>
          </v-card-actions>
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
            v-if="role == 0"
            variant="flat" color="primary"
            @click="
              isSubscribed
                ? unsubscribe()
                : subscribe()
            "
             >
             {{
              isSubscribed
                ? "Unsubscribe"
                : "Subscribe"
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
