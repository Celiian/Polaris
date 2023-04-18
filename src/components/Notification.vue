<template>
    <div class="flex items-center p-4 bg-white rounded-lg shadow-xs opacity-60 mt-2">
        <div class="mr-4">
            <img :class="iconClass" class="h-12 w-12" src="https://cdn-icons-png.flaticon.com/512/6595/6595920.png"
                alt="astrobot">
        </div>
        <div>
            <h3 class="text-lg font-medium">{{ title }}</h3>
            <p class="text-gray-600">{{ message }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        iconClass: {
            type: String,
            required: true,
        },
    },
};
</script>

<style>
/* Ajoutez vos styles Tailwind ici */
</style>
