<template>
    <div class="bg-white shadow-md rounded-md p-4 flex items-center mb-4 fixed top-0 mx-auto">
        <div class="mr-4">
            <img :class="iconClass" class="h-2 w-2" src="https://cdn-icons-png.flaticon.com/512/6595/6595920.png" alt="astrobot">
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
