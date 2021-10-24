<script lang="ts">
  import axios from "axios";
  import _ from "lodash";
  import { onMount } from "svelte";
  import { getRootUrl, getUniqueId } from "../common/common";
  import { currentPageStore, busStopCodeStore } from "../store";

  import Card, { Content, Actions } from "@smui/card";
  import IconButton, { Icon } from "@smui/icon-button";
  import Button, { Label } from "@smui/button";
  import Snackbar from "@smui/snackbar";

  const ROOT_URL = getRootUrl();
  const installationId = getUniqueId();

  let latitude = 0;
  let longitude = 0;
  let pageNumber = 1;
  const singaporeLatitude = 1.3521;
  const singaporeLongitude = 103.8198;

  let snackbar: any;
  let snackbarTitle = "";

  let getBusStopByLatLongResult = null;

  onMount(async () => {
    getUserCurrentLocation();
  });

  const getUserCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(showPosition);
  };

  const showPosition = (position: any) => {
    if (position && position.coords) {
      console.log("latitude = ", position.coords.latitude);
      console.log("longitude = ", position.coords.longitude);
      if (
        _.inRange(
          position.coords.latitude,
          singaporeLatitude - 0.05,
          singaporeLatitude + 0.05
        ) &&
        _.inRange(
          position.coords.longitude,
          singaporeLongitude - 0.05,
          singaporeLongitude + 0.05
        )
      ) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } else {
        latitude = singaporeLatitude;
        longitude = singaporeLongitude;
      }
    } else {
      latitude = singaporeLatitude;
      longitude = singaporeLongitude;
    }

    if (latitude != 0 && longitude != 0) {
      const result = getBusStopByLatLong(latitude, longitude, pageNumber);
      console.log("result = ", result);
      getBusStopByLatLongResult = result;
    }
  };

  const getBusStopByLatLong = async (
    latitude: number,
    longitude: number,
    pageNumber: number
  ) => {
    let result = null;

    const response = await axios.post(
      `${ROOT_URL}`,
      {
        query: `
                    query busStopByLatLong ($latitude: Float!, $longitude: Float!, $pageNumber: Int!) {
                        busStopByLatLong (latitude: $latitude, longitude: $longitude, pageNumber: $pageNumber) {
                            busStopCode
                            roadName
                            description
                            latitude
                            longitude
                        }
                    }
                `,
        variables: {
          latitude: latitude,
          longitude: longitude,
          pageNumber: pageNumber,
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

  const addFavourites = async (installationId: string, item: any) => {
    let result = null;

    const response = await axios.post(
      `${ROOT_URL}`,
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

  const handleShowMoreButtonClick = () => {
    pageNumber += 1;

    if (latitude != 0 && longitude != 0) {
      const result = getBusStopByLatLong(latitude, longitude, pageNumber);
      console.log("result = ", result);
      getBusStopByLatLongResult = result;
    }
  };

  const handleCloseButtonClick = () => {
    snackbar.close();
  };
</script>

<div class="container">
  {#if getBusStopByLatLongResult}
    {#await getBusStopByLatLongResult}
      <div class="container">
        <div class="alert alert-warning" role="alert">Loading...</div>
      </div>
    {:then data}
      {#if data.data.busStopByLatLong}
        {#each data.data.busStopByLatLong as item, i}
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

        <div class="container my-4">
          <Button
            class="w-100 mb-4"
            on:click={handleShowMoreButtonClick}
            variant="raised"><Label>Show more</Label></Button
          >
        </div>
      {/if}
    {/await}
  {:else}
    <div class="container">
      <div class="alert alert-secondary" role="alert">There is no data</div>
    </div>
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
