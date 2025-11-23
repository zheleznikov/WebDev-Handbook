import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const NOTES_DIR = path.join(process.cwd(), "src/content/notes");

export type NoteMeta = {
    title?: string;
    slug?: string;
    author?: string;
    date?: string;
    [key: string]: any;
};

export type Note = {
    slug: string;
    meta: NoteMeta;
    content: string;
    tags?: string[];
};

export function getNoteSlugs(): string[] {
    return fs.readdirSync(NOTES_DIR).filter((file) => file.endsWith(".md"));
}

export function getNoteBySlug(slug: string): Note {
    const cleanSlug = slug.replace(/\.md$/, "");
    const fullPath = path.join(NOTES_DIR, `${cleanSlug}.md`);

    const raw = fs.readFileSync(fullPath, "utf8");
    const { content, data } = matter(raw);

    return {
        slug: cleanSlug,
        meta: data as NoteMeta,
        tags: Array.isArray(data.tags) ? data.tags : [],
        content
    };
}
