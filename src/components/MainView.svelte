<script lang="ts">
    import { currentPageStore, itemIdStore } from '../store';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import _ from 'lodash';
    import { Container, Card, Button } from 'svelte-chota';
    import { getRootUrl } from '../common/common';

    const ROOT_URL = getRootUrl();
    
    let pageNumber = 1;
    let hackerNewsList = [];

    onMount(async () => {
        await getHackerNews(pageNumber);
    });

    const getHackerNews = async (pageNumber: number) => {
        const response = await axios.post(
            `${ROOT_URL}`, 
            {
                query: `
                    query hackerNews($pageNumber: Int) {
                        hackerNews(pageNumber: $pageNumber) {
                            id
                            title
                            uri
                            author
                            hours
                            points
                            comments
                            rank
                        }
                    }
                `,
                variables: {
                    pageNumber: pageNumber
                }
            },
        );
        
        console.log('response = ', response);
        if (response) {
            const responseData = response.data;
            if (responseData) {
                hackerNewsList = responseData.data.hackerNews;
            }
        }
    }

    const handleUriClick = (uri: string) => {
        window.open(uri);
    }

    const handlePreviousButtonClick = () => {
        if (pageNumber >= 2) {
            pageNumber -= 1;
            getHackerNews(pageNumber);
        }
    }

    const handleNextButtonClick = () => {
        pageNumber += 1;
        getHackerNews(pageNumber);
    }

    const handleCommentClick = (id: string) => {
        currentPageStore.set('comment');
        itemIdStore.set(id);
    }
</script>

<style>
	
</style>

<div class="my-5 w-75" style="margin: 0 auto;">
	<Container>
        {#if !_.isEmpty(hackerNewsList)}
            <h2>Hacker News</h2>

            {#each hackerNewsList as item }
                <Card class="p-4 my-4">
                    <h3><b>{item.title}</b></h3>
                    <div class="hoverItem" style="color: blue;" on:click={() => handleUriClick(item.uri)}>{item.uri}</div>
                    <div class="my-3">
                        <div class="fs-5" style="color: gray;">
                            <div class="fs-5"><i>{item.points} by {item.author} {item.hours}</i> | <span class="hoverItem" on:click={() => handleCommentClick(item.id)}>{item.comments}</span></div>
                        </div>
                        <div class="mt-3">Rank: {item.rank}</div>
                    </div>
                </Card>
            {/each}

            <div class="my-3">
                <div class="d-flex flex-row justify-content-between">
                    <div>
                        <Button secondary on:click={handlePreviousButtonClick}>Back</Button>
                    </div>
                    <div class="d-flex align-items-center"><b>{pageNumber}</b></div>
                    <div>
                        <Button primary on:click={handleNextButtonClick}>Next</Button>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 0.5em; visibility: hidden;">test</div>
        {:else}
            <Card class="p-4 my-4">
                <h3>There are no data.</h3> 
            </Card>
        {/if}
    </Container>
</div>