<script lang="ts">
    import { currentPageStore, itemIdStore } from '../store';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import _ from 'lodash';
    import moment from 'moment';
    import { Container, Card, Button } from 'svelte-chota';
    import { mdiKeyboardBackspace } from '@mdi/js';

    let comment: any = [];

    let id = '';
    itemIdStore.subscribe((value) => {
        console.log('value = ', value);
        if (value) {
            id = value;
        }
    });

    onMount(async () => {
        await getComments(id);
    });

    const getComments = async (id: string) => {
        const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`);
        console.log('response = ', response);
        
        if (response) {
            const responseData = response.data;
            if (responseData) {
                comment = _.concat(comment, responseData);

                if (!_.isEmpty(responseData.kids)) {
                    for (let index = 0; index < responseData.kids.length; index++) {
                        const id = responseData.kids[index].toString();
                        await getComments(id);
                    }
                }
            }
        }
    }

    const handleBackButtonClick = () => {
        currentPageStore.set('mainView');
    }
</script>

<style>
	
</style>

<div class="my-5 w-75" style="margin: 0 auto;">
	<Container>
        <div>
            <Button icon={mdiKeyboardBackspace} on:click={handleBackButtonClick} />
        </div>

        {#if !_.isEmpty(comment) }
            <div class="my-5">
                <h2>Comments</h2>
                {#each comment as item, i }
                    {#if i > 0 }
                        <Card class="p-4 my-4">
                            <div style="color: gray;"><i>{item.by} {moment().diff(moment.unix(item.time), 'minutes')} minutes ago</i></div>
                            <div class="my-3">{@html item.text}</div>
                        </Card>
                    {/if}
                {/each}
            </div>
        {/if}
    </Container>
</div>