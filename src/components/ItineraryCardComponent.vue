<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeIngredientServices from "../services/RecipeIngredientServices.js";
import RecipeStepServices from "../services/RecipeStepServices";

const router = useRouter();

const showDetails = ref(false);
const recipeIngredients = ref([]);
const recipeSteps = ref([]);
const user = ref(null);

const props = defineProps({
  itinerary: {
    required: true,
  },
});

onMounted(async () => {
  await getRecipeIngredients();
  await getRecipeSteps();
  user.value = JSON.parse(localStorage.getItem("user"));
});

function getItineraryDurationType(durationType) {
  switch(durationType){
    case "M":
      return "Months";
    case "d":
      return "Days";
    case "h":
      return "Hours";
    case "m":
      return "Minutes";
  }
}

function getDescription(desc) {
  return (desc.length > 100) ? desc.slice(0, 100-1) + '...' : desc;
}

function onCreateItinerary() {
  router.push({name: "home"});
}
async function getRecipeIngredients() {
  await RecipeIngredientServices.getRecipeIngredientsForRecipe(props.itinerary.id)
    .then((response) => {
      recipeIngredients.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getRecipeSteps() {
  await RecipeStepServices.getRecipeStepsForRecipeWithIngredients(
    props.itinerary.id
  )
    .then((response) => {
      recipeSteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function navigateToEdit() {
  router.push({ name: "edititinerary", params: { id: props.itinerary.id } });
}
</script>

<template>
  <v-card 
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ itinerary.name }}
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ itinerary.duration }} {{ getItineraryDurationType(itinerary.durationType) }}
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ getDescription(itinerary.description) }}
    </v-card-text>
    
  </v-card>
</template>
