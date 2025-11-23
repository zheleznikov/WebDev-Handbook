"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type NoteMeta = {
    title?: string;
    description?: string;
    tags?: string[];
};

type Note = {
    slug: string;
    meta: NoteMeta;
};

type Props = {
    notes: Note[];
};

export function NotesSearch({ notes }: Props) {



    const [query, setQuery] = useState("");

    const filteredNotes = useMemo(() => {
        const raw = query.trim().toLowerCase();
        if (!raw) return notes;

        const tokens = raw.split(/\s+/);

        // Теги: все слова, начинающиеся с "#"
        const tagFilters = tokens
            .filter((t) => t.startsWith("#"))
            .map((t) => t.slice(1))       // убираем "#"
            .filter(Boolean);             // убираем пустые строки типа "#"

        // Остальной текст — обычный поисковый запрос
        const textQuery = tokens
            .filter((t) => !t.startsWith("#"))
            .join(" ")
            .trim();

        return notes.filter((note) => {
            const title = (note.meta.title || note.slug).toLowerCase();
            const description = (note.meta.description || "").toLowerCase();
            const noteTags = (note.meta.tags || []).map((t) => t.toLowerCase());
            const tagsString = noteTags.join(" ");
            const slug = note.slug.toLowerCase();

            const matchesTags =
                tagFilters.length === 0 ||
                tagFilters.every((tag) => noteTags.includes(tag));

            const matchesText =
                !textQuery ||
                title.includes(textQuery) ||
                description.includes(textQuery) ||
                tagsString.includes(textQuery) ||
                slug.includes(textQuery);

            return matchesTags && matchesText;
        });
    }, [notes, query]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        notes.forEach(note => {
            (note.meta.tags || []).forEach(t => tags.add(t));
        });
        return Array.from(tags).sort();
    }, [notes]);


    const tagSuggestions = useMemo(() => {
        if (!query.startsWith("#")) return [];

        const clean = query.slice(1).toLowerCase();

        return allTags.filter(tag =>
            tag.toLowerCase().startsWith(clean)
        );
    }, [query, allTags]);


    return (
        <div className="space-y-4">

            {/* Поиск */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Поиск по заметкам и тегам..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="
                    w-full rounded-xl border border-slate-300
                    bg-white/80 text-slate-900
                    px-4 py-2.5 text-sm shadow-sm
                    placeholder:text-slate-400

                    dark:bg-slate-900/60 dark:border-slate-700
                    dark:text-slate-100 dark:placeholder:text-slate-500

                    focus:outline-none focus:ring-2 focus:ring-blue-500/60
                    focus:border-blue-500
                    transition-colors
                "
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery("")}
                        className="
                        absolute right-3 top-1/2 -translate-y-1/2
                        text-xs text-slate-400 hover:text-slate-600

                        dark:text-slate-500 dark:hover:text-slate-300
                        transition-colors
                    "
                    >
                        Очистить
                    </button>
                )}
                {tagSuggestions.length > 0 && (
                    <div
                        className="
                absolute left-0 right-0 mt-1
                bg-white dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                rounded-xl shadow-lg z-20
                max-h-60 overflow-y-auto
            "
                    >
                        {tagSuggestions.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setQuery(`#${tag}`)}
                                className="
                        w-full text-left px-4 py-2 text-sm
                        hover:bg-slate-100 dark:hover:bg-slate-700
                        text-slate-700 dark:text-slate-200
                    "
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Список заметок */}
            <ul className="space-y-3">
                {filteredNotes.length === 0 && (
                    <li className="text-sm text-slate-400 dark:text-slate-500">
                        Ничего не найдено по запросу «{query}».
                    </li>
                )}

                {filteredNotes.map((note) => (
                    <li key={note.slug}>
                        <Link
                            href={`/notes/${note.slug}`}
                            className="
                            block rounded-xl bg-white px-5 py-4 shadow-sm
                            border border-slate-200
                            hover:shadow-md hover:border-slate-300
                            transition-all duration-150

                            dark:bg-slate-900 dark:border-slate-700
                            dark:hover:border-slate-600 dark:hover:shadow-md
                        "
                        >
                            <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">
                                {note.meta.title || note.slug}
                            </h2>

                            {note.meta.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                    {note.meta.description}
                                </p>
                            )}

                            {note.meta.tags && note.meta.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {note.meta.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="
                                            inline-flex items-center rounded-full
                                            border border-emerald-100 bg-emerald-50
                                            text-emerald-700 px-2.5 py-0.5 text-xs font-medium

                                            dark:border-emerald-900/40 dark:bg-emerald-900/20
                                            dark:text-emerald-300
                                        "
                                        >
                                        {tag}
                                    </span>
                                    ))}
                                </div>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );

}
