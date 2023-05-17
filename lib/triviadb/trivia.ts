import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { URLSearchParams } from 'url';

type SessionToken = {
    token: string;
}

type Category = {
    id: number;
    name: string;
}

type Categories = {
    trivia_categories: Category[]
}

type Question = {
    category: string;
    type: QuestionType;
    difficulty: QuestionDifficulty;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
};

type Questions = {
    results: Question[];
}

export enum QuestionDifficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
}

export enum QuestionType {
    Multiple = "multiple",
    TrueFalse = "boolean",
}

/**
 * OpenTriviaDb Wrapper
 */
export default class TriviaDb {

    client: AxiosInstance

    constructor() {
        this.client = axios.create({
            baseURL: 'https://opentdb.com/',
            timeout: 4000,
        })
    }

    /**
     * Retrieve a Session Token
     * @returns session token
     */
    async getSessionToken(): Promise<string> {
        const res = await this.client.get<SessionToken>('api_token.php?command=request')
        return res.data.token
    }

    /**
     * Reset a Session Token
     * @param token session token
     */
    async resetSessionToken(token: string): Promise<void> {
        await this.client.get(`api_token.php?command=reset&token=${token}`)
    }

    /**
     * Get Categories
     * @returns list of categories
     */
    async getCategories(): Promise<Category[]> {
        const res = await this.client.get<Categories>('api_category.php')
        return res.data.trivia_categories
    }

    /**
     * Get Questions
     * @param amount number of questions
     * @param categoryId id of the category
     * @param token token for getting unique questions
     * @param difficulty difficulty ("easy", "medium", "hard")
     * @param type typ of question ("multiple", "boolean")
     * @returns list of question
     */
    async getQuestions(amount: number, categoryId: number, token?: string, difficulty?: QuestionDifficulty, type?: QuestionType): Promise<Question[]> {
        let urlParams = `amount=${amount}&category=${categoryId}`
        if (difficulty != undefined) {
            urlParams += `&difficulty=${difficulty}`
        }
        if (type != undefined) {
            urlParams += `&type=${type}`
        }
        if (token != undefined) {
            urlParams += `&token=${token}`
        }
        const res = await this.client.get<Questions>(`api.php?${urlParams}`)
        return res.data.results
    }
}