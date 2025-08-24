<template>
    <div>
        <h1>User List</h1>
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.name }} - ${{ user.price }}
            </li>
        </ul>
    </div>
</template>