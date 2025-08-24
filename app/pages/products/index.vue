<template>
    <div>
        <h1>Product List</h1>
        <ul>
            <li v-for="product in products" :key="product.id">
                {{ product.name }} - ${{ product.price }}
            </li>
        </ul>
    </div>
</template>