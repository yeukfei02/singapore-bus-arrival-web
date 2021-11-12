<script lang="ts">
  import axios from "axios";
  import { getRootUrl, getUniqueId } from "../helpers/helpers";
  import { currentPageStore, busStopCodeStore } from "../store";

  import Card, { Content, Actions } from "@smui/card";
  import IconButton, { Icon } from "@smui/icon-button";
  import Button, { Label } from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text/index";
  import Snackbar from "@smui/snackbar";

  const rootUrl = getRootUrl();
  const installationId = getUniqueId();

  let roadName = "";
  let place = "";

  let getBusStopByRoadNameResult = null;
  let getBusStopByDescriptionResult = null;

  let snackbar: any;
  let snackbarTitle = "";

  const getBusStopByRoadName = async (roadName: string) => {
    let result = null;

    const response = await axios.post(
      `${rootUrl}`,
      {
        query: `
                    query busStopByRoadName ($roadName: String!) {
                        busStopByRoadName (roadName: $roadName) {
                            busStopCode
                            roadName
                            description
                            latitude
                            longitude
                        }
                    }
                `,
        variables: { roadName: roadName },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      result = response.data;
    }

    return result;
  };

  const getBusStopByDescription = async (place: string) => {
    let result = null;

    const response = await axios.post(
      `${rootUrl}`,
      {
        query: `
                    query busStopByDescription ($description: String!) {
                        busStopByDescription (description: $description) {
                            busStopCode
                            roadName
                            description
                            latitude
                            longitude
                        }
                    }
                `,
        variables: { description: place },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      result = response.data;
    }

    return result;
  };

  const addFavourites = async (installationId: string, item: any) => {
    let result = null;

    const response = await axios.post(
      `${rootUrl}`,
      {
        query: `
                    mutation addFavourites ($data: AddFavourites!) {
                        addFavourites (data: $data) {
                            status
                        }
                    }
                `,
        variables: {
          data: {
            installationId: installationId,
            item: item,
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      result = response.data;
    }

    return result;
  };

  const handleRoadNameInputChange = (e: any) => {
    if (e.target.value) {
      roadName = e.target.value;
      place = "";
    }
  };

  const handlePlaceInputChange = (e: any) => {
    if (e.target.value) {
      place = e.target.value;
      roadName = "";
    }
  };

  const handleSumbitButtonClick = () => {
    getBusStopByRoadNameResult = null;
    getBusStopByDescriptionResult = null;

    console.log("roadName = ", roadName);
    if (roadName && roadName.length > 3) {
      const result = getBusStopByRoadName(roadName);
      console.log("result = ", result);
      getBusStopByRoadNameResult = result;
    }

    console.log("place = ", place);
    if (place && place.length > 3) {
      const result = getBusStopByDescription(place);
      console.log("result = ", result);
      getBusStopByDescriptionResult = result;
    }
  };

  const handleBusStopCodeClick = (busStopCode: string) => {
    currentPageStore.set("busArrivalDetails");
    busStopCodeStore.set(busStopCode);
  };

  const handleOpenInMapClick = (latitude: number, longitude: number) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    );
  };

  const handleAddFavourites = (installationId: string, item: any) => {
    const result = addFavourites(installationId, item);
    console.log("result = ", result);

    if (result) {
      snackbarTitle = "Add favourites success!";
      snackbar.open();
    }
  };

  const handleCloseButtonClick = () => {
    snackbar.close();
  };
</script>

<div class="container">
  <Card>
    <Content>
      <div>
        <Textfield
          class="w-100"
          variant="outlined"
          bind:value={roadName}
          on:change={handleRoadNameInputChange}
          label="Roadname"
          input$aria-controls="helper-text-outlined-a"
          input$aria-describedby="helper-text-outlined-a"
        />
        <HelperText id="helper-text-outlined-a">Roadname</HelperText>
      </div>
      <div>
        <Textfield
          class="w-100"
          variant="outlined"
          bind:value={place}
          on:change={handlePlaceInputChange}
          label="Place"
          input$aria-controls="helper-text-outlined-a"
          input$aria-describedby="helper-text-outlined-a"
        />
        <HelperText id="helper-text-outlined-a">Place</HelperText>
      </div>
      <Actions>
        <Button
          class="w-100"
          on:click={handleSumbitButtonClick}
          variant="raised"><Label>Submit</Label></Button
        >
      </Actions>
    </Content>
  </Card>

  {#if getBusStopByRoadNameResult}
    {#await getBusStopByRoadNameResult}
      <div class="container my-4">
        <div class="alert alert-warning" role="alert">Loading...</div>
      </div>
    {:then data}
      {#if data.data.busStopByRoadName}
        {#each data.data.busStopByRoadName as item}
          <div class="container my-4">
            <Card>
              <Content>
                <div class="my-2" style="font-size: 1.5em; font-weight: bold;">
                  {item.description}
                </div>
                <div class="my-2" style="font-size: 1.2em; font-weight: bold;">
                  {item.roadName}
                </div>
                <div class="my-2" style="font-size: 1.2em;">
                  Bus Stop Code: <span
                    class="hoverItem"
                    style="font-size: 1.2em; color: red; text-decoration: underline;"
                    on:click={() => handleBusStopCodeClick(item.busStopCode)}
                    >{item.busStopCode}</span
                  >
                </div>
                <span
                  class="hoverItem my-2"
                  style="color: blue; text-decoration: underline;"
                  on:click={() =>
                    handleOpenInMapClick(item.latitude, item.longitude)}
                  >Open in map</span
                >
              </Content>
              <Actions>
                <IconButton
                  on:click={() => handleAddFavourites(installationId, item)}
                  toggle
                  aria-label="Add to favorites"
                  title="Add to favorites"
                >
                  <Icon class="material-icons" on>favorite</Icon>
                  <Icon class="material-icons">favorite_border</Icon>
                </IconButton>
              </Actions>
            </Card>
          </div>
        {/each}
      {/if}
    {/await}
  {/if}

  {#if getBusStopByDescriptionResult}
    {#await getBusStopByDescriptionResult}
      <div class="container my-4">
        <div class="alert alert-warning" role="alert">Loading...</div>
      </div>
    {:then data}
      {#if data.data.busStopByDescription}
        {#each data.data.busStopByDescription as item}
          <div class="container my-4">
            <Card>
              <Content>
                <div class="my-2" style="font-size: 1.5em; font-weight: bold;">
                  {item.description}
                </div>
                <div class="my-2" style="font-size: 1.2em; font-weight: bold;">
                  {item.roadName}
                </div>
                <div class="my-2" style="font-size: 1.2em;">
                  Bus Stop Code: <span
                    class="hoverItem"
                    style="font-size: 1.2em; color: red; text-decoration: underline;"
                    on:click={() => handleBusStopCodeClick(item.busStopCode)}
                    >{item.busStopCode}</span
                  >
                </div>
                <span
                  class="hoverItem my-2"
                  style="color: blue; text-decoration: underline;"
                  on:click={() =>
                    handleOpenInMapClick(item.latitude, item.longitude)}
                  >Open in map</span
                >
              </Content>
              <Actions>
                <IconButton
                  on:click={() => handleAddFavourites(installationId, item)}
                  toggle
                  aria-label="Add to favorites"
                  title="Add to favorites"
                >
                  <Icon class="material-icons" on>favorite</Icon>
                  <Icon class="material-icons">favorite_border</Icon>
                </IconButton>
              </Actions>
            </Card>
          </div>
        {/each}
      {/if}
    {/await}
  {/if}

  <Snackbar bind:this={snackbar}>
    <Label>{snackbarTitle}</Label>
    <Actions>
      <Button on:click={handleCloseButtonClick}>Close</Button>
    </Actions>
  </Snackbar>
</div>

<style>
</style>
