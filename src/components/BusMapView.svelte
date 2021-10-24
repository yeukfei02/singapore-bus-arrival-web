<script lang="ts">
  import axios from "axios";
  import { getRootUrl } from "../common/common";
  import { onMount } from "svelte";
  import { currentPageStore, busServiceNoStore } from "../store";

  import IconButton from "@smui/icon-button";
  import { LeafletMap, TileLayer, Marker, Popup } from "svelte-leafletjs";

  const singaporeLatitude = 1.3521;
  const singaporeLongitude = 103.8198;

  const mapOptions = {
    center: [singaporeLatitude, singaporeLongitude],
    zoom: 10,
  };
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileLayerOptions = {
    minZoom: 0,
    maxZoom: 20,
    maxNativeZoom: 19,
    attribution: "© OpenStreetMap contributors",
  };

  let leafletMap;

  let busServiceNo = "";
  let getBusServiceByBusServiceNoResult = null;

  const ROOT_URL = getRootUrl();

  busServiceNoStore.subscribe((value) => {
    console.log("value = ", value);
    if (value) {
      busServiceNo = value;
    }
  });

  onMount(async () => {
    if (busServiceNo) {
      const result = await getBusServiceByBusServiceNo(busServiceNo);
      console.log("result = ", result);
      getBusServiceByBusServiceNoResult = result;
    }
  });

  const getBusServiceByBusServiceNo = async (busServiceNo: string) => {
    let result = null;

    const response = await axios.post(
      `${ROOT_URL}`,
      {
        query: `
            query busServiceByBusServiceNo ($busServiceNo: String!) {
                busServiceByBusServiceNo (busServiceNo: $busServiceNo) {
                    serviceNo
                    operator
                    direction
                    category
                    originCode
                    originBusStop {
                        busStopCode
                        roadName
                        description
                        latitude
                        longitude
                    }
                    destinationCode
                    destinationBusStop {
                        busStopCode
                        roadName
                        description
                        latitude
                        longitude
                    }
                    amPeakFreq
                    amOffpeakFreq
                    pmPeakFreq
                    pmOffpeakFreq
                    loopDesc
                }
            }
        `,
        variables: { busServiceNo: busServiceNo },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response) {
      const responseData = response.data;
      if (responseData) {
        result = responseData.data;
      }
    }

    return result;
  };

  const handleBackButtonClick = () => {
    currentPageStore.set("nearme");
  };
</script>

<div class="container">
  <div class="container my-4">
    {#if getBusServiceByBusServiceNoResult}
      <div class="mb-2">
        <IconButton
          class="material-icons"
          title="ArrowBack"
          on:click={handleBackButtonClick}>arrow_back</IconButton
        >
      </div>
      <div class="mx-3">
        <h3>Bus Map View</h3>
      </div>

      <div class="mx-3">
        <LeafletMap bind:this={leafletMap} options={mapOptions}>
          <TileLayer url={tileUrl} options={tileLayerOptions} />
          {#each getBusServiceByBusServiceNoResult.busServiceByBusServiceNo as item}
            {#if item.direction === 1}
              {#if item.originBusStop && item.destinationBusStop}
                <Marker
                  latLng={[
                    item.originBusStop.latitude,
                    item.originBusStop.longitude,
                  ]}
                >
                  <Popup
                    >{item.originBusStop.roadName}<br />{item.originBusStop
                      .description}</Popup
                  >
                </Marker>
                <Marker
                  latLng={[
                    item.destinationBusStop.latitude,
                    item.destinationBusStop.longitude,
                  ]}
                >
                  <Popup
                    >{item.destinationBusStop.roadName}<br />{item
                      .destinationBusStop.description}</Popup
                  >
                </Marker>
              {/if}
            {/if}
          {/each}
        </LeafletMap>
      </div>
    {/if}
  </div>
</div>

<style>
</style>
