<script>
    import axios from 'axios';
    import moment from 'moment';
    import { getRootUrl } from '../common/common.js';
    import { onMount } from "svelte";
    import { currentPageStore, busStopCodeStore } from "../store.js";

    import Card, { Content } from '@smui/card';
    import IconButton from '@smui/icon-button';
    
    let busStopCode = '';
    let getBusArrivalResult = null;

    const ROOT_URL = getRootUrl();

    busStopCodeStore.subscribe((value) => {
        console.log('value = ', value);

        if (value) {
            busStopCode = value;
        }
    });

    onMount(async () => {
        if (busStopCode) {
            const result = getBusArrival(busStopCode);
            console.log('result = ', result);
            getBusArrivalResult = result;
        }
    });

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

    const handleBackButtonClick = () => {
        currentPageStore.set('nearme');
    }

    const handleCheckBusInMapClick = (latitude, longitude) => {
        window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    }
</script>

<style>
    
</style>

<div class="container">
    {#if getBusArrivalResult}
        {#await getBusArrivalResult}
            <div class="container my-4">
                <div class="alert alert-warning" role="alert">
                    Loading...
                </div>
            </div>
        {:then data } 
            <div class="container my-4">
                <div class="mb-2">
                    <IconButton class="material-icons" title="ArrowBack" on:click={handleBackButtonClick}>arrow_back</IconButton>
                </div>
                <div class="mx-3">
                    <h3>Bus Arrival Details</h3>
                </div>
                {#each data.data.busArrival.services as item, i }
                    <div class="container my-4">
                        <Card>
                            <Content>
                                <div class="my-2" style="font-size: 1.5em; font-weight: bold;">{item.busNumber}</div>
                                <div class="my-2" style="font-size: 1.2em;">{item.operator}</div>
                                {#each item.nextBus as nextBusItem, i }
                                    <div class="container my-4">
                                        <Card class="p-3">
                                            <div style="font-size: 1.1em; font-weight: bold;">Next {i + 1} Bus</div>
                                            <div class="my-2" style="font-size: 1.2em;">Remaining: <span style="font-weight: bold;">{isNaN(moment(nextBusItem.estimatedArrival).diff(moment(), 'minutes')) ? Math.abs(0) : Math.abs(moment(nextBusItem.estimatedArrival).diff(moment(), 'minutes'))} minutes</span></div>
                                            
                                            {#if nextBusItem.load.includes('Seats Available') }
                                                <div class="d-flex flex-row my-2">
                                                    <div 
                                                        style="
                                                            height: 2em;
                                                            width: 2em;
                                                            background-color: greenyellow;
                                                            border-radius: 50%;
                                                            display: inline-block;
                                                        "
                                                    ></div>
                                                    <div class="d-flex align-items-center mx-2">{nextBusItem.load}</div>
                                                </div>
                                            {:else if nextBusItem.load.includes('Standing Available') }
                                                <div class="d-flex flex-row my-2">
                                                    <div 
                                                        style="
                                                            height: 2em;
                                                            width: 2em;
                                                            background-color: yellow;
                                                            border-radius: 50%;
                                                            display: inline-block;
                                                        "
                                                    ></div>
                                                    <div class="d-flex align-items-center mx-2">{nextBusItem.load}</div>
                                                </div>
                                            {:else if nextBusItem.load.includes('Seats Standing') }
                                                <div class="d-flex flex-row my-2">
                                                    <div 
                                                        style="
                                                            height: 2em;
                                                            width: 2em;
                                                            background-color: red;
                                                            border-radius: 50%;
                                                            display: inline-block;
                                                        "
                                                    ></div>
                                                    <div class="d-flex align-items-center mx-2">{nextBusItem.load}</div>
                                                </div>
                                            {/if}
    
                                            {#if nextBusItem.feature.includes('Wheel-Chair') }
                                                <div class="d-flex flex-row my-2">
                                                    <img src="images/wheel-chair.png" width="40" height="40" alt="" />
                                                    <div class="d-flex align-items-center mx-2">{nextBusItem.feature}</div>  
                                                </div>
                                            {:else}
                                                <div class="d-flex flex-row my-2">
                                                    <div class="d-flex align-items-center mx-2">{nextBusItem.feature}</div> 
                                                </div>
                                            {/if}
    
                                            {#if nextBusItem.type.includes('Single Deck') }
                                                <div class="d-flex flex-row my-2">
                                                    <img src="images/bus.png" width="40" height="40" alt="" />
                                                    <div class="d-flex align-items-center mx-2">{nextBusItem.type}</div>
                                                </div>
                                            {:else if nextBusItem.type.includes('Double Deck') }
                                                <div class="d-flex flex-row my-2">
                                                    <img src="images/bus-double-deck.png" width="40" height="40" alt="" />
                                                    <div class="d-flex align-items-center mx-2">{nextBusItem.type}</div>
                                                </div>
                                            {/if}
                                            
                                            <span class="hoverItem my-2" style="color: blue; text-decoration: underline;" on:click={() => handleCheckBusInMapClick(nextBusItem.latitude, nextBusItem.longitude)}>Check bus in map</span>
                                        </Card>
                                    </div>
                                {/each}
                            </Content>
                        </Card>
                    </div>
                {/each}
            </div>
        {/await}
    {:else}
        <div class="container">
            <div class="alert alert-secondary" role="alert">
                There is no data
            </div>
        </div>
    {/if}
</div>