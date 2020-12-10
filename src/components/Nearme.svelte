<script>
    import axios from 'axios';
    import _ from 'lodash';
    import { onMount } from 'svelte';
    import { getRootUrl } from '../common/common.js';

    const ROOT_URL = getRootUrl();

    let latitude = 0;
    let longitude = 0;
    const singaporeLatitude = 1.3521;
    const singaporeLongitude = 103.8198;

    let getBusStopByLatLongResult = null;

    const getUserCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    const showPosition = (position) => {
        if (position && position.coords) {
            console.log('latitude = ', position.coords.latitude);
            console.log('longitude = ', position.coords.longitude);
            if (
                _.inRange(position.coords.latitude, singaporeLatitude - 3, singaporeLatitude + 3) &&
                _.inRange(position.coords.longitude, singaporeLongitude - 3, singaporeLongitude + 3)
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
            const result = getBusStopByLatLong(latitude, longitude);
            console.log('result = ', result);
            getBusStopByLatLongResult = result;
        }
    }

    const getBusStopByLatLong = async (latitude, longitude) => {
        let result = null;

        const response = await axios.post(`${ROOT_URL}`, 
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
                variables: { latitude: latitude, longitude: longitude, pageNumber: 1 }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        if (response) {
            result = response.data;
        }

        return result;
    }

    const getBusArrival = async (busStopCode) => {
        let result = null;

        const response = await axios.post(`${ROOT_URL}`, 
            { 
                query: `
                    query busArrival ($busStopCode: String!) {
                        busArrival (busStopCode: $busStopCode) {
                            busStopCode
                            services {
                                busNumber
                                operator
                                nextBus {
                                    estimatedArrival
                                    latitude
                                    longitude
                                    load
                                    feature
                                    type
                                }
                            }
                        }
                    }
                `,
                variables: { busStopCode: busStopCode }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        if (response) {
            result = response.data;
        }

        return result;
    }

    onMount(async () => {
        getUserCurrentLocation();
    });

    const handleBusStopCodeClick = (busStopCode) => {
        if (busStopCode) {
            const result = getBusArrival(busStopCode);
            console.log('result = ', result);
        }
    }

    const handleOpenInMapClick = (latitude, longitude) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    }
</script>

<style>
    .viewContainer {
        max-width: 65em;
    }

    .descriptionText {
        font-size: 25;
        font-weight: bold;
    }

    .roadNameText {
        font-size: 20;
        font-weight: bold;
    }
    
    .busStopCodeText {
        font-size: 28;
    }

    .busStopCodeResultText {
        font-size: 28;
        color: red;
        text-decoration: underline;
    }

    .openInMapText {
        color: blue;
        text-decoration: underline;
    }
</style>

<div class="container viewContainer">
    {#if getBusStopByLatLongResult}
        {#await getBusStopByLatLongResult}
            <div class="container">
                <div class="alert alert-warning" role="alert">
                    Loading...
                </div>
            </div>
        {:then data} 
            {#if data.data.busStopByLatLong}
                {#each data.data.busStopByLatLong as item, i }
                    <div class="container my-4">
                        <div class="card">
                            <div class="card-body">
                                <div class="descriptionText my-2">{item.description}</div>
                                <div class="roadNameText my-2">{item.roadName}</div>
                                <div class="busStopCodeText my-2">Bus Stop Code: <span class="busStopCodeResultText hoverItem" on:click={() => handleBusStopCodeClick(item.busStopCode)}>{item.busStopCode}</span></div>
                                <span class="openInMapText hoverItem my-2" on:click={() => handleOpenInMapClick(item.latitude, item.longitude)}>Open in map</span>
                            </div>
                        </div>
                    </div>
                {/each}
            {/if}
        {/await}
    {:else}
        <div class="container">
            <div class="alert alert-secondary" role="alert">
                There is no data
            </div>
        </div>
    {/if}
</div>