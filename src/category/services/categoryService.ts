import { Category, PrismaClient } from "@prisma/client";
import { CategoryModel } from "../models/CategoryModel.js";

export const allowedUsersAndMediaTypes = [
    // "Rap/Trap", 
    // "Indie / Alternative", 
    // "Pop Singer", 
    // "Singer", 
    // "Rock Singer", 
    // "Dancer", 
    "Articles Creator",
    "Content Creator",
    "Curator",
    "Reader/Subscriber",
    "Art Enthusiast",
    "Social Media Influencer",
    "Academic or Thought Leader",
    "Brand or Sponsor",
];

export const categoryServices = {

    async store (name: string): Promise<Category> {

        if (!name) {
            throw {status: 400, message: "Nome da categoria não informado"}
        }

        if (!allowedUsersAndMediaTypes.includes(name)) {
            throw {status: 400, message: "Categoria inexistente"}
        }

        const category = await CategoryModel.create({name});

        if (!category) {
            throw {status: 404, message: "Categoria não encontrada"};
        }

        return category;
    },

    
};