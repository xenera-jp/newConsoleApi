import {contentArrayGet, contentArrayPost, contentArrayUpdate, contentArrayDelete} from "./content.routes.js";

const routesArrayGet = [
    ...contentArrayGet
]

const routesArrayPost = [
    ...contentArrayPost
]

const routesArrayDelete = [
    ...contentArrayDelete
]

const routesArrayUpdate = [
    ...contentArrayUpdate
]

export {routesArrayPost, routesArrayGet, routesArrayDelete, routesArrayUpdate};