<script lang="ts">
	import { currentPageStore } from './store';
	import MainView from './components/MainView.svelte';
	import Comment from './components/Comment.svelte';

	let currentPageValue = '';
	currentPageStore.subscribe((value) => {
		console.log('value = ', value);
		if (value) {
			currentPageValue = value;
		}
	})
</script>

<style>
	
</style>

<div>
	{#if currentPageValue }
		{#if currentPageValue === 'mainView' }
			<MainView />
		{:else if currentPageValue === 'comment'}
			<Comment />
		{/if}
	{/if}
</div>